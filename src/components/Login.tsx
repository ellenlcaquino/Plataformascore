import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { QualityMapAppLogo } from './QualityMapAppLogo';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Users, Shield } from 'lucide-react';
import svgPaths from '../imports/svg-8cuw9bbxi0';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Email ou senha incorretos');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { 
      email: 'admin@qualitymap.app', 
      role: 'System Manager', 
      icon: Shield,
      description: 'Acesso total ao sistema'
    },
    { 
      email: 'leader@demo.com', 
      role: 'Líder da Empresa', 
      icon: Users,
      description: 'Gestão da empresa e equipe'
    },
    { 
      email: 'member@demo.com', 
      role: 'Membro da Equipe', 
      icon: Users,
      description: 'Acesso aos resultados'
    }
  ];

  const quickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Left Side - Brand Section */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-[55%] bg-gradient-to-br from-[#0575e6] via-[#02298a] to-[#021b79] overflow-hidden">
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
              A plataforma completa para avaliação e evolução da maturidade em qualidade de software
            </p>
            
            <Button 
              variant="outline" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0575e6] transition-all duration-300"
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
            >
              <Users className="h-4 w-4 mr-2" />
              {showDemoAccounts ? 'Ocultar Contas Demo' : 'Ver Contas Demo'}
            </Button>

            {/* Demo Accounts Cards */}
            {showDemoAccounts && (
              <div className="mt-8 space-y-3">
                <p className="text-white/80 text-sm mb-4">Clique para preencher o formulário:</p>
                {demoAccounts.map((account, index) => {
                  const Icon = account.icon;
                  return (
                    <div
                      key={index}
                      onClick={() => quickLogin(account.email)}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 cursor-pointer hover:bg-white/20 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-all">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{account.email}</div>
                          <div className="text-white/70 text-sm">{account.role}</div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  );
                })}
                <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <p className="text-white/90 text-sm text-center">
                    <strong>Senha padrão:</strong> <code className="bg-white/20 px-2 py-1 rounded">demo123</code>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="relative min-h-screen lg:ml-[55%] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Olá novamente!
            </h2>
            <p className="text-lg text-gray-600">
              Bem-vindo de volta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 pl-14 pr-6 bg-white border-2 border-gray-200 rounded-full text-base focus:border-[#0575e6] focus:ring-0 transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 pl-14 pr-14 bg-white border-2 border-gray-200 rounded-full text-base focus:border-[#0575e6] focus:ring-0 transition-all"
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

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#0575e6] hover:bg-[#0461c7] text-white text-base font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? 'Entrando...' : 'Login'}
            </Button>

            {/* Forgot Password */}
            <div className="text-center">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>
          </form>

          {/* Demo Access Info - Mobile */}
          <div className="mt-8 lg:hidden">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Acesso Demo
              </h3>
              <div className="space-y-2">
                {demoAccounts.map((account, index) => (
                  <button
                    key={index}
                    onClick={() => quickLogin(account.email)}
                    className="w-full text-left p-3 bg-white rounded-xl hover:bg-blue-50 transition-colors border border-gray-200"
                  >
                    <div className="text-sm font-medium text-gray-900">{account.email}</div>
                    <div className="text-xs text-gray-500">{account.role}</div>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-600 text-center">
                Senha: <code className="bg-white px-2 py-0.5 rounded">demo123</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
