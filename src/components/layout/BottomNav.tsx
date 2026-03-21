import { Home, BookOpen, Trophy, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  {
    icon: Home,
    label: 'Home',
    path: '/home',
    matches: ['/home', '/challenge/daily', '/results'],
  },
  {
    icon: BookOpen,
    label: 'Practice',
    path: '/practice',
    matches: ['/practice', '/tracks/'],
  },
  {
    icon: Trophy,
    label: 'Leaderboard',
    path: '/leaderboard',
    matches: ['/leaderboard'],
  },
  {
    icon: User,
    label: 'Profile',
    path: '/profile',
    matches: ['/profile', '/settings'],
  },
] as const;

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 px-4 pb-5">
      <div className="rounded-[28px] border border-white/[0.06] bg-[rgba(10,13,24,0.96)] px-2 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.01)_inset] backdrop-blur-sm">
        <div className="flex items-center justify-between gap-1">
          {navItems.map(({ icon: Icon, label, path, matches }) => {
            const active = matches.some((match) =>
              match.endsWith('/')
                ? location.pathname.startsWith(match)
                : location.pathname === match
            );

            return (
              <button
                key={path}
                type="button"
                onClick={() => navigate(path)}
                aria-label={label}
                className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 transition-all duration-150 ${
                  active ? 'bg-white/[0.03]' : 'bg-transparent'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-2xl transition-all duration-150 ${
                    active ? 'bg-gold-muted' : 'bg-transparent'
                  }`}
                >
                  <Icon
                    size={18}
                    className={active ? 'text-gold' : 'text-text-muted'}
                    strokeWidth={active ? 2.3 : 1.9}
                  />
                </div>

                <span
                  className={`truncate text-[10px] font-medium tracking-wide ${
                    active ? 'text-gold' : 'text-text-muted'
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}