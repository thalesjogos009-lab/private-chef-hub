import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Heart, Clock, Star, User, ChefHat } from 'lucide-react';

interface CustomerStats {
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
  favoriteChefs: number;
  recentBookings: any[];
  favoriteChefsList: any[];
}

interface CustomerDashboardProps {
  onNavigate: (route: string) => void;
}

export function CustomerDashboard({ onNavigate }: CustomerDashboardProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<CustomerStats>({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    favoriteChefs: 0,
    recentBookings: [],
    favoriteChefsList: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCustomerData();
    }
  }, [user]);

  const loadCustomerData = async () => {
    try {
      // Get customer bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          *,
          chefs!inner(specialty, rating)
        `)
        .eq('customer_id', user?.id);

      const { data: recentBookings } = await supabase
        .from('bookings')
        .select(`
          *,
          chefs!inner(specialty, rating)
        `)
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get favorite chefs
      const { data: favorites } = await supabase
        .from('favorites')
        .select(`
          *,
          chefs!inner(specialty, rating, city, state)
        `)
        .eq('customer_id', user?.id);

      const totalBookings = bookings?.length || 0;
      const today = new Date();
      const upcomingBookings = bookings?.filter(b => {
        const bookingDate = new Date(b.date);
        return bookingDate >= today && (b.status === 'confirmed' || b.status === 'pending');
      }).length || 0;
      const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;

      setStats({
        totalBookings,
        upcomingBookings,
        completedBookings,
        favoriteChefs: favorites?.length || 0,
        recentBookings: recentBookings || [],
        favoriteChefsList: favorites || [],
      });
    } catch (error) {
      console.error('Error loading customer data:', error);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meu Painel</h1>
        <p className="text-muted-foreground">
          Gerencie seus agendamentos e chefs favoritos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos Agendamentos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.upcomingBookings}</div>
            <p className="text-xs text-muted-foreground">
              Confirmados ou pendentes
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
            <CardTitle className="text-sm font-medium">Chefs Favoritos</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.favoriteChefs}</div>
            <p className="text-xs text-muted-foreground">
              Salvos na sua lista
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Satisfação</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedBookings > 0 ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Serviços concluídos
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
            <Button onClick={() => onNavigate('discover')} variant="outline" className="h-20">
              <div className="text-center">
                <ChefHat className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Encontrar Chef</span>
              </div>
            </Button>
            <Button onClick={() => onNavigate('customer-bookings')} variant="outline" className="h-20">
              <div className="text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Meus Agendamentos</span>
              </div>
            </Button>
            <Button onClick={() => onNavigate('customer-favorites')} variant="outline" className="h-20">
              <div className="text-center">
                <Heart className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Chefs Favoritos</span>
              </div>
            </Button>
            <Button onClick={() => onNavigate('customer-history')} variant="outline" className="h-20">
              <div className="text-center">
                <User className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm">Histórico</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <p className="font-medium">{booking.chefs?.specialty}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.guests} pessoa(s) • R$ {parseFloat(booking.total_price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

        {/* Favorite Chefs */}
        <Card>
          <CardHeader>
            <CardTitle>Chefs Favoritos</CardTitle>
            <CardDescription>Seus chefs preferidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.favoriteChefsList.map((favorite) => (
                <div key={favorite.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{favorite.chefs?.specialty}</p>
                    <p className="text-sm text-muted-foreground">
                      {favorite.chefs?.city}, {favorite.chefs?.state}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{favorite.chefs?.rating}</span>
                  </div>
                </div>
              ))}
              {stats.favoriteChefsList.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum chef favorito ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}