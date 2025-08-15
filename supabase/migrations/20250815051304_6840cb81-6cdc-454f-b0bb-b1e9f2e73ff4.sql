-- Temporarily remove foreign key constraint to allow demo data
ALTER TABLE public.chefs DROP CONSTRAINT chefs_user_id_fkey;

-- Add a nullable user_id for demo data
ALTER TABLE public.chefs ALTER COLUMN user_id DROP NOT NULL;

-- Insert sample chefs without user_id constraint
INSERT INTO public.chefs (id, specialty, bio, price_level, rating, total_reviews, service_radius_km, lat, lng, address, city, state) VALUES
  ('chef-1', 'Culinária Italiana', 'Chef especializado em massas artesanais e pratos tradicionais italianos. 15 anos de experiência em restaurantes renomados.', 3, 4.8, 127, 15, -23.550520, -46.633309, 'Rua Augusta, 1000', 'São Paulo', 'SP'),
  ('chef-2', 'Culinária Brasileira', 'Especialista em pratos regionais brasileiros, com foco na culinária mineira e nordestina. Ingredientes frescos e orgânicos.', 2, 4.9, 89, 20, -23.561414, -46.656166, 'Rua dos Pinheiros, 500', 'São Paulo', 'SP'),
  ('chef-3', 'Culinária Japonesa', 'Mestre em sushi e pratos tradicionais japoneses. Formação no Japão e 20 anos de experiência.', 4, 4.7, 156, 12, -23.574320, -46.688954, 'Rua da Consolação, 300', 'São Paulo', 'SP'),
  ('chef-4', 'Culinária Francesa', 'Chef patissier com especialização em culinária francesa clássica e contemporânea. Formação em Paris.', 4, 4.6, 94, 18, -23.558740, -46.658930, 'Alameda Santos, 800', 'São Paulo', 'SP'),
  ('chef-5', 'Culinária Vegana', 'Especialista em culinária plant-based e sustentável. Criação de pratos nutritivos e saborosos sem ingredientes de origem animal.', 2, 4.5, 73, 25, -23.533773, -46.625290, 'Rua Oscar Freire, 200', 'São Paulo', 'SP');

-- Insert sample dishes
INSERT INTO public.dishes (chef_id, name, description, image_url, prep_time_minutes, price_per_person, is_featured) VALUES
  ('chef-1', 'Lasagna alla Bolognese', 'Lasagna tradicional com molho bolognesa caseiro, queijos italianos e massa fresca', '/api/placeholder/400/300', 120, 45.00, true),
  ('chef-1', 'Risotto ai Funghi Porcini', 'Risotto cremoso com cogumelos porcini, parmesão e vinho branco', '/api/placeholder/400/300', 45, 38.00, false),
  ('chef-1', 'Osso Buco alla Milanese', 'Osso buco tradicional milanês com risotto açafrão', '/api/placeholder/400/300', 180, 65.00, false),
  
  ('chef-2', 'Feijoada Completa', 'Feijoada tradicional com acompanhamentos: arroz, farofa, couve e laranja', '/api/placeholder/400/300', 240, 32.00, true),
  ('chef-2', 'Moqueca de Peixe', 'Moqueca capixaba com peixe fresco, leite de coco e dendê', '/api/placeholder/400/300', 60, 42.00, false),
  ('chef-2', 'Pato no Tucumã', 'Prato amazônico com pato, tucumã e temperos regionais', '/api/placeholder/400/300', 150, 55.00, false),
  
  ('chef-3', 'Sushi Premium', 'Combinado premium com sashimi, nigiri e rolls especiais', '/api/placeholder/400/300', 60, 85.00, true),
  ('chef-3', 'Tempura Gozen', 'Set tradicional com tempura de camarão e vegetais, arroz e misoshiru', '/api/placeholder/400/300', 45, 48.00, false),
  ('chef-3', 'Ramen Tonkotsu', 'Ramen tradicional com caldo de osso de porco e chashu', '/api/placeholder/400/300', 30, 35.00, false),
  
  ('chef-4', 'Coq au Vin', 'Frango ao vinho tinto com cogumelos e bacon, acompanha purê trufado', '/api/placeholder/400/300', 120, 58.00, true),
  ('chef-4', 'Bouillabaisse', 'Sopa provençal de frutos do mar com rouille e croûtons', '/api/placeholder/400/300', 90, 72.00, false),
  ('chef-4', 'Tarte Tatin', 'Torta francesa de maçã caramelizada com sorvete de baunilha', '/api/placeholder/400/300', 75, 28.00, false),
  
  ('chef-5', 'Buddha Bowl', 'Bowl nutritivo com quinoa, legumes grelhados, tahine e sementes', '/api/placeholder/400/300', 30, 28.00, true),
  ('chef-5', 'Hambúrguer Vegano', 'Hambúrguer de grão-de-bico e beterraba com pão artesanal', '/api/placeholder/400/300', 25, 22.00, false),
  ('chef-5', 'Lasagna de Berinjela', 'Lasagna vegana com berinjela, molho de tomate e queijo vegetal', '/api/placeholder/400/300', 90, 35.00, false);