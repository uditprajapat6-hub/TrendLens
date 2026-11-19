import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import Compare from "./pages/Compare";
import Regions from "./pages/Regions";
import Settings from "./pages/Settings";
import ChangePassword from "./pages/ChangePassword";
import EditProfile from "./pages/EditProfile";
export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/compare" element={<Compare />} />
                  <Route path="/regions" element={<Regions />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/edit-profile" element={<EditProfile />} />
                  
                  <Route
  path="/change-password"
  element={<ChangePassword />}
/>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
