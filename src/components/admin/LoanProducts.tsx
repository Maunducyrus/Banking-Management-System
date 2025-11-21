import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { Search, Plus, Filter, Eye, CreditCard as Edit, Trash2, DollarSign } from 'lucide-react';
import type { LoanProduct } from '../../types';
import toast from 'react-hot-toast';

export const LoanProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddProduct, setShowAddProduct] = useState(false);
  
  const [products, setProducts] = useState<LoanProduct[]>([
    {
      id: '1',
      code: 'M-LOAN',
      name: 'Monthly Loan',
      description: 'Short-term loan with monthly repayments for quick financial needs',
      interestType: 'reducing',
      interestRate: 12.5,
      minAmount: 5000,
      maxAmount: 100000,
      minTerm: 3,
      maxTerm: 12,
      repaymentFrequency: 'monthly',
      gracePeriodDays: 5,
      status: 'active',
      createdBy: 'admin',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      code: 'Q-LOAN',
      name: 'Quarterly Loan',
      description: 'Medium-term loan with quarterly repayments for business expansion',
      interestType: 'reducing',
      interestRate: 10.0,
      minAmount: 10000,
      maxAmount: 200000,
      minTerm: 3,
      maxTerm: 24,
      repaymentFrequency: 'monthly',
      gracePeriodDays: 7,
      status: 'active',
      createdBy: 'admin',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      code: 'Y-LOAN',
      name: 'Yearly Loan',
      description: 'Long-term loan with flexible repayments for major investments',
      interestType: 'declining_balance',
      interestRate: 8.5,
      minAmount: 25000,
      maxAmount: 500000,
      minTerm: 12,
      maxTerm: 60,
      repaymentFrequency: 'monthly',
      gracePeriodDays: 10,
      status: 'active',
      createdBy: 'admin',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      code: 'E-LOAN',
      name: 'Emergency Loan',
      description: 'Quick emergency loan for urgent financial needs',
      interestType: 'flat',
      interestRate: 15.0,
      minAmount: 1000,
      maxAmount: 25000,
      minTerm: 1,
      maxTerm: 6,
      repaymentFrequency: 'monthly',
      gracePeriodDays: 3,
      status: 'inactive',
      createdBy: 'admin',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    code: '',
    name: '',
    description: '',
    interestType: 'reducing' as 'flat' | 'reducing' | 'declining_balance',
    interestRate: 0,
    minAmount: 0,
    maxAmount: 0,
    minTerm: 0,
    maxTerm: 0,
    repaymentFrequency: 'monthly' as 'monthly' | 'weekly' | 'daily',
    gracePeriodDays: 0
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddProduct = () => {
    if (!newProduct.code || !newProduct.name || !newProduct.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (newProduct.minAmount >= newProduct.maxAmount) {
      toast.error('Maximum amount must be greater than minimum amount');
      return;
    }

    if (newProduct.minTerm >= newProduct.maxTerm) {
      toast.error('Maximum term must be greater than minimum term');
      return;
    }

    const product: LoanProduct = {
      id: Date.now().toString(),
      ...newProduct,
      status: 'active',
      createdBy: 'admin',
      updatedAt: new Date().toISOString()
    };

    setProducts(prev => [...prev, product]);
    setNewProduct({
      code: '',
      name: '',
      description: '',
      interestType: 'reducing',
      interestRate: 0,
      minAmount: 0,
      maxAmount: 0,
      minTerm: 0,
      maxTerm: 0,
      repaymentFrequency: 'monthly',
      gracePeriodDays: 0
    });
    setShowAddProduct(false);
    toast.success('Loan product created successfully');
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this loan product? This action cannot be undone.')) {
      setProducts(prev => prev.filter(product => product.id !== productId));
      toast.success('Loan product deleted successfully');
    }
  };

  const handleStatusChange = (productId: string, newStatus: 'active' | 'inactive') => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, status: newStatus, updatedAt: new Date().toISOString() }
        : product
    ));
    toast.success(`Product status updated to ${newStatus}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Loan Products</h2>
          <p className="text-gray-600">Manage loan products and configurations - {filteredProducts.length} products found</p>
        </div>
        <Button 
          onClick={() => setShowAddProduct(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add Product
        </Button>
      </div>

      {/* Add Product Form */}
      {showAddProduct && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Add New Loan Product</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Code *
              </label>
              <input
                type="text"
                value={newProduct.code}
                onChange={(e) => setNewProduct(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., M-LOAN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Monthly Loan"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the loan product..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Type *
              </label>
              <select
                value={newProduct.interestType}
                onChange={(e) => setNewProduct(prev => ({ ...prev, interestType: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="flat">Flat Rate</option>
                <option value="reducing">Reducing Balance</option>
                <option value="declining_balance">Declining Balance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate (%) *
              </label>
              <input
                type="number"
                step="0.1"
                value={newProduct.interestRate}
                onChange={(e) => setNewProduct(prev => ({ ...prev, interestRate: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 12.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Amount *
              </label>
              <input
                type="number"
                value={newProduct.minAmount}
                onChange={(e) => setNewProduct(prev => ({ ...prev, minAmount: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Amount *
              </label>
              <input
                type="number"
                value={newProduct.maxAmount}
                onChange={(e) => setNewProduct(prev => ({ ...prev, maxAmount: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 100000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Term (months) *
              </label>
              <input
                type="number"
                value={newProduct.minTerm}
                onChange={(e) => setNewProduct(prev => ({ ...prev, minTerm: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Term (months) *
              </label>
              <input
                type="number"
                value={newProduct.maxTerm}
                onChange={(e) => setNewProduct(prev => ({ ...prev, maxTerm: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repayment Frequency *
              </label>
              <select
                value={newProduct.repaymentFrequency}
                onChange={(e) => setNewProduct(prev => ({ ...prev, repaymentFrequency: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grace Period (days) *
              </label>
              <input
                type="number"
                value={newProduct.gracePeriodDays}
                onChange={(e) => setNewProduct(prev => ({ ...prev, gracePeriodDays: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 5"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="ghost" onClick={() => setShowAddProduct(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>
              Create Product
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
                placeholder="Search products..."
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
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card padding="sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Interest</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Amount Range</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Term Range</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.code}</p>
                      <p className="text-xs text-gray-500 mt-1">{product.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{product.interestRate}%</p>
                      <p className="text-sm text-gray-600 capitalize">{product.interestType.replace('_', ' ')}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm text-gray-900">
                        {formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm text-gray-900">
                        {product.minTerm} - {product.maxTerm} months
                      </p>
                      <p className="text-xs text-gray-600 capitalize">{product.repaymentFrequency} payments</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={product.status}
                      onChange={(e) => handleStatusChange(product.id, e.target.value as 'active' | 'inactive')}
                      className="text-xs px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Eye size={14} />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                        <Edit size={14} />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No loan products found matching your criteria.</p>
          </div>
        )}
      </Card>
    </div>
  );
};