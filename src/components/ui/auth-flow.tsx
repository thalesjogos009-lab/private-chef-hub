import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from "lucide-react";

interface AuthFlowProps {
  mode: 'login' | 'signup' | 'chef-signup';
  onBack: () => void;
  onSuccess: () => void;
  onModeChange: (mode: 'login' | 'signup' | 'chef-signup') => void;
}

export function AuthFlow({ mode, onBack, onSuccess, onModeChange }: AuthFlowProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode !== 'login') {
      if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
      if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
      if (mode === 'signup' && !formData.address.trim()) newErrors.address = 'Endereço é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (mode !== 'login' && formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (mode !== 'login' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    onSuccess();
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Entrar';
      case 'signup': return 'Criar Conta';
      case 'chef-signup': return 'Cadastro de Chef';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">{getTitle()}</h1>
            <p className="text-muted-foreground">
              {mode === 'login' 
                ? 'Acesse sua conta para continuar'
                : mode === 'chef-signup'
                  ? 'Junte-se à nossa rede de chefs'
                  : 'Crie sua conta e descubra chefs incríveis'
              }
            </p>
          </div>

          <Card className="p-6 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field (signup modes only) */}
              {mode !== 'login' && (
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nome completo *
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                </div>
              )}

              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  E-mail *
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
              </div>

              {/* Phone Field (signup modes only) */}
              {mode !== 'login' && (
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Telefone *
                  </Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                </div>
              )}

              {/* Address Field (user signup only) */}
              {mode === 'signup' && (
                <div>
                  <Label htmlFor="address" className="text-sm font-medium">
                    Endereço *
                  </Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="address"
                      type="text"
                      placeholder="Rua, número, bairro"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                  {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
                </div>
              )}

              {/* Password Field */}
              <div>
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha *
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password (signup modes only) */}
              {mode !== 'login' && (
                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirmar senha *
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirme sua senha"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-hero"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processando...
                  </div>
                ) : (
                  getTitle()
                )}
              </Button>

              {/* Forgot Password (login only) */}
              {mode === 'login' && (
                <div className="text-center">
                  <Button variant="link" className="text-sm text-muted-foreground">
                    Esqueci minha senha
                  </Button>
                </div>
              )}
            </form>
          </Card>

          {/* Mode Switch Links */}
          <div className="text-center mt-6 space-y-2">
            {mode === 'login' ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Não tem conta?{' '}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary"
                    onClick={() => onModeChange('signup')}
                  >
                    Criar conta
                  </Button>
                </p>
                <p className="text-sm text-muted-foreground">
                  É chef?{' '}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-accent"
                    onClick={() => onModeChange('chef-signup')}
                  >
                    Cadastre-se como chef
                  </Button>
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Já tem conta?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary"
                  onClick={() => onModeChange('login')}
                >
                  Entrar
                </Button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}