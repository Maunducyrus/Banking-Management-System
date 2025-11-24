import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { Search, Plus, Filter, Eye, CreditCard as Edit, Trash2 } from 'lucide-react';
import type { Member } from '../../types';
import { getStorageData, addMember, updateMember, deleteMember } from '../../utils/LocalStorage';
import toast from 'react-hot-toast';

interface MembersListProps {
  onEditMember: (memberId: string) => void;
}

export const MembersList: React.FC<MembersListProps> = ({ onEditMember }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [members, setMembers] = useState<Member[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationalId: '',
    dateOfBirth: ''
  });

  // Load data from localStorage
  React.useEffect(() => {
    const data = getStorageData();
    setMembers(data.members);
  }, []);

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddMember = () => {
    if (!newMember.firstName || !newMember.lastName || !newMember.email || !newMember.phone || !newMember.nationalId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const member = {
      ...newMember,
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      },
      status: 'active',
      kycStatus: 'pending',
      createdBy: 'admin'
    };

    addMember(member);
    const data = getStorageData();
    setMembers(data.members);
    
    setNewMember({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      nationalId: '',
      dateOfBirth: ''
    });
    setShowAddMember(false);
    toast.success('Member added successfully');
  };

  const handleDeleteMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      deleteMember(memberId);
      const data = getStorageData();
      setMembers(data.members);
      toast.success('Member deleted successfully');
    }
  };

  const handleStatusChange = (memberId: string, newStatus: 'active' | 'suspended' | 'blacklisted') => {
    updateMember(memberId, { status: newStatus });
    const data = getStorageData();
    setMembers(data.members);
    toast.success(`Member status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Members</h2>
          <p className="text-gray-600">Manage customer profiles and KYC status - Total Members: {filteredMembers.length}</p>
        </div>
        <Button 
          onClick={() => setShowAddMember(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add Member
        </Button>
      </div>

      {/* Add Member Form */}
      {showAddMember && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Member</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={newMember.firstName}
                onChange={(e) => setNewMember(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={newMember.lastName}
                onChange={(e) => setNewMember(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={newMember.phone}
                onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                National ID *
              </label>
              <input
                type="text"
                value={newMember.nationalId}
                onChange={(e) => setNewMember(prev => ({ ...prev, nationalId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={newMember.dateOfBirth}
                onChange={(e) => setNewMember(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="ghost" onClick={() => setShowAddMember(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember}>
              Add Member
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
                placeholder="Search members..."
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
              <option value="suspended">Suspended</option>
              <option value="blacklisted">Blacklisted</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Members Table */}
      <Card padding="sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Member</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">National ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">KYC Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Joined</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-sm text-gray-600">ID: {member.id}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm text-gray-900">{member.email}</p>
                      <p className="text-sm text-gray-600">{member.phone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-900">{member.nationalId}</p>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={member.status}
                      onChange={(e) => handleStatusChange(member.id, e.target.value as any)}
                      className="text-xs px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="blacklisted">Blacklisted</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={member.kycStatus} variant="kyc" />
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-900">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Eye size={14} />
                        View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                        onClick={() => onEditMember(member.id)}
                      >
                        <Edit size={14} />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteMember(member.id)}
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

        {filteredMembers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No members found matching your criteria.</p>
          </div>
        )}
      </Card>
    </div>
  );
};