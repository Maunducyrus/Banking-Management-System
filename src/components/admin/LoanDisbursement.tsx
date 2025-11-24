import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { Search, Filter, DollarSign, Calendar, User, CheckCircle, AlertCircle } from 'lucide-react';
import type { LoanApplication, Member } from '../../types';
import { getStorageData, updateApplication, addLoan } from '../../utils/LocalStorage';
import toast from 'react-hot-toast';

export const LoanDisbursement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('approved');
  const [applications, setApplications] = useState<LoanApplication[]>([]);

  // Load data from localStorage
  React.useEffect(() => {
    const data = getStorageData();
    setApplications(data.applications);
  }, []);

  const data = getStorageData();
  const members = data.members;
  const products = data.products;

  const filteredApplications = applications.filter(app => {
    const member = members.find(m => m.id === app.memberId);
    const memberName = member ? `${member.firstName} ${member.lastName}` : '';
    
    const matchesSearch = 
      app.id.includes(searchTerm) ||
      memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDisburse = (applicationId: string, amount: number) => {
    const application = applications.find(app => app.id === applicationId);
    if (!application) return;

    const product = products.find(p => p.id === application.productId);
    if (!product) return;

    if (window.confirm(`Are you sure you want to disburse Ksh ${amount.toLocaleString()} for this loan?`)) {
      // Create loan record
      const loan = {
        loanNumber: `LN${Date.now()}`,
        memberId: application.memberId,
        productId: application.productId,
        principalAmount: application.amountRequested,
        interestRate: product.interestRate,
        term: application.term,
        startDate: new Date().toISOString().split('T')[0],
        maturityDate: new Date(Date.now() + application.term * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
        balancePrincipal: application.amountRequested,
        balanceInterest: 0,
        nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      // Add loan to storage
      addLoan(loan);
      
      // Update application status
      updateApplication(applicationId, { status: 'disbursed' });
      
      // Refresh applications
      const updatedData = getStorageData();
      setApplications(updatedData.applications);
      
      toast.success(`Loan of Ksh ${amount.toLocaleString()} disbursed successfully! Loan account created.`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KSH'
    }).format(amount);
  };

  const getMember = (memberId: string) => {
    return members.find(m => m.id === memberId);
  };

  const getTotalDisbursementAmount = () => {
    return filteredApplications.reduce((total, app) => total + app.amountRequested, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Loan Disbursement</h2>
          <p className="text-gray-600">Process approved loans for disbursement - {filteredApplications.length} loans ready</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Amount Ready</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalDisbursementAmount())}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ready for Disbursement</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{applications.filter(a => a.status === 'approved').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(getTotalDisbursementAmount())}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Loan Size</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {formatCurrency(filteredApplications.length > 0 ? getTotalDisbursementAmount() / filteredApplications.length : 0)}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-amber-600" />
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending KYC</p>
              <p className="text-2xl font-bold text-red-600 mt-1">0</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by member name, application ID, or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="approved">Ready for Disbursement</option>
              <option value="all">All Applications</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Disbursement Table */}
      <Card padding="sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Application</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Member</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Term</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Purpose</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Credit Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Approved Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => {
                const member = getMember(application.memberId);
                return (
                  <tr key={application.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">#{application.id}</p>
                        <p className="text-sm text-gray-600">
                          Applied: {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {member ? `${member.firstName} ${member.lastName}` : 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-600">{member?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-green-600 text-lg">
                        {formatCurrency(application.amountRequested)}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-900">{application.term} months</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-900">{application.purpose}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          (application.creditScore || 0) >= 750 ? 'bg-green-500' :
                          (application.creditScore || 0) >= 700 ? 'bg-blue-500' :
                          (application.creditScore || 0) >= 650 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-medium text-gray-900">
                          {application.creditScore || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-900">
                        {new Date(application.updatedAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      {application.status === 'approved' ? (
                        <Button
                          onClick={() => handleDisburse(application.id, application.amountRequested)}
                          className="flex items-center gap-2"
                          size="sm"
                        >
                          <DollarSign size={14} />
                          Disburse
                        </Button>
                      ) : (
                        <StatusBadge status="disbursed" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No applications ready for disbursement.</p>
          </div>
        )}
      </Card>

      {/* Disbursement Instructions */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Disbursement Guidelines</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Verify member KYC status is "Verified" before disbursement</li>
              <li>• Ensure all loan documentation is complete and signed</li>
              <li>• Double-check disbursement amount matches approved amount</li>
              <li>• Disbursement creates an active loan account automatically</li>
              <li>• Member will receive SMS/Email notification upon disbursement</li>
              <li>• Repayment schedule is generated immediately after disbursement</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};