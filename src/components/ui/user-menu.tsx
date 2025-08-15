import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  ChefHat, 
  Heart,
  Calendar,
  FileText,
  Users,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface UserMenuProps {
  onNavigate: (route: string) => void;
}

export function UserMenu({ onNavigate }: UserMenuProps) {
  const { user, userProfile, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user) {
    return (
      <Button onClick={() => navigate('/auth')} variant="outline">
        Entrar
      </Button>
    );
  }

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Erro ao sair',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Logout realizado',
        description: 'Até logo!',
      });
      navigate('/');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'chef': return <ChefHat className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'admin': return 'Administrador';
      case 'chef': return 'Chef';
      default: return 'Cliente';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.full_name} />
            <AvatarFallback>
              {userProfile?.full_name ? getInitials(userProfile.full_name) : 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userProfile?.full_name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-1 mt-1">
              {getRoleIcon()}
              <span className="text-xs text-muted-foreground">{getRoleLabel()}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        {/* Admin Menu */}
        {userRole === 'admin' && (
          <>
            <DropdownMenuItem onClick={() => onNavigate('admin-dashboard')}>
              <Shield className="mr-2 h-4 w-4" />
              Painel Administrativo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('admin-users')}>
              <Users className="mr-2 h-4 w-4" />
              Gerenciar Usuários
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('admin-chefs')}>
              <ChefHat className="mr-2 h-4 w-4" />
              Gerenciar Chefs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('admin-bookings')}>
              <Calendar className="mr-2 h-4 w-4" />
              Todos os Agendamentos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('admin-reviews')}>
              <Star className="mr-2 h-4 w-4" />
              Gerenciar Avaliações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Chef Menu */}
        {userRole === 'chef' && (
          <>
            <DropdownMenuItem onClick={() => onNavigate('chef-dashboard')}>
              <ChefHat className="mr-2 h-4 w-4" />
              Painel do Chef
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('chef-profile')}>
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('chef-dishes')}>
              <FileText className="mr-2 h-4 w-4" />
              Meus Pratos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('chef-bookings')}>
              <Calendar className="mr-2 h-4 w-4" />
              Meus Agendamentos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('chef-reviews')}>
              <Star className="mr-2 h-4 w-4" />
              Minhas Avaliações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Customer Menu */}
        {userRole === 'customer' && (
          <>
            <DropdownMenuItem onClick={() => onNavigate('customer-dashboard')}>
              <User className="mr-2 h-4 w-4" />
              Meu Painel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('customer-bookings')}>
              <Calendar className="mr-2 h-4 w-4" />
              Meus Agendamentos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('customer-favorites')}>
              <Heart className="mr-2 h-4 w-4" />
              Chefs Favoritos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('customer-history')}>
              <FileText className="mr-2 h-4 w-4" />
              Histórico
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={() => onNavigate('profile-settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Configurações
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}