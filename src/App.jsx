import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './components/Theme'
import { ToastProvider } from './components/Toast'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Stations from './pages/Stations'
import RaceSim from './pages/RaceSim'
import Progress from './pages/Progress'
import Classes from './pages/Classes'
import Profile from './pages/Profile'
import CalculatorPage from './pages/Calculator'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/stations" element={<Stations />} />
            <Route path="/race" element={<RaceSim />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/home" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ToastProvider>
    </ThemeProvider>
  )
}
