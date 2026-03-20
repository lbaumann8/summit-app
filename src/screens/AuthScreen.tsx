import { useState } from 'react';
import { BarChart3, Mail, Lock, User } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';

type AuthMode = 'sign-in' | 'sign-up';

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorText, setErrorText] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage('');
    setErrorText('');

    try {
      if (mode === 'sign-up') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: name.trim(),
            },
          },
        });

        if (error) throw error;

        setMessage(
          'Account created. Check your email if confirmation is required, then sign in.'
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Auth error:', error);

        const message =
        error instanceof Error ? error.message : 'Something went wrong';
      setErrorText(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell flex min-h-screen flex-col text-white">
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-5 text-center">
            <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/20 bg-gold-muted text-gold">
              <BarChart3 size={24} />
            </div>

            <h1 className="text-[32px] font-bold leading-[1.02] text-text-primary">
              Summit
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Sign in to save your streak, Edge Points, and daily calls.
            </p>
          </div>

          <Card className="p-5">
            <div className="mb-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('sign-in')}
                className={`rounded-[18px] border px-4 py-3 text-sm font-semibold transition-all ${
                  mode === 'sign-in'
                    ? 'border-gold/40 bg-gold-muted text-gold'
                    : 'border-white/[0.06] bg-white/[0.02] text-text-secondary'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => setMode('sign-up')}
                className={`rounded-[18px] border px-4 py-3 text-sm font-semibold transition-all ${
                  mode === 'sign-up'
                    ? 'border-gold/40 bg-gold-muted text-gold'
                    : 'border-white/[0.06] bg-white/[0.02] text-text-secondary'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'sign-up' && (
                <label className="block">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
                    Name
                  </div>
                  <div className="flex items-center gap-3 rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                    <User size={16} className="text-text-muted" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                    />
                  </div>
                </label>
              )}

              <label className="block">
                <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
                  Email
                </div>
                <div className="flex items-center gap-3 rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <Mail size={16} className="text-text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
                  Password
                </div>
                <div className="flex items-center gap-3 rounded-[20px] border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <Lock size={16} className="text-text-muted" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    autoComplete={
                      mode === 'sign-up' ? 'new-password' : 'current-password'
                    }
                    className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                    required
                  />
                </div>
              </label>

              {message && (
                <div className="rounded-[18px] border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                  {message}
                </div>
              )}

              {errorText && (
                <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {errorText}
                </div>
              )}

              <Button fullWidth type="submit" disabled={loading}>
                {loading
                  ? mode === 'sign-in'
                    ? 'Signing In...'
                    : 'Creating Account...'
                  : mode === 'sign-in'
                  ? 'Sign In'
                  : 'Create Account'}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}