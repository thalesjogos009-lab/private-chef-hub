import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, ChefHat, Calendar, Star, TrendingUp, DollarSign } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalChefs: number;
  totalBookings: number;
  totalReviews: number;
  recentBookings: any[];
  topChefs: any[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalChefs: 0,
    totalBookings: 0,
    totalReviews: 0,
    recentBookings: [],
    topChefs: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get total users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total chefs
      const { count: chefCount } = await supabase
        .from('chefs')
        .select('*', { count: 'exact', head: true });

      // Get total bookings
      const { count: bookingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Get total reviews
      const { count: reviewCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });

      // Get recent bookings
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select(`
          *,
          chefs!inner(specialty)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get top rated chefs
      const { data: topChefs } = await supabase
        .from('chefs')
        .select('*')
        .order('rating', { ascending: false })
        .limit(5);

      setStats({
        totalUsers: userCount || 0,
        totalChefs: chefCount || 0,
        totalBookings: bookingCount || 0,
        totalReviews: reviewCount || 0,
        recentBookings: recentBookings || [],
        topChefs: topChefs || [],
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-muted-foreground">Visão geral da plataforma Chef em Casa</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Clientes e chefs registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chefs Ativos</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChefs}</div>
            <p className="text-xs text-muted-foreground">
              Profissionais disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              Total de serviços agendados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              Feedbacks dos clientes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos Recentes</CardTitle>
            <CardDescription>Últimos 5 agendamentos na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{booking.chefs?.specialty}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.guests} pessoa(s) • R$ {booking.total_price}
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
                  Nenhum agendamento encontrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Chefs */}
        <Card>
          <CardHeader>
            <CardTitle>Chefs Mais Bem Avaliados</CardTitle>
            <CardDescription>Top 5 chefs por avaliação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topChefs.map((chef, index) => (
                <div key={chef.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{chef.specialty}</p>
                      <p className="text-sm text-muted-foreground">
                        {chef.city}, {chef.state}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{chef.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {chef.total_reviews} avaliações
                    </p>
                  </div>
                </div>
              ))}
              {stats.topChefs.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum chef encontrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}