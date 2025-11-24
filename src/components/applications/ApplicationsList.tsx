import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { Search, Filter, Eye, CheckCircle, XCircle, Plus } from 'lucide-react';
import type { LoanApplication } from '../../types';
import { getStorageData, updateApplication } from '../../utils/LocalStorage';
import toast from 'react-hot-toast';

export const ApplicationsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddApplication, setShowAddApplication] = useState(false);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [newApplication, setNewApplication] = useState({
    memberId: '',
    productId: '',
    amountRequested: '',
    term: '',
    purpose: ''
  });

  // Load data from localStorage
  React.useEffect(() => {
    const data = getStorageData();
    setApplications(data.applications);
  }, []);

  const members = getStorageData().members;
  const products = getStorageData().products;

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.id.includes(searchTerm) ||
      app.memberId.includes(searchTerm) ||
      app.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddApplication = () => {
    if (!newApplication.memberId || !newApplication.productId || !newApplication.amountRequested || !newApplication.term || !newApplication.purpose) {
      toast.error('Please fill in all required fields');
      return;
    }

    const application = {
      ...newApplication,
      amountRequested: parseFloat(newApplication.amountRequested),
      term: parseInt(newApplication.term),
      status: 'submitted',
      creditScore: Math.floor(Math.random() * 200) + 600,
      applicationData: {},
      submittedBy: 'admin'
    };

    const data = getStorageData();
    const updatedApplications = [...data.applications, {
      ...application,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }];
    
    data.applications = updatedApplications;
    localStorage.setItem('p2p_loan_data', JSON.stringify(data));
    setApplications(updatedApplications);
    
    setNewApplication({
      memberId: '',
      productId: '',
      amountRequested: '',
      term: '',
      purpose: ''
    });
    setShowAddApplication(false);
    toast.success('Loan application created successfully!');
  };

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    updateApplication(applicationId, { status: newStatus });
    const data = getStorageData();
    setApplications(data.applications);
    toast.success(`Application ${newStatus} successfully!`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KSH'
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
        <Button 
          onClick={() => setShowAddApplication(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add Application
        </Button>
      </div>

      {/* Add Application Form */}
      {showAddApplication && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Loan Application</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member *
              </label>
              <select
                value={newApplication.memberId}
                onChange={(e) => setNewApplication(prev => ({ ...prev, memberId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Member</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.firstName} {member.lastName} - {member.email}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Product *
              </label>
              <select
                value={newApplication.productId}
                onChange={(e) => setNewApplication(prev => ({ ...prev, productId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.interestRate}%
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Requested *
              </label>
              <input
                type="number"
                value={newApplication.amountRequested}
                onChange={(e) => setNewApplication(prev => ({ ...prev, amountRequested: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Term (months) *
              </label>
              <input
                type="number"
                value={newApplication.term}
                onChange={(e) => setNewApplication(prev => ({ ...prev, term: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter term"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose *
              </label>
              <textarea
                value={newApplication.purpose}
                onChange={(e) => setNewApplication(prev => ({ ...prev, purpose: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the purpose of this loan"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="ghost" onClick={() => setShowAddApplication(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddApplication}>
              Create Application
            </Button>
          </div>
        </Card>
      )}

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
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1 text-green-600 hover:text-green-700"
                            onClick={() => handleStatusChange(application.id, 'approved')}
                          >
                            <CheckCircle size={14} />
                            Approve
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                          >
                            <XCircle size={14} />
                            Reject
                          </Button>
                        </>
                        // <>
                        //   <Button variant="ghost" size="sm" className="flex items-center gap-1 text-green-600 hover:text-green-700">
                        //     onClick={() => handleStatusChange(application.id, 'approved')}
                        //     <CheckCircle size={14} />
                        //     Approve
                        //   </Button>
                        //   <Button variant="ghost" size="sm" className="flex items-center gap-1 text-red-600 hover:text-red-700">
                        //     onClick={() => handleStatusChange(application.id, 'rejected')}
                        //     <XCircle size={14} />
                        //     Reject
                        //   </Button>
                        // </>
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