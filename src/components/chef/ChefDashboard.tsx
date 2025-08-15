import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Star, DollarSign, Clock, TrendingUp, Users } from 'lucide-react';

interface ChefStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  recentBookings: any[];
  monthlyRevenue: number;
}

interface ChefDashboardProps {
  onNavigate: (route: string) => void;
}

export function ChefDashboard({ onNavigate }: ChefDashboardProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<ChefStats>({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });
  const [chefProfile, setChefProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadChefData();
    }
  }, [user]);

  const loadChefData = async () => {
    try {
      // Get chef profile
      const { data: chef } = await supabase
        .from('chefs')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      setChefProfile(chef);

      if (chef) {
        // Get booking stats
        const { data: bookings } = await supabase
          .from('bookings')
          .select('*')
          .eq('chef_id', chef.id);

        const { data: recentBookings } = await supabase
          .from('bookings')
          .select('*')
          .eq('chef_id', chef.id)
          .order('created_at', { ascending: false })
          .limit(5);

        const totalBookings = bookings?.length || 0;
        const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
        const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
        const totalRevenue = bookings
          ?.filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + (parseFloat(b.total_price?.toString() || '0') || 0), 0) || 0;

        // Get current month revenue
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = bookings
          ?.filter(b => {
            const bookingDate = new Date(b.created_at);
            return b.status === 'completed' && 
                   bookingDate.getMonth() === currentMonth && 
                   bookingDate.getFullYear() === currentYear;
          })
          .reduce((sum, b) => sum + (parseFloat(b.total_price?.toString() || '0') || 0), 0) || 0;

        setStats({
          totalBookings,
          pendingBookings,
          completedBookings,
          totalRevenue,
          averageRating: chef.rating || 0,
          totalReviews: chef.total_reviews || 0,
          recentBookings: recentBookings || [],
          monthlyRevenue,
        });
      }
    } catch (error) {
      console.error('Error loading chef data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!chefProfile) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Perfil de Chef Não Encontrado</CardTitle>
            <CardDescription>
              Você precisa criar seu perfil de chef primeiro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => onNavigate('chef-profile')}>
              Criar Perfil de Chef
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Painel do Chef</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta, {chefProfile.specialty}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedBookings} concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalReviews} avaliações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              De todos os serviços
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalBookings > 0 ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Agendamentos concluídos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesse rapidamente as principais funcionalidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button onClick={() => onNavigate('chef-profile')} variant="outline" className="h-20">
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Editar Perfil</span>
              </div>
            </Button>
            <Button onClick={() => onNavigate('chef-dishes')} variant="outline" className="h-20">
              <div className="text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Gerenciar Pratos</span>
              </div>
            </Button>
            <Button onClick={() => onNavigate('chef-bookings')} variant="outline" className="h-20">
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Ver Agendamentos</span>
              </div>
            </Button>
            <Button onClick={() => onNavigate('chef-reviews')} variant="outline" className="h-20">
              <div className="text-center">
                <Star className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Ver Avaliações</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos Recentes</CardTitle>
          <CardDescription>Seus últimos 5 agendamentos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">
                    {new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.guests} pessoa(s) • {booking.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    R$ {parseFloat(booking.total_price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status === 'pending' && 'Pendente'}
                  {booking.status === 'confirmed' && 'Confirmado'}
                  {booking.status === 'completed' && 'Concluído'}
                  {booking.status === 'cancelled' && 'Cancelado'}
                </Badge>
              </div>
            ))}
            {stats.recentBookings.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nenhum agendamento ainda
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}