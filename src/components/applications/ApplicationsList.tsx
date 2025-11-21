import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { Search, Filter, Eye, CheckCircle, XCircle } from 'lucide-react';
import type { LoanApplication } from '../../types';

export const ApplicationsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - replace with API call
  const applications: LoanApplication[] = [
    {
      id: '1',
      memberId: '1',
      productId: '1',
      amountRequested: 50000,
      term: 12,
      purpose: 'Business expansion',
      status: 'under_review',
      creditScore: 720,
      applicationData: {},
      createdAt: '2024-01-25T10:30:00Z',
      updatedAt: '2024-01-25T10:30:00Z',
      submittedBy: '1'
    },
    {
      id: '2',
      memberId: '2',
      productId: '2',
      amountRequested: 25000,
      term: 6,
      purpose: 'Home improvement',
      status: 'submitted',
      creditScore: 680,
      applicationData: {},
      createdAt: '2024-01-24T15:45:00Z',
      updatedAt: '2024-01-24T15:45:00Z',
      submittedBy: '2'
    },
    {
      id: '3',
      memberId: '3',
      productId: '1',
      amountRequested: 75000,
      term: 24,
      purpose: 'Debt consolidation',
      status: 'approved',
      creditScore: 750,
      applicationData: {},
      createdAt: '2024-01-20T09:15:00Z',
      updatedAt: '2024-01-23T14:20:00Z',
      submittedBy: '3'
    },
    {
      id: '4',
      memberId: '1',
      productId: '3',
      amountRequested: 15000,
      term: 3,
      purpose: 'Emergency expenses',
      status: 'rejected',
      creditScore: 580,
      applicationData: {},
      createdAt: '2024-01-18T11:00:00Z',
      updatedAt: '2024-01-22T16:30:00Z',
      submittedBy: '1'
    }
  ];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.id.includes(searchTerm) ||
      app.memberId.includes(searchTerm) ||
      app.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const getCreditScoreColor = (score: number | undefined) => {
    if (!score) return 'text-gray-500';
    if (score >= 750) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Loan Applications</h2>
          <p className="text-gray-600">Review and process loan applications - {filteredApplications.length} applications found</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search applications..."
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
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Applications Table */}
      <Card padding="sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Application</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Member</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Purpose</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Credit Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">#{application.id}</p>
                      <p className="text-sm text-gray-600">{application.term} months</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-900">ID: {application.memberId}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(application.amountRequested)}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-900">{application.purpose}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className={`font-medium ${getCreditScoreColor(application.creditScore)}`}>
                      {application.creditScore || 'N/A'}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={application.status} variant="application" />
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-900">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Eye size={14} />
                        View
                      </Button>
                      {application.status === 'under_review' && (
                        <>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-green-600 hover:text-green-700">
                            <CheckCircle size={14} />
                            Approve
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-red-600 hover:text-red-700">
                            <XCircle size={14} />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No applications found matching your criteria.</p>
          </div>
        )}
      </Card>
    </div>
  );
};