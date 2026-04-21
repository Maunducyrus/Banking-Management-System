import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Shield, Eye, EyeOff, UserPlus, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi, type RegisterPayload } from '../../services/api';


type Tab = 'signin' | 'register';

const EMPTY_REG: RegisterPayload = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const LoginForm: React.FC = () => {
  const [tab, setTab] = useState<Tab>('signin');
  const { login, isLoading } = useAuth();

  // Sign-in state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register state
  const [reg, setReg] = useState<RegisterPayload>({ ...EMPTY_REG });
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  // ── Sign In ──────────────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    //debugging
    console.log('SIGN IN CLICKED');
    setLoginError('');

    
    if (!email || !password) {
      setLoginError('Please enter both email and password.');
      return;
    }
    const success = await login(email, password);
    // debugging
    console.log('LOGIN RESULT:', success);

    if (success) {
      toast.success('Welcome back!');
    } else {
      setLoginError('Invalid credentials. Please check your email and password.');
    }
  };

  const fillDemo = () => {
    setEmail('itsdevelelopernic22@gmail.com');
    setPassword('123$Nick.');
    setLoginError('');
  };

  // ── Register ─────────────────────────────────────────────────────────────────
  const regField = (k: keyof RegisterPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setReg(p => ({ ...p, [k]: e.target.value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reg.firstName || !reg.lastName || !reg.email || !reg.phoneNumber || !reg.password) {
      toast.error('Please fill all required fields.');
      return;
    }
    if (reg.password !== reg.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setRegistering(true);
    try {
      await authApi.register(reg);

  //   await authApi.activateUser({
  //   email: reg.email,
  //   option: 'True',
  // });
  
      setRegistered(true);
      toast.success('Registration successful! You can now sign in.');
    } catch (err: any) {
      toast.error(err.message ?? 'Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cyan-600/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/40 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Tujipange</h1>
          <p className="text-blue-300 text-sm mt-1">P2P Welfare Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-white/10">
            {(['signin', 'register'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setLoginError(''); setRegistered(false); }}
                className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                  tab === t
                    ? 'text-white bg-blue-600/20 border-b-2 border-blue-400'
                    : 'text-blue-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {t === 'signin' ? <LogIn size={15} /> : <UserPlus size={15} />}
                {t === 'signin' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* ── SIGN IN ── */}
            {tab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-5">
                {loginError && (
                  <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                    <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                    <p className="text-red-300 text-sm">{loginError}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setLoginError(''); }}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition"
                    >
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      <LogIn size={16} /> Sign In
                    </>
                  )}
                </button>

                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs text-blue-300 text-center mb-2">Demo Credentials</p>
                  <button
                    type="button"
                    onClick={fillDemo}
                    className="w-full py-2 text-xs text-blue-300 hover:text-white hover:bg-white/5 rounded-xl transition border border-white/10"
                  >
                    itsdevelelopernic22@gmail.com
                  </button>
                </div>
              </form>
            )}

            {/* ── REGISTER ── */}
            {tab === 'register' && (
              registered ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} className="text-green-400" />
                  </div>
                  <h3 className="text-white font-bold text-lg">Registration Successful!</h3>
                  <p className="text-blue-300 text-sm">Your account has been created. Switch to Sign In to continue.</p>
                  <button
                    onClick={() => { setTab('signin'); setRegistered(false); }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition"
                  >
                    Go to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {([
                      ['First Name *', 'firstName', 'text'],
                      ['Last Name *', 'lastName', 'text'],
                    ] as [string, keyof RegisterPayload, string][]).map(([label, key, type]) => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-blue-200 mb-1">{label}</label>
                        <input
                          type={type}
                          value={String(reg[key])}
                          onChange={regField(key)}
                          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                        />
                      </div>
                    ))}
                  </div>

                  {([
                    ['Email *', 'email', 'email'],
                    ['Phone Number *', 'phoneNumber', 'tel'],
                  ] as [string, keyof RegisterPayload, string][]).map(([label, key, type]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-blue-200 mb-1">{label}</label>
                      <input
                        type={type}
                        value={String(reg[key])}
                        onChange={regField(key)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-medium text-blue-200 mb-1">Password *</label>
                    <div className="relative">
                      <input
                        type={showRegPwd ? 'text' : 'password'}
                        value={reg.password}
                        onChange={regField('password')}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition pr-10"
                        placeholder="Min 8 chars, include symbol"
                      />
                      <button type="button" onClick={() => setShowRegPwd(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white">
                        {showRegPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-blue-200 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      value={reg.confirmPassword}
                      onChange={regField('confirmPassword')}
                      className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition ${
                        reg.confirmPassword && reg.password !== reg.confirmPassword
                          ? 'border-red-500/50'
                          : 'border-white/10'
                      }`}
                      placeholder="Repeat password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={registering}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-600/30 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                  >
                    {registering ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Registering…
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} /> Create Account
                      </>
                    )}
                  </button>
                </form>
              )
            )}
          </div>
        </div>

        <p className="text-center text-blue-400/50 text-xs mt-6">
          © {new Date().getFullYear()} Tujipange Welfare System
        </p>
      </div>
    </div>
  );
};
