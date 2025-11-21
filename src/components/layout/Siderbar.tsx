import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  UserPlus, 
  CreditCard, 
  // FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Home,
  // DollarSign,
  Shield,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  expandedMenus: string[];
  onMenuToggle: (menuId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  expandedMenus, 
  onMenuToggle 
}) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, adminOnly: true },
    { 
      id: 'members', 
      label: user?.role === 'ADMIN' ? 'Members' : 'My Profile', 
      icon: Users, 
      adminOnly: false 
    },
    { 
      id: 'loans', 
      label: 'Loans', 
      icon: CreditCard, 
      adminOnly: false,
      hasSubmenu: user?.role === 'ADMIN',
      submenu: user?.role === 'ADMIN' ? [
        { id: 'loans-list', label: 'Active Loans' },
        { id: 'loan-applications', label: 'Applications' },
        { id: 'loan-products', label: 'Loan Products' },
        { id: 'loan-disbursement', label: 'Disbursement' }
      ] : undefined
    },
    // { id: 'products', label: 'Loan Products', icon: DollarSign, adminOnly: true },
    { id: 'users', label: 'User Management', icon: UserPlus, adminOnly: true },
    { id: 'reports', label: 'Reports', icon: BarChart3, adminOnly: true },
    { id: 'audit', label: 'Audit Logs', icon: Shield, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings, adminOnly: false },
  ];

  const visibleItems = menuItems.filter(item => 
    !item.adminOnly || user?.role === 'ADMIN'
  );

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">P2P Loan Manager</h1>
        <p className="text-gray-400 text-sm mt-1">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-gray-500 text-xs">
          {user?.role}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedMenus.includes(item.id);
            
            return (
              <li key={item.id} className="space-y-1">
                <div className="flex items-center">
                  <button
                    onClick={() => item.hasSubmenu ? onMenuToggle(item.id) : onSectionChange(item.id)}
                    className={`
                      flex-1 flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                      ${activeSection === item.id || (item.submenu && item.submenu.some(sub => activeSection === sub.id))
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span className="flex-1">{item.label}</span>
                    {item.hasSubmenu && (
                      isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                    )}
                  </button>
                </div>
                
                {/* Submenu */}
                {item.hasSubmenu && isExpanded && item.submenu && (
                  <ul className="ml-6 space-y-1">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.id}>
                        <button
                          onClick={() => onSectionChange(subItem.id)}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors text-sm
                            ${activeSection === subItem.id
                              ? 'bg-blue-500 text-white' 
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }
                          `}
                        >
                          <div className="w-2 h-2 rounded-full bg-current opacity-50"></div>
                          {subItem.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};