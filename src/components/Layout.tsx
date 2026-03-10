import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ShieldAlert, ClipboardCheck, ListTodo, LogOut, QrCode, Zap, Database, ClipboardList } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Tổng quan', path: '/', icon: Home, roles: ['admin', 'manager', 'supervisor', 'safety_officer', 'staff'] },
    { name: 'Quét QR', path: '/scan', icon: QrCode, roles: ['admin', 'manager', 'supervisor', 'safety_officer', 'staff'] },
    { name: 'PCCC', path: '/pccc/form', icon: ShieldAlert, roles: ['admin', 'manager', 'supervisor', 'safety_officer', 'staff'] },
    { name: '6S', path: '/inspection/form', icon: ClipboardCheck, roles: ['admin', 'manager', 'supervisor', 'safety_officer', 'staff'] },
    { name: 'Điện', path: '/elec/form', icon: Zap, roles: ['admin', 'manager', 'supervisor', 'safety_officer', 'staff'] },
    { name: 'Công việc', path: '/tasks', icon: ListTodo, roles: ['admin', 'manager', 'supervisor', 'safety_officer', 'staff'] },
    { name: 'Nhật ký', path: '/history', icon: ClipboardList, roles: ['admin', 'manager', 'supervisor', 'safety_officer'] },
    { name: 'Ngân hàng CH', path: '/admin/questions', icon: Database, roles: ['admin', 'manager'] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-primary-600 text-white p-4 sticky top-0 z-20 shadow-md">
        <h1 className="text-xl font-bold">HSE Platform</h1>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r h-screen sticky top-0 z-20 shadow-lg">
        <div className="p-6 bg-primary-600">
          <h1 className="text-2xl font-bold text-white">HSE Platform</h1>
          <p className="text-primary-100 text-sm mt-1">{profile?.full_name || 'Hệ thống Quản lý HSE'}</p>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.filter(item => !profile || item.roles.includes(profile.role)).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              
              return (
                <li key={item.path} className="px-4">
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                      isActive 
                        ? "bg-primary-50 text-primary-700 shadow-sm" 
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Icon size={20} className={cn("transition-colors", isActive ? "text-primary-600" : "text-gray-500")} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button onClick={handleSignOut} className="flex items-center justify-center gap-2 text-red-600 hover:bg-red-100 bg-white border border-red-100 p-3 rounded-xl w-full transition-colors font-semibold shadow-sm">
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 flex flex-col h-screen">
        <div className="flex-1 p-0 lg:p-8">
          <div className="mx-auto max-w-5xl h-full">
             <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden bg-white border-t fixed bottom-0 w-full z-20 pb-safe shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] overflow-x-auto">
        <div className="flex items-center h-16 w-max px-2">
          {menuItems.filter(item => !profile || item.roles.includes(profile.role)).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center px-4 h-full space-y-1 transition-colors min-w-[70px]",
                  isActive ? "text-primary-600" : "text-gray-500 hover:text-gray-900"
                )}
              >
                <Icon size={24} className={isActive ? "fill-primary-50" : ""} />
                <span className="text-[10px] font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
