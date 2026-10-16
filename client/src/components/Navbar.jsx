import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  LayoutDashboard,
  Calculator,
  History,
  AlertCircle,
  MapPin,
  TrendingUp,
  Bell,
  LogOut,
  User,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import NotificationDrawer from './NotificationDrawer';
import api from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const isAdmin = user?.role === 'admin';

  // Check if senior citizen
  let isSenior = false;
  if (user?.dateOfBirth) {
    const dob = new Date(user.dateOfBirth);
    const ageDiffMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age >= 60) isSenior = true;
  }

  return (
    <>
      <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2.5 group">
                <div className="bg-gradient-to-tr from-brand-600 to-emerald-400 p-2 rounded-xl text-white shadow-sm group-hover:scale-105 transition">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-black tracking-tight leading-none text-white">
                    PROP<span className="text-brand-400">TAX</span> <span className="text-emerald-400 text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 ml-1">Team VEM</span>
                  </div>
                  <div className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                    Self-Assessment & Compliance
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {!isAdmin ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive('/dashboard') ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>

                  <Link
                    to="/properties"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive('/properties') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    My Properties
                  </Link>

                  <Link
                    to="/tax-calculator"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive('/tax-calculator') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <Calculator className="w-4 h-4 text-emerald-400" />
                    Calculate Tax
                  </Link>

                  <Link
                    to="/payment-history"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive('/payment-history') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <History className="w-4 h-4" />
                    Payments & Receipts
                  </Link>

                  <Link
                    to="/grievances"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive('/grievances') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    Appeals
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/admin"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive('/admin') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Admin Overview
                  </Link>

                  <Link
                    to="/admin/gis-map"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive('/admin/gis-map') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-rose-400" />
                    GIS Anomaly Map
                  </Link>

                  <Link
                    to="/admin/grievances"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      isActive('/admin/grievances') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    Citizen Appeals
                  </Link>
                </>
              )}
            </div>

            {/* Right Side: Notifications & User Profile */}
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
                title="Municipal Alerts"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 px-3 py-1.5 rounded-xl border border-slate-700 transition text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                      {user?.name?.split(' ')[0] || 'User'}
                      {isAdmin && (
                        <span className="bg-purple-900/80 text-purple-300 text-[9px] font-bold px-1.5 py-0.2 rounded">
                          ADMIN
                        </span>
                      )}
                      {isSenior && (
                        <span className="bg-amber-900/80 text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded">
                          SENIOR
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight">
                      {isAdmin ? 'Municipal Admin' : 'Registered Taxpayer'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-in fade-in duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          Role: {user?.role}
                        </span>
                        {user?.isDifferentlyAbled && (
                          <span className="text-[10px] font-medium bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                            Differently Abled (20% Off)
                          </span>
                        )}
                        {isSenior && (
                          <span className="text-[10px] font-medium bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                            Senior Citizen (15% Off)
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-over Notification Drawer */}
      <NotificationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        notifications={notifications}
        onNotificationUpdate={fetchNotifications}
      />
    </>
  );
};

export default Navbar;
