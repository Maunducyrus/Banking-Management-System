import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { 
  User, 
  CreditCard, 
  FileText, 
  DollarSign, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Member, Loan, Transaction, KYCDocument } from '../../types';

interface MemberDashboardProps {
  onNavigate: (view: string) => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  // Mock data for the current user
  const currentMember: Member = {
    id: '1',
    firstName: 'John',
    middleName: 'Michael',
    lastName: 'Doe',
    email: 'user@loanmanagement.com',
    phone: '+1234567890',
    nationalId: 'ID123456789',
    dateOfBirth: '1990-01-15',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    status: 'active',
    kycStatus: 'verified',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    createdBy: 'system'
  };

  const userLoans: Loan[] = [
    {
      id: '1',
      loanNumber: 'LN-2024-001',
      memberId: '1',
      productId: '1',
      principalAmount: 50000,
      interestRate: 12.5,
      term: 12,
      startDate: '2024-01-01',
      maturityDate: '2024-12-31',
      status: 'active',
      balancePrincipal: 35000,
      balanceInterest: 2500,
      nextDueDate: '2024-02-01',
      createdAt: '2024-01-01',
      disbursedAt: '2024-01-01'
    },
    {
      id: '2',
      loanNumber: 'LN-2024-002',
      memberId: '1',
      productId: '2',
      principalAmount: 25000,
      interestRate: 10.0,
      term: 6,
      startDate: '2024-02-01',
      maturityDate: '2024-07-31',
      status: 'closed',
      balancePrincipal: 0,
      balanceInterest: 0,
      nextDueDate: null,
      createdAt: '2024-02-01',
      disbursedAt: '2024-02-01'
    }
  ];

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      loanId: '1',
      memberId: '1',
      type: 'repayment',
      amount: 5000,
      appliedTo: 'principal',
      paymentMethod: 'bank_transfer',
      reference: 'TXN-001',
      createdBy: '1',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      loanId: '1',
      memberId: '1',
      type: 'repayment',
      amount: 1250,
      appliedTo: 'interest',
      paymentMethod: 'mobile_money',
      reference: 'TXN-002',
      createdBy: '1',
      createdAt: '2024-01-10'
    }
  ];

  const kycDocuments: KYCDocument[] = [
    {
      id: '1',
      memberId: '1',
      documentType: 'national_id',
      fileName: 'national_id.pdf',
      fileSize: 1024000,
      fileUrl: '/documents/utility_bill_1.pdf',
      status: 'approved',
      uploadedAt: '2024-01-01',
      reviewedAt: '2024-01-02',
      reviewedBy: 'admin',
      comments: 'Document verified successfully'
    },
    {
      id: '2',
      memberId: '1',
      documentType: 'utility_bill',
      fileName: 'utility_bill.pdf',
      fileSize: 512000,
      fileUrl: '/documents/utility_bill_1.pdf',
      status: 'approved',
      uploadedAt: '2024-01-01',
      reviewedAt: '2024-01-02',
      reviewedBy: 'admin',
      comments: 'Address verification complete'
    }
  ];

  const totalBorrowed = userLoans.reduce((sum, loan) => sum + loan.principalAmount, 0);
  const totalRepaid = totalBorrowed - userLoans.reduce((sum, loan) => sum + loan.balancePrincipal, 0);
  const activeLoans = userLoans.filter(loan => loan.status === 'active').length;
  const creditScore = 750; // Mock credit score

  const getKYCStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'secondary';
    }
  };

  const getKYCStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return AlertCircle;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {currentMember.firstName}!
        </h1>
        <p className="text-blue-100">
          Manage your loans, payments, and profile from your personal dashboard
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900">{activeLoans}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Borrowed</p>
              <p className="text-2xl font-bold text-gray-900">
                Ksh {totalBorrowed.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Repaid</p>
              <p className="text-2xl font-bold text-gray-900">
                Ksh {totalRepaid.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-teal-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Credit Score</p>
              <p className="text-2xl font-bold text-gray-900">{creditScore}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={() => onNavigate('apply-loan')}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Loan</span>
          </Button>
          
          <Button
            onClick={() => onNavigate('payments')}
            variant="secondary"
            className="flex items-center justify-center space-x-2"
          >
            <DollarSign className="w-4 h-4" />
            <span>Make Payment</span>
          </Button>
          
          <Button
            onClick={() => onNavigate('kyc')}
            variant="secondary"
            className="flex items-center justify-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Upload Documents</span>
          </Button>
          
          <Button
            onClick={() => onNavigate('profile')}
            variant="secondary"
            className="flex items-center justify-center space-x-2"
          >
            <User className="w-4 h-4" />
            <span>Update Profile</span>
          </Button>
        </div>
      </Card>

      {/* Active Loans */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Active Loans</h2>
          <Button
            onClick={() => onNavigate('apply-loan')}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Apply for New Loan
          </Button>
        </div>
        
        {userLoans.filter(loan => loan.status === 'active').length > 0 ? (
          <div className="space-y-4">
            {userLoans.filter(loan => loan.status === 'active').map((loan) => (
              <div key={loan.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{loan.loanNumber}</h3>
                  <StatusBadge status={loan.status} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Principal Balance</p>
                    <p className="font-medium">Ksh {loan.balancePrincipal.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Interest Rate</p>
                    <p className="font-medium">{loan.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Next Due Date</p>
                    <p className="font-medium">
                      {loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">You don't have any active loans</p>
            <Button
              onClick={() => onNavigate('apply-loan')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Apply for Your First Loan
            </Button>
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h2>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Ksh {transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {transaction.paymentMethod.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No recent payments</p>
          )}
          <div className="mt-4">
            <Button
              onClick={() => onNavigate('payments')}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              View All Payments
            </Button>
          </div>
        </Card>

        {/* KYC Status */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">KYC Verification Status</h2>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                currentMember.kycStatus === 'verified' ? 'bg-green-100' : 
                currentMember.kycStatus === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                {React.createElement(getKYCStatusIcon(currentMember.kycStatus), {
                  className: `w-4 h-4 ${
                    currentMember.kycStatus === 'verified' ? 'text-green-600' : 
                    currentMember.kycStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`
                })}
              </div>
              <div>
                <p className="font-medium text-gray-900">Overall Status</p>
                <StatusBadge status={currentMember.kycStatus} />
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            {kycDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {doc.documentType.replace('_', ' ').toUpperCase()}
                </span>
                <StatusBadge status={doc.status} />
              </div>
            ))}
          </div>
          
          <Button
            onClick={() => onNavigate('kyc')}
            variant="secondary"
            size="sm"
            className="w-full"
          >
            Manage Documents
          </Button>
        </Card>
      </div>
    </div>
  );
};