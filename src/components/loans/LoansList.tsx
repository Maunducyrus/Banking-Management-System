import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { Search, Plus, Filter, Eye, Calendar, DollarSign } from 'lucide-react';
import type { Loan } from '../../types';

export const LoansList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - replace with API call
  const loans: Loan[] = [
    {
      id: '1',
      loanNumber: 'LN001234',
      memberId: '1',
      productId: '1',
      principalAmount: 50000,
      interestRate: 12.5,
      term: 12,
      startDate: '2024-01-15',
      maturityDate: '2025-01-15',
      status: 'active',
      balancePrincipal: 35000,
      balanceInterest: 2500,
      nextDueDate: '2024-02-15',
      createdAt: '2024-01-15T10:30:00Z',
      disbursedAt: '2024-01-16T14:00:00Z'
    },
    {
      id: '2',
      loanNumber: 'LN001235',
      memberId: '2',
      productId: '2',
      principalAmount: 25000,
      interestRate: 10.0,
      term: 6,
      startDate: '2024-01-10',
      maturityDate: '2024-07-10',
      status: 'active',
      balancePrincipal: 15000,
      balanceInterest: 800,
      nextDueDate: '2024-02-10',
      createdAt: '2024-01-10T09:15:00Z',
      disbursedAt: '2024-01-11T11:30:00Z'
    },
    {
      id: '3',
      loanNumber: 'LN001236',
      memberId: '3',
      productId: '1',
      principalAmount: 75000,
      interestRate: 15.0,
      term: 24,
      startDate: '2023-12-01',
      maturityDate: '2025-12-01',
      status: 'defaulted',
      balancePrincipal: 68000,
      balanceInterest: 8500,
      nextDueDate: '2024-01-01',
      createdAt: '2023-12-01T08:00:00Z',
      disbursedAt: '2023-12-02T10:15:00Z'
    }
  ];

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = 
      loan.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.memberId.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const getTotalOutstanding = () => {
    return filteredLoans.reduce((total, loan) => total + loan.balancePrincipal + loan.balanceInterest, 0);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Loan Management</h2>
          <p className="text-gray-600">Track and manage all active loans - Total Outstanding: {formatCurrency(getTotalOutstanding())}</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Disburse Loan
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by loan number or member..."
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
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="defaulted">Defaulted</option>
              <option value="written_off">Written Off</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Loans Table */}
      <Card padding="sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Loan Details</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Principal</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Balance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Interest Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Next Due</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => (
                <tr key={loan.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{loan.loanNumber}</p>
                      <p className="text-sm text-gray-600">
                        Member: {loan.memberId} • {loan.term} months
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(loan.principalAmount)}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm text-gray-900">
                        Principal: {formatCurrency(loan.balancePrincipal)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Interest: {formatCurrency(loan.balanceInterest)}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-900">{loan.interestRate}%</p>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={loan.status} variant="loan" />
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-900">
                      {loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString() : 'N/A'}
                      {/* {new Date(loan.nextDueDate).toLocaleDateString()} */}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Eye size={14} />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLoans.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No loans found matching your criteria.</p>
          </div>
        )}
      </Card>
    </div>
  );
};