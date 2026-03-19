import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import ChallengeScreen from './screens/ChallengeScreen';
import ResultsScreen from './screens/ResultsScreen';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base font-sans">
        {/* Mobile-first container: centered on desktop, full width on mobile */}
        <div className="max-w-md mx-auto min-h-screen relative bg-base">
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/challenge/:id" element={<ChallengeScreen />} />
            <Route path="/results" element={<ResultsScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
