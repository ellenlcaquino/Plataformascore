import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { QualityMapAppLogo } from './QualityMapAppLogo';
import { Mail, Lock, Eye, EyeOff, User, Building2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface RegisterProps {
  onBackToLogin: () => void;
}

export function Register({ onBackToLogin }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  // Validação de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação de nome da empresa (mínimo 2 caracteres, sem apenas números)
  const validateCompanyName = (name: string): boolean => {
    if (name.trim().length < 2) return false;
    // Não pode ser apenas números
    if (/^\d+$/.test(name.trim())) return false;
    return true;
  };

  // Validação de senha (mínimo 6 caracteres)
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // Validar campo individual
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        return value.trim().length < 2 ? 'Nome deve ter pelo menos 2 caracteres' : '';
      case 'email':
        return !validateEmail(value) ? 'Email inválido' : '';
      case 'companyName':
        if (value.trim().length < 2) return 'Nome da empresa deve ter pelo menos 2 caracteres';
        if (/^\d+$/.test(value.trim())) return 'Nome da empresa não pode ser apenas números';
        return '';
      case 'password':
        return !validatePassword(value) ? 'Senha deve ter pelo menos 6 caracteres' : '';
      case 'confirmPassword':
        return value !== formData.password ? 'As senhas não coincidem' : '';
      default:
        return '';
    }
  };

  // Handle input change com validação
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Validar confirmação de senha quando mudar a senha principal
    if (field === 'password' && formData.confirmPassword) {
      const confirmError = value !== formData.confirmPassword ? 'As senhas não coincidem' : '';
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  // Handle blur (validação ao sair do campo)
  const handleBlur = (field: string) => {
    const error = validateField(field, formData[field as keyof typeof formData]);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos os campos
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);

    try {
      const success = await register({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        companyName: formData.companyName.trim(),
        password: formData.password
      });

      if (success) {
        toast.success('Conta criada com sucesso! Redirecionando...');
        // O AuthContext já faz o login automático
      } else {
        toast.error('Erro ao criar conta. Tente novamente.');
      }
    } catch (err: any) {
      console.error('Erro no registro:', err);
      
      // Tratar erros específicos
      if (err.message?.includes('email')) {
        setErrors({ email: 'Este email já está em uso' });
        toast.error('Este email já está cadastrado');
      } else if (err.message?.includes('company')) {
        setErrors({ companyName: 'Erro ao processar nome da empresa' });
        toast.error('Erro ao processar empresa');
      } else {
        toast.error('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Left Side - Brand Section */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-[55%] bg-gradient-to-br from-[#16a34a] via-[#15803d] to-[#166534] overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute left-[-10%] bottom-[15%] opacity-20">
          <svg className="w-[600px] h-[600px]" fill="none" viewBox="0 0 638 583">
            <circle cx="359.5" cy="304.5" r="278" stroke="#ffffff" strokeWidth="1" />
            <circle cx="278.5" cy="278.5" r="278" stroke="#ffffff" strokeWidth="1" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full px-12 lg:px-20">
          <div className="max-w-xl">
            <div className="-mb-6">
              <QualityMapAppLogo size="5xl" showText={false} />
            </div>
            
            <p className="text-xl text-white/90 mb-8">
              Junte-se a equipes que estão evoluindo a maturidade em qualidade de software
            </p>
            
            <div className="space-y-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-4">Por que se registrar?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-white/90 mt-0.5 flex-shrink-0" />
                  <p className="text-white/80 text-sm">
                    Acesse avaliações completas de maturidade em qualidade
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-white/90 mt-0.5 flex-shrink-0" />
                  <p className="text-white/80 text-sm">
                    Colabore com sua equipe em rodadas de avaliação
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-white/90 mt-0.5 flex-shrink-0" />
                  <p className="text-white/80 text-sm">
                    Visualize resultados e evolução ao longo do tempo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="relative min-h-screen lg:ml-[55%] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back to Login */}
          <button
            onClick={onBackToLogin}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Login
          </button>

          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Criar Conta
            </h2>
            <p className="text-lg text-gray-600">
              Comece sua jornada de qualidade
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Nome completo"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  className={`w-full h-14 pl-14 pr-6 bg-white border-2 rounded-full text-base focus:ring-0 transition-all ${
                    errors.name 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-[#16a34a]'
                  }`}
                  required
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-2 ml-6 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full h-14 pl-14 pr-6 bg-white border-2 rounded-full text-base focus:ring-0 transition-all ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-[#16a34a]'
                  }`}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 ml-6 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Company Name Field */}
            <div>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Nome da Empresa"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  onBlur={() => handleBlur('companyName')}
                  className={`w-full h-14 pl-14 pr-6 bg-white border-2 rounded-full text-base focus:ring-0 transition-all ${
                    errors.companyName 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-[#16a34a]'
                  }`}
                  required
                />
              </div>
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-2 ml-6 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.companyName}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-2 ml-6">
                O nome da empresa será usado para agrupar avaliações e rodadas
              </p>
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha (mínimo 6 caracteres)"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`w-full h-14 pl-14 pr-14 bg-white border-2 rounded-full text-base focus:ring-0 transition-all ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-[#16a34a]'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 ml-6 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmar senha"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`w-full h-14 pl-14 pr-14 bg-white border-2 rounded-full text-base focus:ring-0 transition-all ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-[#16a34a]'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2 ml-6 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#16a34a] hover:bg-[#15803d] text-white text-base font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl mt-6"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>

            {/* Terms */}
            <p className="text-center text-xs text-gray-500 mt-4">
              Ao criar uma conta, você concorda com nossos{' '}
              <a href="#" className="text-[#16a34a] hover:underline">
                Termos de Serviço
              </a>{' '}
              e{' '}
              <a href="#" className="text-[#16a34a] hover:underline">
                Política de Privacidade
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
