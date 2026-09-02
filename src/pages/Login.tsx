import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type AuthMode = 'sign_in' | 'sign_up' | 'forgotten_password';

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'sign_in') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === 'sign_up') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        setMessage({
          type: 'success',
          text: 'Cuenta creada. Revisa tu correo para verificar tu cuenta.',
        });
      } else if (mode === 'forgotten_password') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage({
          type: 'success',
          text: 'Se enviaron instrucciones a tu correo electrónico.',
        });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Ocurrió un error',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setMessage(null);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="150" stroke="white" strokeWidth="1"/>
            <circle cx="200" cy="200" r="100" stroke="white" strokeWidth="1"/>
            <circle cx="200" cy="200" r="50" stroke="white" strokeWidth="1"/>
            <line x1="50" y1="200" x2="350" y2="200" stroke="white" strokeWidth="1"/>
            <line x1="200" y1="50" x2="200" y2="350" stroke="white" strokeWidth="1"/>
            <path d="M 100 200 Q 200 100 300 200" stroke="white" strokeWidth="1" fill="none"/>
            <path d="M 100 200 Q 200 300 300 200" stroke="white" strokeWidth="1" fill="none"/>
          </svg>
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-[#D4A017] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#1B4332]" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight">ColCom Trade</span>
            </div>
            <p className="text-lg text-emerald-100 max-w-md">
              Plataforma profesional de cotización y análisis financiero para exportación de aguacate Hass.
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Cotizaciones precisas y estructuradas' },
              { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'Análisis de rentabilidad en tiempo real' },
              { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Gestión de clientes y trazabilidad' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-emerald-100">
                <div className="w-8 h-8 rounded-full bg-[#D4A017]/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#D4A017]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#2D6A4F] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#D4A017]" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-[#1B4332]">ColCom Trade</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center lg:text-left">
              {mode === 'sign_in' && 'Bienvenido'}
              {mode === 'sign_up' && 'Crear cuenta'}
              {mode === 'forgotten_password' && 'Recuperar contraseña'}
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center lg:text-left">
              {mode === 'sign_in' && 'Ingrese sus credenciales para acceder a la plataforma'}
              {mode === 'sign_up' && 'Ingrese sus datos para crear una cuenta'}
              {mode === 'forgotten_password' && 'Ingrese su correo para recibir instrucciones'}
            </p>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'sign_up' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition-colors"
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            {mode !== 'forgotten_password' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition-colors"
                  placeholder={mode === 'sign_up' ? 'Mínimo 6 caracteres' : '••••••••'}
                  required
                  minLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  {mode === 'sign_in' && 'Iniciar sesión'}
                  {mode === 'sign_up' && 'Crear cuenta'}
                  {mode === 'forgotten_password' && 'Enviar instrucciones'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            {mode === 'sign_in' && (
              <button
                type="button"
                onClick={() => { setMode('forgotten_password'); resetForm(); }}
                className="w-full text-sm text-[#2D6A4F] hover:text-[#1B4332] hover:underline"
              >
                ¿Olvidó su contraseña?
              </button>
            )}

            {(mode === 'sign_in' || mode === 'forgotten_password') && (
              <button
                type="button"
                onClick={() => { setMode('sign_up'); resetForm(); }}
                className="w-full text-sm text-[#2D6A4F] hover:text-[#1B4332] hover:underline"
              >
                ¿No tiene cuenta? Crear cuenta
              </button>
            )}

            {mode === 'sign_up' && (
              <button
                type="button"
                onClick={() => { setMode('sign_in'); resetForm(); }}
                className="w-full text-sm text-[#2D6A4F] hover:text-[#1B4332] hover:underline"
              >
                ¿Ya tiene cuenta? Iniciar sesión
              </button>
            )}

            {mode === 'forgotten_password' && (
              <button
                type="button"
                onClick={() => { setMode('sign_in'); resetForm(); }}
                className="w-full text-sm text-[#2D6A4F] hover:text-[#1B4332] hover:underline"
              >
                Volver al inicio de sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
