import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart,
  Settings,
  FileText,
  MessageCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileMenuProps {
  onNavigate: (route: string) => void;
}

export function ProfileMenu({ onNavigate }: ProfileMenuProps) {
  const { user, userProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user || !userProfile) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    {
      icon: Heart,
      label: 'Favoritos',
      action: () => onNavigate('customer-favorites')
    },
    {
      icon: Settings,
      label: 'Configurações',
      action: () => onNavigate('profile-settings')
    },
    {
      icon: FileText,
      label: 'Histórico',
      action: () => onNavigate('customer-history')
    },
    {
      icon: MessageCircle,
      label: 'Chat',
      action: () => onNavigate('chat')
    }
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="relative h-12 w-12 rounded-full p-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar className="h-12 w-12">
          <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.full_name} />
          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
            {getInitials(userProfile.full_name)}
          </AvatarFallback>
        </Avatar>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.8,
                y: -20,
                transformOrigin: 'top center'
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.8,
                y: -20
              }}
              transition={{
                type: "spring",
                duration: 0.3,
                bounce: 0.1
              }}
              className="absolute top-full mt-2 right-0 z-50 bg-card border rounded-lg shadow-card p-2 min-w-[200px]"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-3 p-3 border-b">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.full_name} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    {getInitials(userProfile.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{userProfile.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}