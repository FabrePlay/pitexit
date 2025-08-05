import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { signIn, signUp, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    first_name: '',
    last_name: '',
    phone: '',
    country: 'Chile',
    city: '',
    industry: '',
    experience: 'Principiante'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('🔐 Starting authentication process...');

    if (isLogin) {
      console.log('📧 Attempting login with email:', formData.email);
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        console.error('Login error:', error);
        setError(error.message || 'Error al iniciar sesión');
      } else {
        console.log('✅ Login successful');
        onClose();
      }
    } else {
      // Validaciones de registro
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      if (formData.password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres');
        return;
      }
      
      const { error } = await signUp(formData.email, formData.password, {});
      
      if (error) {
        console.error('Signup error:', error);
        setError(error.message || 'Error al crear la cuenta');
      } else {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-dark-surface w-full max-w-2xl rounded-xl p-6 relative max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-6 gradient-text">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="••••••••"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Confirmar Contraseña *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full neon-button mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ 
                email: '', 
                password: '', 
                confirmPassword: '', 
                username: '',
                first_name: '',
                last_name: '',
                phone: '',
                country: 'Chile',
                city: '',
                industry: '',
                experience: 'Principiante'
              });
            }}
            className="text-neon-blue hover:text-white transition-colors text-sm"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </motion.div>
    </div>
  );
}