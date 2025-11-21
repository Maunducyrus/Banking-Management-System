import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { Sidebar } from './components/layout/Siderbar';
import { Dashboard } from './components/dashboard/Dashboard';
import { MembersList } from './components/members/MemberList';
import { MemberDashboard } from './components/members/MemberDashboard';
import { LoanApplication } from './components/members/LoanApplication';
import { PaymentManagement } from './components/members/PaymentManagement';
import { KYCUpload } from './components/members/KYCUpload';
import { ProfileManagement } from './components/members/ProfileManagement';
import { LoansList } from './components/loans/LoansList';
import { ApplicationsList } from './components/applications/ApplicationsList';
import { ReportsSection } from './components/reports/ReportsSection';
import { UserManagement } from './components/admin/UserManagement';
import { LoanProducts } from './components/admin/LoanProducts';
import { LoanDisbursement } from './components/admin/LoanDisbursement';
import { MemberEdit } from './components/admin/MemberEdit';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [memberView, setMemberView] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [editingMember, setEditingMember] = useState<string | null>(null);

  // Define handleBackToDashboard before it's used
  const handleBackToDashboard = () => {
    setMemberView('dashboard');
  };

// Define handleNavigation function
const handleNavigation = (view: string) => {
  setMemberView(view);
};

  const handleMenuToggle = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  // Listen for member navigation events
  React.useEffect(() => {
    const handleMemberNavigation = (event: any) => {
      setMemberView(event.detail);
    };

    window.addEventListener('navigate-member', handleMemberNavigation);
    return () => window.removeEventListener('navigate-member', handleMemberNavigation);
  }, []);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderMemberContent = () => {
    switch (memberView) {
      case 'dashboard':
        return <MemberDashboard onNavigate={handleNavigation}/>;
      case 'apply-loan':
        return <LoanApplication onBack={handleBackToDashboard} />;
      case 'payments':
        return <PaymentManagement onBack={handleBackToDashboard}  />;
      case 'kyc':
        return <KYCUpload onBack={handleBackToDashboard}/>;
      case 'profile':
        return <ProfileManagement onBack={handleBackToDashboard}/>;
      default:
        return <MemberDashboard onNavigate={handleNavigation} />;
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'members':
        return user.role === 'ADMIN' ? 
          (editingMember ? 
            <MemberEdit memberId={editingMember} onBack={() => setEditingMember(null)} /> : 
            <MembersList onEditMember={setEditingMember} />
          ) : 
          renderMemberContent();
      case 'loans-list':
      case 'loans':
        return user.role === 'ADMIN' ? <LoansList /> : renderMemberContent();
      case 'loan-applications':
        return <ApplicationsList />;
      case 'loan-products':
        return <LoanProducts />;
      case 'loan-disbursement':
        return <LoanDisbursement />;
      case 'reports':
        return <ReportsSection />;
      case 'products':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Loan Products</h2>
            <p className="text-gray-600">Manage loan products and configurations (Coming Soon)</p>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'users-old':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600">Manage system users and permissions (Coming Soon)</p>
          </div>
        );
      case 'audit':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
            <p className="text-gray-600">View system audit logs and user activities (Coming Soon)</p>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <p className="text-gray-600">System configuration and preferences (Coming Soon)</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        expandedMenus={expandedMenus}
        onMenuToggle={handleMenuToggle}
      />
      <main className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#059669',
              },
            },
            error: {
              style: {
                background: '#dc2626',
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;