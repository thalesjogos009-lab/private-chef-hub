-- Insert sample data
-- Note: We'll create mock users and data for demonstration
-- In a real app, users would be created through authentication

-- First, let's insert some mock chefs data
INSERT INTO public.profiles (id, user_id, email, full_name, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'admin@chefemcasa.com', 'Admin Sistema', 'admin'),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'chef1@chefemcasa.com', 'Carlos Silva', 'chef'),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'chef2@chefemcasa.com', 'Maria Santos', 'chef'),
  ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'chef3@chefemcasa.com', 'João Oliveira', 'chef'),
  ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'chef4@chefemcasa.com', 'Ana Costa', 'chef'),
  ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', 'chef5@chefemcasa.com', 'Pedro Rocha', 'chef'),
  ('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', 'customer1@gmail.com', 'Cliente Teste', 'customer');

-- Insert chefs data
INSERT INTO public.chefs (id, user_id, specialty, bio, price_level, rating, total_reviews, service_radius_km, lat, lng, address, city, state) VALUES
  ('chef-1', '550e8400-e29b-41d4-a716-446655440002', 'Culinária Italiana', 'Chef especializado em massas artesanais e pratos tradicionais italianos. 15 anos de experiência em restaurantes renomados.', 3, 4.8, 127, 15, -23.550520, -46.633309, 'Rua Augusta, 1000', 'São Paulo', 'SP'),
  ('chef-2', '550e8400-e29b-41d4-a716-446655440003', 'Culinária Brasileira', 'Especialista em pratos regionais brasileiros, com foco na culinária mineira e nordestina. Ingredientes frescos e orgânicos.', 2, 4.9, 89, 20, -23.561414, -46.656166, 'Rua dos Pinheiros, 500', 'São Paulo', 'SP'),
  ('chef-3', '550e8400-e29b-41d4-a716-446655440004', 'Culinária Japonesa', 'Mestre em sushi e pratos tradicionais japoneses. Formação no Japão e 20 anos de experiência.', 4, 4.7, 156, 12, -23.574320, -46.688954, 'Rua da Consolação, 300', 'São Paulo', 'SP'),
  ('chef-4', '550e8400-e29b-41d4-a716-446655440005', 'Culinária Francesa', 'Chef patissier com especialização em culinária francesa clássica e contemporânea. Formação em Paris.', 4, 4.6, 94, 18, -23.558740, -46.658930, 'Alameda Santos, 800', 'São Paulo', 'SP'),
  ('chef-5', '550e8400-e29b-41d4-a716-446655440006', 'Culinária Vegana', 'Especialista em culinária plant-based e sustentável. Criação de pratos nutritivos e saborosos sem ingredientes de origem animal.', 2, 4.5, 73, 25, -23.533773, -46.625290, 'Rua Oscar Freire, 200', 'São Paulo', 'SP');

-- Insert dishes
INSERT INTO public.dishes (id, chef_id, name, description, image_url, prep_time_minutes, price_per_person, is_featured) VALUES
  ('dish-1', 'chef-1', 'Lasagna alla Bolognese', 'Lasagna tradicional com molho bolognesa caseiro, queijos italianos e massa fresca', '/api/placeholder/400/300', 120, 45.00, true),
  ('dish-2', 'chef-1', 'Risotto ai Funghi Porcini', 'Risotto cremoso com cogumelos porcini, parmesão e vinho branco', '/api/placeholder/400/300', 45, 38.00, false),
  ('dish-3', 'chef-1', 'Osso Buco alla Milanese', 'Osso buco tradicional milanês com risotto açafrão', '/api/placeholder/400/300', 180, 65.00, false),
  
  ('dish-4', 'chef-2', 'Feijoada Completa', 'Feijoada tradicional com acompanhamentos: arroz, farofa, couve e laranja', '/api/placeholder/400/300', 240, 32.00, true),
  ('dish-5', 'chef-2', 'Moqueca de Peixe', 'Moqueca capixaba com peixe fresco, leite de coco e dendê', '/api/placeholder/400/300', 60, 42.00, false),
  ('dish-6', 'chef-2', 'Pato no Tucumã', 'Prato amazônico com pato, tucumã e temperos regionais', '/api/placeholder/400/300', 150, 55.00, false),
  
  ('dish-7', 'chef-3', 'Sushi Premium', 'Combinado premium com sashimi, nigiri e rolls especiais', '/api/placeholder/400/300', 60, 85.00, true),
  ('dish-8', 'chef-3', 'Tempura Gozen', 'Set tradicional com tempura de camarão e vegetais, arroz e misoshiru', '/api/placeholder/400/300', 45, 48.00, false),
  ('dish-9', 'chef-3', 'Ramen Tonkotsu', 'Ramen tradicional com caldo de osso de porco e chashu', '/api/placeholder/400/300', 30, 35.00, false),
  
  ('dish-10', 'chef-4', 'Coq au Vin', 'Frango ao vinho tinto com cogumelos e bacon, acompanha purê trufado', '/api/placeholder/400/300', 120, 58.00, true),
  ('dish-11', 'chef-4', 'Bouillabaisse', 'Sopa provençal de frutos do mar com rouille e croûtons', '/api/placeholder/400/300', 90, 72.00, false),
  ('dish-12', 'chef-4', 'Tarte Tatin', 'Torta francesa de maçã caramelizada com sorvete de baunilha', '/api/placeholder/400/300', 75, 28.00, false),
  
  ('dish-13', 'chef-5', 'Buddha Bowl', 'Bowl nutritivo com quinoa, legumes grelhados, tahine e sementes', '/api/placeholder/400/300', 30, 28.00, true),
  ('dish-14', 'chef-5', 'Hambúrguer Vegano', 'Hambúrguer de grão-de-bico e beterraba com pão artesanal', '/api/placeholder/400/300', 25, 22.00, false),
  ('dish-15', 'chef-5', 'Lasagna de Berinjela', 'Lasagna vegana com berinjela, molho de tomate e queijo vegetal', '/api/placeholder/400/300', 90, 35.00, false);

-- Insert sample bookings
INSERT INTO public.bookings (id, customer_id, chef_id, date, time, guests, address, observations, status, total_price) VALUES
  ('booking-1', '550e8400-e29b-41d4-a716-446655440007', 'chef-1', '2025-01-20', '19:00', 4, 'Rua das Flores, 123 - Jardins, São Paulo/SP', 'Aniversário de casamento', 'confirmed', 180.00),
  ('booking-2', '550e8400-e29b-41d4-a716-446655440007', 'chef-2', '2025-01-15', '12:00', 6, 'Av. Paulista, 1000 - Bela Vista, São Paulo/SP', 'Almoço de negócios', 'completed', 192.00),
  ('booking-3', '550e8400-e29b-41d4-a716-446655440007', 'chef-3', '2025-01-25', '20:00', 2, 'Rua Oscar Freire, 500 - Jardins, São Paulo/SP', 'Jantar romântico', 'pending', 170.00);

-- Insert sample reviews
INSERT INTO public.reviews (id, booking_id, customer_id, chef_id, rating, comment) VALUES
  ('review-1', 'booking-2', '550e8400-e29b-41d4-a716-446655440007', 'chef-2', 5, 'Experiência incrível! A feijoada estava perfeita e o atendimento foi excepcional.'),
  ('review-2', 'booking-2', '550e8400-e29b-41d4-a716-446655440007', 'chef-2', 4, 'Muito bom, apenas o tempero poderia estar um pouco mais acentuado.');

-- Insert sample favorites
INSERT INTO public.favorites (customer_id, chef_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440007', 'chef-1'),
  ('550e8400-e29b-41d4-a716-446655440007', 'chef-3');