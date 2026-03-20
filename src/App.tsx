import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import ChallengeScreen from './screens/ChallengeScreen';
import ChallengesScreen from './screens/ChallengesScreen';
import ResultsScreen from './screens/ResultsScreen';
import TracksScreen from './screens/TracksScreen';
import TrackDetailScreen from './screens/TrackDetailScreen';
import PracticeScreen from './screens/PracticeScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import AuthScreen from './screens/AuthScreen';
import { supabase } from './lib/supabase';

function ProtectedRoute({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        setSession(session);
        setAuthLoading(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#05060b] font-sans text-white">
        <div className="app-shell mx-auto flex min-h-screen max-w-md items-center justify-center px-4">
          <div className="text-sm text-text-secondary">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#05060b] font-sans">
        <div className="relative mx-auto min-h-screen max-w-md">
          <Routes>
            <Route
              path="/"
              element={
                session ? <Navigate to="/home" replace /> : <WelcomeScreen />
              }
            />
            <Route
              path="/auth"
              element={
                session ? <Navigate to="/home" replace /> : <AuthScreen />
              }
            />

            <Route
              path="/home"
              element={
                <ProtectedRoute session={session}>
                  <HomeScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenge/daily"
              element={
                <ProtectedRoute session={session}>
                  <ChallengeScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenges"
              element={
                <ProtectedRoute session={session}>
                  <ChallengesScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute session={session}>
                  <ResultsScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracks"
              element={
                <ProtectedRoute session={session}>
                  <TracksScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracks/:trackId"
              element={
                <ProtectedRoute session={session}>
                  <TrackDetailScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/practice/:trackId"
              element={
                <ProtectedRoute session={session}>
                  <PracticeScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute session={session}>
                  <LeaderboardScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute session={session}>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute session={session}>
                  <SettingsScreen />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={<Navigate to={session ? '/home' : '/auth'} replace />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}