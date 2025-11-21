import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { ArrowLeft, Calendar, CreditCard, Smartphone, Building, DollarSign, Clock, CheckCircle } from 'lucide-react';
import type { RepaymentSchedule, PaymentInstruction, Transaction } from '../../types';
import toast from 'react-hot-toast';

interface PaymentManagementProps {
  onBack: () => void;
}

export const PaymentManagement: React.FC<PaymentManagementProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'history' | 'instructions'>('schedule');
  const [selectedLoan, setSelectedLoan] = useState('all');

  // Mock data
  const loans = [
    { id: '1', loanNumber: 'LN001234', balance: 35000 },
    { id: '2', loanNumber: 'LN001235', balance: 15000 }
  ];

  const repaymentSchedule: RepaymentSchedule[] = [
    {
      id: '1',
      loanId: '1',
      installmentNumber: 1,
      dueDate: '2024-02-15',
      principalDue: 2000,
      interestDue: 500,
      feesDue: 50,
      penaltyDue: 0,
      totalDue: 2550,
      paidPrincipal: 2000,
      paidInterest: 500,
      paidFees: 50,
      paidPenalty: 0,
      status: 'paid'
    },
    {
      id: '2',
      loanId: '1',
      installmentNumber: 2,
      dueDate: '2024-03-15',
      principalDue: 2000,
      interestDue: 480,
      feesDue: 50,
      penaltyDue: 0,
      totalDue: 2530,
      paidPrincipal: 0,
      paidInterest: 0,
      paidFees: 0,
      paidPenalty: 0,
      status: 'due'
    },
    {
      id: '3',
      loanId: '2',
      installmentNumber: 1,
      dueDate: '2024-02-20',
      principalDue: 1200,
      interestDue: 150,
      feesDue: 25,
      penaltyDue: 0,
      totalDue: 1375,
      paidPrincipal: 0,
      paidInterest: 0,
      paidFees: 0,
      paidPenalty: 0,
      status: 'overdue'
    }
  ];

  const paymentHistory: Transaction[] = [
    {
      id: '1',
      loanId: '1',
      memberId: '1',
      type: 'repayment',
      amount: 2550,
      appliedTo: 'installment_1',
      paymentMethod: 'bank_transfer',
      reference: 'TXN123456789',
      createdBy: '1',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      loanId: '2',
      memberId: '1',
      type: 'repayment',
      amount: 1000,
      appliedTo: 'partial_payment',
      paymentMethod: 'mobile_money',
      reference: 'MM987654321',
      createdBy: '1',
      createdAt: '2024-01-10T14:20:00Z'
    }
  ];

  const paymentInstructions: PaymentInstruction[] = [
    {
      id: '1',
      loanId: '1',
      method: 'bank_transfer',
      details: {
        accountNumber: '1234567890',
        bankName: 'First National Bank',
        routingNumber: '021000021',
        reference: 'LN001234',
        instructions: 'Include your loan number in the reference field'
      },
      isActive: true
    },
    {
      id: '2',
      loanId: '1',
      method: 'mobile_money',
      details: {
        mobileNumber: '+1-555-PAYMENT',
        reference: 'LN001234',
        instructions: 'Send payment to our mobile money number with your loan number as reference'
      },
      isActive: true
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'paid':
  //       return 'text-green-600';
  //     case 'due':
  //       return 'text-blue-600';
  //     case 'overdue':
  //       return 'text-red-600';
  //     case 'partially_paid':
  //       return 'text-yellow-600';
  //     default:
  //       return 'text-gray-600';
  //   }
  // };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <Building className="w-5 h-5" />;
      case 'mobile_money':
        return <Smartphone className="w-5 h-5" />;
      case 'card':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  const filteredSchedule = selectedLoan === 'all' 
    ? repaymentSchedule 
    : repaymentSchedule.filter(item => item.loanId === selectedLoan);

  const filteredHistory = selectedLoan === 'all'
    ? paymentHistory
    : paymentHistory.filter(item => item.loanId === selectedLoan);

  // const makePayment = (installmentId: string, amount: number) => {
  const makePayment = (installmentId: string, amount: number) => {
    console.log(`Processing payment for installment: ${installmentId}`);
    // In real implementation, this would integrate with payment gateway
    toast.success(`Payment of ${formatCurrency(amount)} initiated successfully! You will be redirected to payment gateway.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
          <p className="text-gray-600">Manage your loan payments and view repayment schedules</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Next Payment Due</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {formatCurrency(2530)}
              </p>
              <p className="text-sm text-gray-600">Mar 15, 2024</p>
            </div>
            <Clock className="w-8 h-8 text-red-600" />
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {formatCurrency(1375)}
              </p>
              <p className="text-sm text-gray-600">1 payment</p>
            </div>
            <Calendar className="w-8 h-8 text-red-600" />
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(3550)}
              </p>
              <p className="text-sm text-gray-600">This year</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {formatCurrency(50000)}
              </p>
              <p className="text-sm text-gray-600">All loans</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
      </div>

      {/* Filters and Tabs */}
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Loan
              </label>
              <select
                value={selectedLoan}
                onChange={(e) => setSelectedLoan(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Loans</option>
                {loans.map(loan => (
                  <option key={loan.id} value={loan.id}>
                    {loan.loanNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex border border-gray-200 rounded-lg">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                activeTab === 'schedule'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Payment Schedule
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Payment History
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                activeTab === 'instructions'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Payment Instructions
            </button>
          </div>
        </div>
      </Card>

      {/* Tab Content */}
      {activeTab === 'schedule' && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Repayment Schedule</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Loan</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Principal</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Interest</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Fees</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Total Due</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedule.map((item) => {
                  const loan = loans.find(l => l.id === item.loanId);
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className={`text-sm ${
                            new Date(item.dueDate) < new Date() && item.status !== 'paid'
                              ? 'text-red-600 font-medium'
                              : 'text-gray-900'
                          }`}>
                            {new Date(item.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {loan?.loanNumber}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatCurrency(item.principalDue)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatCurrency(item.interestDue)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatCurrency(item.feesDue + item.penaltyDue)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {formatCurrency(item.totalDue)}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3 px-4">
                        {item.status !== 'paid' && (
                          <Button
                            size="sm"
                            onClick={() => makePayment(item.id, item.totalDue)}
                            className="flex items-center gap-1"
                          >
                            <DollarSign size={14} />
                            Pay Now
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'history' && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Loan</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Method</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Reference</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Applied To</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((payment) => {
                  const loan = loans.find(l => l.id === payment.loanId);
                  return (
                    <tr key={payment.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {loan?.loanNumber}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-green-600">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <span className="ml-2 text-sm text-gray-900 capitalize">
                            {payment.paymentMethod.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-mono">
                        {payment.reference}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 capitalize">
                        {payment.appliedTo.replace('_', ' ')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'instructions' && (
        <div className="space-y-6">
          {paymentInstructions.map((instruction) => {
            // const loan = loans.find(l => l.id === instruction.loanId);
            return (
              <Card key={instruction.id}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {getPaymentMethodIcon(instruction.method)}
                    <h3 className="ml-3 text-lg font-semibold text-gray-900 capitalize">
                      {instruction.method.replace('_', ' ')} Payment
                    </h3>
                  </div>
                  <StatusBadge status={instruction.isActive ? 'active' : 'inactive'} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Payment Details</h4>
                    <div className="space-y-2 text-sm">
                      {instruction.details.accountNumber && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Number:</span>
                          <span className="font-mono font-medium">{instruction.details.accountNumber}</span>
                        </div>
                      )}
                      {instruction.details.bankName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bank Name:</span>
                          <span className="font-medium">{instruction.details.bankName}</span>
                        </div>
                      )}
                      {instruction.details.routingNumber && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Routing Number:</span>
                          <span className="font-mono font-medium">{instruction.details.routingNumber}</span>
                        </div>
                      )}
                      {instruction.details.mobileNumber && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mobile Number:</span>
                          <span className="font-mono font-medium">{instruction.details.mobileNumber}</span>
                        </div>
                      )}
                      {instruction.details.reference && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reference:</span>
                          <span className="font-mono font-medium">{instruction.details.reference}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Instructions</h4>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        {instruction.details.instructions}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          <Card className="border-l-4 border-l-amber-500 bg-amber-50">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 mb-2">Important Payment Information</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Always include your loan number in the payment reference</li>
                  <li>• Payments may take 1-3 business days to reflect in your account</li>
                  <li>• Keep payment receipts for your records</li>
                  <li>• Contact support if your payment is not reflected within 3 business days</li>
                  <li>• Late payments may incur additional fees and penalties</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};