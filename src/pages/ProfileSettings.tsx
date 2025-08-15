import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, MapPin, Phone, Mail, User, ChefHat } from 'lucide-react';

interface ProfileSettingsProps {
  onBack: () => void;
}

export default function ProfileSettings({ onBack }: ProfileSettingsProps) {
  const { user, userProfile, userRole } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    avatar_url: ''
  });

  const [chefData, setChefData] = useState({
    specialty: '',
    bio: '',
    address: '',
    city: '',
    state: '',
    service_radius_km: 10,
    price_level: 1
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        full_name: userProfile.full_name || '',
        phone: userProfile.phone || '',
        avatar_url: userProfile.avatar_url || ''
      });
    }
  }, [userProfile]);

  useEffect(() => {
    if (userRole === 'chef' && user) {
      loadChefData();
    }
  }, [userRole, user]);

  const loadChefData = async () => {
    if (!user) return;
    
    const { data: chef } = await supabase
      .from('chefs')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (chef) {
      setChefData({
        specialty: chef.specialty || '',
        bio: chef.bio || '',
        address: chef.address || '',
        city: chef.city || '',
        state: chef.state || '',
        service_radius_km: chef.service_radius_km || 10,
        price_level: chef.price_level || 1
      });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram salvas com sucesso.',
      });
    }

    setIsLoading(false);
  };

  const handleChefUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    // First check if chef profile exists
    const { data: existingChef } = await supabase
      .from('chefs')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let error;
    if (existingChef) {
      // Update existing chef profile
      const { error: updateError } = await supabase
        .from('chefs')
        .update(chefData)
        .eq('user_id', user.id);
      error = updateError;
    } else {
      // Create new chef profile
      const { error: insertError } = await supabase
        .from('chefs')
        .insert({
          ...chefData,
          user_id: user.id
        });
      error = insertError;
    }

    if (error) {
      toast({
        title: 'Erro ao atualizar dados do chef',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Dados do chef atualizados',
        description: 'Suas informações profissionais foram salvas.',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b px-4 py-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Configurações do Perfil</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Dados Pessoais
            </TabsTrigger>
            {userRole === 'chef' && (
              <TabsTrigger value="chef" className="flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Dados Profissionais
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize suas informações básicas de perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nome Completo</Label>
                    <Input
                      id="full_name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar_url">URL da Foto de Perfil</Label>
                    <Input
                      id="avatar_url"
                      type="url"
                      value={profileData.avatar_url}
                      onChange={(e) => setProfileData({ ...profileData, avatar_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      O email não pode ser alterado
                    </p>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {userRole === 'chef' && (
            <TabsContent value="chef">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Profissionais</CardTitle>
                  <CardDescription>
                    Configure seus dados como chef profissional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChefUpdate} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Especialidade</Label>
                      <Input
                        id="specialty"
                        value={chefData.specialty}
                        onChange={(e) => setChefData({ ...chefData, specialty: e.target.value })}
                        placeholder="Ex: Culinária Italiana, Francesa, Japonesa..."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Biografia</Label>
                      <Textarea
                        id="bio"
                        value={chefData.bio}
                        onChange={(e) => setChefData({ ...chefData, bio: e.target.value })}
                        placeholder="Conte um pouco sobre sua experiência e estilo culinário..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          value={chefData.city}
                          onChange={(e) => setChefData({ ...chefData, city: e.target.value })}
                          placeholder="São Paulo"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          value={chefData.state}
                          onChange={(e) => setChefData({ ...chefData, state: e.target.value })}
                          placeholder="SP"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço Completo</Label>
                      <Input
                        id="address"
                        value={chefData.address}
                        onChange={(e) => setChefData({ ...chefData, address: e.target.value })}
                        placeholder="Rua, número, bairro..."
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Raio de Atendimento: {chefData.service_radius_km} km</Label>
                      <Slider
                        value={[chefData.service_radius_km]}
                        onValueChange={(value) => setChefData({ ...chefData, service_radius_km: value[0] })}
                        max={50}
                        min={5}
                        step={5}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Defina a distância máxima que você atende a partir da sua localização
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label>Nível de Preço: {chefData.price_level}/5</Label>
                      <Slider
                        value={[chefData.price_level]}
                        onValueChange={(value) => setChefData({ ...chefData, price_level: value[0] })}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Econômico</span>
                        <span>Premium</span>
                      </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? 'Salvando...' : 'Salvar Dados Profissionais'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}