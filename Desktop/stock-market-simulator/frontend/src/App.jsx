import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { TrendingUp, PieChart, History, ShieldAlert, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Portfolio from './pages/Portfolio/Portfolio';
import RiskAnalytics from './pages/Risk/RiskAnalytics';
import ProtectedRoute from './components/ProtectedRoute';
import { useState } from 'react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      <aside className={`w-64 h-screen bg-dark-card border-r border-dark-border flex flex-col fixed left-0 top-0 z-40 transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between text-primary font-bold text-2xl uppercase tracking-tighter italic">
          <div className="flex items-center gap-2">
            <TrendingUp size={30} strokeWidth={3} />
            <span>TradeSim.</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400">
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-1 py-6">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" to="/" onClick={() => setIsOpen(false)} />
          <NavItem icon={<PieChart size={20} />} label="My Portfolio" to="/portfolio" onClick={() => setIsOpen(false)} />
          <NavItem icon={<History size={20} />} label="Transactions" to="/transactions" onClick={() => setIsOpen(false)} />
          <NavItem icon={<ShieldAlert size={20} />} label="Risk Engine" to="/risk" onClick={() => setIsOpen(false)} />
        </nav>
        <div className="p-4 space-y-2 border-t border-dark-border">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:bg-secondary/10 transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

const NavItem = ({ icon, label, to, onClick }) => (
  <NavLink 
    to={to} 
    onClick={onClick}
    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
      isActive ? 'bg-primary text-dark shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-dark-hover hover:text-white'
    }`}
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

import Transactions from './pages/Transactions/Transactions';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="flex bg-dark min-h-screen text-white">
              <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
              <div className="flex-1 flex flex-col min-w-0">
                <header className="lg:hidden p-4 border-b border-dark-border flex items-center justify-between sticky top-0 bg-dark z-20">
                  <div className="flex items-center gap-2 text-primary font-bold text-xl uppercase tracking-tighter italic">
                    <TrendingUp size={24} strokeWidth={3} />
                    <span>TradeSim.</span>
                  </div>
                  <button onClick={() => setIsSidebarOpen(true)} className="text-gray-400">
                    <Menu size={24} />
                  </button>
                </header>
                <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto">
                  <div className="max-w-7xl mx-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/risk" element={<RiskAnalytics />} />
                      <Route path="/transactions" element={<Transactions />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}



export default App;
