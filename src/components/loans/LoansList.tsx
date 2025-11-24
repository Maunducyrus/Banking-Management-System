import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { Search, Plus, Filter, Eye, Calendar, DollarSign } from 'lucide-react';
import type { Loan } from '../../types';
import { getStorageData } from '../../utils/LocalStorage';

export const LoansList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loans, setLoans] = useState<Loan[]>([]);

  // Load data from localStorage
  React.useEffect(() => {
    const data = getStorageData();
    setLoans(data.loans);
  }, []);

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
      currency: 'KSH'
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
          View Disbursements
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
                    {/* <p className="text-sm text-gray-900">
                      {new Date(loan.nextDueDate).toLocaleDateString()}
                    </p> */}
                    <p className="text-sm text-gray-900">
                      {loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString() : 'N/A'}
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