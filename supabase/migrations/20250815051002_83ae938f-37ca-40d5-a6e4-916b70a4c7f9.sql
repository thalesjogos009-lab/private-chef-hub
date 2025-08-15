-- Create enum types
CREATE TYPE public.user_role AS ENUM ('admin', 'customer', 'chef');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chefs table
CREATE TABLE public.chefs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL,
  bio TEXT,
  price_level INTEGER NOT NULL DEFAULT 1 CHECK (price_level >= 1 AND price_level <= 4),
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  service_radius_km INTEGER DEFAULT 10,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  address TEXT,
  city TEXT,
  state TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dishes table
CREATE TABLE public.dishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chef_id UUID NOT NULL REFERENCES public.chefs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  prep_time_minutes INTEGER,
  price_per_person DECIMAL(10,2),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chef_id UUID NOT NULL REFERENCES public.chefs(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INTEGER NOT NULL,
  address TEXT NOT NULL,
  observations TEXT,
  status public.booking_status NOT NULL DEFAULT 'pending',
  total_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chef_id UUID NOT NULL REFERENCES public.chefs(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chef_id UUID NOT NULL REFERENCES public.chefs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(customer_id, chef_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Usuário'),
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'customer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update chef rating
CREATE OR REPLACE FUNCTION public.update_chef_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chefs
  SET 
    rating = (
      SELECT COALESCE(AVG(rating::DECIMAL), 0)
      FROM public.reviews
      WHERE chef_id = NEW.chef_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE chef_id = NEW.chef_id
    )
  WHERE id = NEW.chef_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update chef rating when review is added
CREATE TRIGGER update_chef_rating_trigger
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_chef_rating();

-- Create function to check user role (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS public.user_role AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for chefs
CREATE POLICY "Everyone can view active chefs" ON public.chefs FOR SELECT USING (is_active = true);
CREATE POLICY "Chefs can update own data" ON public.chefs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all chefs" ON public.chefs FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Users can create chef profile" ON public.chefs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for dishes
CREATE POLICY "Everyone can view active dishes" ON public.dishes FOR SELECT USING (
  is_active = true AND EXISTS (
    SELECT 1 FROM public.chefs WHERE id = dishes.chef_id AND is_active = true
  )
);
CREATE POLICY "Chefs can manage own dishes" ON public.dishes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.chefs WHERE id = dishes.chef_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage all dishes" ON public.dishes FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for bookings
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (
  customer_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.chefs WHERE id = bookings.chef_id AND user_id = auth.uid())
);
CREATE POLICY "Customers can create bookings" ON public.bookings FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Chefs can update bookings for their services" ON public.bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.chefs WHERE id = bookings.chef_id AND user_id = auth.uid())
);
CREATE POLICY "Customers can update own bookings" ON public.bookings FOR UPDATE USING (customer_id = auth.uid());
CREATE POLICY "Admins can manage all bookings" ON public.bookings FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for reviews
CREATE POLICY "Everyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Customers can create reviews for their bookings" ON public.reviews FOR INSERT WITH CHECK (
  customer_id = auth.uid() AND 
  EXISTS (SELECT 1 FROM public.bookings WHERE id = reviews.booking_id AND customer_id = auth.uid())
);
CREATE POLICY "Admins can manage all reviews" ON public.reviews FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for favorites
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL USING (customer_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chefs_updated_at BEFORE UPDATE ON public.chefs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dishes_updated_at BEFORE UPDATE ON public.dishes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();