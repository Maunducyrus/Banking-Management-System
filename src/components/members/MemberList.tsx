import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { LoadingSpinner } from '../ui/LoadingSpinner';
// import {
//   Search, Plus, Filter, Eye, UserCheck, UserX, RefreshCw,
//   Users, ChevronDown, X
// } from 'lucide-react';
import {
  Search, Plus, Filter, Eye, UserCheck, RefreshCw,
  Users, X
} from 'lucide-react';
import type { Member } from '../../types';
import toast from 'react-hot-toast';
import { membersApi, type AddMemberPayload } from '../../services/api';

interface MembersListProps {
  onEditMember: (memberId: string) => void;
}

function normaliseMembers(raw: any): Member[] {
  if (!raw) return [];

  let arr: any = [];

  if (Array.isArray(raw)) {
    arr = raw;
  } else if (Array.isArray(raw.content)) {
    arr = raw.content;
  } else if (Array.isArray(raw.data)) {
    arr = raw.data;
  } else if (Array.isArray(raw.members)) {
    arr = raw.members;
  } else if (Array.isArray(raw.content?.members)) {
    arr = raw.content.members;
  } else {
    console.log('UNKNOWN MEMBERS RESPONSE:', raw); //  DEBUG
    return [];
  }

  return arr.map((m: any) => ({
    id: m.memberNumber ?? m.id ?? String(Math.random()),
    firstName: m.firstName ?? '',
    lastName: m.lastName ?? '',
    middleName: m.otherNames,
    email: m.email ?? '',
    phone: m.phone ?? '',
    nationalId: m.nationalId ?? '',
    dateOfBirth: m.dateOfBirth ?? '',
    address: m.address ?? {},
    status: m.status ?? 'active',
    kycStatus: m.kycStatus ?? 'pending',
    createdAt: m.welfareJoinDate ?? m.createdAt ?? new Date().toISOString(),
    updatedAt: m.updatedAt ?? new Date().toISOString(),
    createdBy: m.createdBy ?? '',
  }));
}

const TODAY = new Date().toISOString().split('T')[0];

const EMPTY_MEMBER: AddMemberPayload = {
  firstName: '',
  lastName: '',
  otherNames: '',
  nationalId: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  employeeNumber: '',
  department: '',
  memberType: 'MEMBER',
  welfareJoinDate: TODAY,
  nextOfKin: [],
  beneficiaries: [],
};

// ── component ─────────────────────────────────────────────────────────────────
export const MembersList: React.FC<MembersListProps> = ({ onEditMember }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Add-member modal
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newMember, setNewMember] = useState<AddMemberPayload>({ ...EMPTY_MEMBER });

  // View-member modal
  const [viewMember, setViewMember] = useState<Member | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      // const res = await membersApi.getAllMembers(params);
      // setMembers(normaliseMembers(res));

      const res = await membersApi.getAllMembers(params);
      // setMembers(normaliseMembers(res.data.data));
      setMembers(normaliseMembers(res.data));

    } catch (err: any) {
      toast.error(err.message ?? 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // ── add member ──────────────────────────────────────────────────────────────
  const handleAddMember = async () => {
    const { firstName, lastName, nationalId, email, phone, dateOfBirth } = newMember;
    if (!firstName || !lastName || !nationalId || !email || !phone || !dateOfBirth) {
      toast.error('Please fill all required fields');
      return;
    }
    setAdding(true);
    try {
      await membersApi.addMember(newMember);
      toast.success('Member added successfully!');
      setShowAdd(false);
      setNewMember({ ...EMPTY_MEMBER });
      fetchMembers();
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to add member');
    } finally {
      setAdding(false);
    }
  };

  const field = (k: keyof AddMemberPayload) => (
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setNewMember(p => ({ ...p, [k]: e.target.value }))
  );

  const filteredMembers = members.filter(m => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      m.firstName.toLowerCase().includes(q) ||
      m.lastName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.nationalId.includes(q) ||
      m.id.toLowerCase().includes(q)
    );
  });

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users size={24} className="text-blue-600" /> Members
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {members.length} member{members.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={fetchMembers} className="flex items-center gap-1">
            <RefreshCw size={14} /> Refresh
          </Button>
          <Button onClick={() => setShowAdd(true)} className="flex items-center gap-2">
            <Plus size={16} /> Add Member
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, email, ID…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Add Member Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Add New Member</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                ['First Name *', 'firstName', 'text'],
                ['Last Name *', 'lastName', 'text'],
                ['Other Names', 'otherNames', 'text'],
                ['National ID *', 'nationalId', 'text'],
                ['Email *', 'email', 'email'],
                ['Phone *', 'phone', 'tel'],
                ['Date of Birth *', 'dateOfBirth', 'date'],
                ['Employee Number', 'employeeNumber', 'text'],
                ['Department', 'department', 'text'],
                ['Welfare Join Date *', 'welfareJoinDate', 'date'],
              ] as [string, keyof AddMemberPayload, string][]).map(([label, key, type]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={String(newMember[key] ?? '')}
                    onChange={field(key)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Type *</label>
                <select
                  value={newMember.memberType}
                  onChange={field('memberType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleAddMember} loading={adding}>
                {adding ? 'Adding…' : 'Add Member'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Member Modal */}
      {viewMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Member Details</h3>
              <button onClick={() => setViewMember(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {[
                ['Member Number', viewMember.id],
                ['Full Name', `${viewMember.firstName} ${viewMember.lastName}`],
                ['Email', viewMember.email],
                ['Phone', viewMember.phone],
                ['National ID', viewMember.nationalId],
                ['Date of Birth', viewMember.dateOfBirth],
                ['Status', viewMember.status],
                ['KYC Status', viewMember.kycStatus],
                ['Joined', new Date(viewMember.createdAt).toLocaleDateString()],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 w-32 shrink-0">{label}</span>
                  <span className="text-sm font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <Button variant="ghost" onClick={() => setViewMember(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <Card padding="sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Member', 'Member #', 'Contact', 'National ID', 'Status', 'KYC', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-sm font-medium text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(member => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs">
                          {member.firstName[0]}{member.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {member.firstName} {member.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">{member.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-900">{member.email}</p>
                      <p className="text-xs text-gray-500">{member.phone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">{member.nationalId}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={member.status} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={member.kycStatus} variant="kyc" />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewMember(member)}
                          className="p-1.5 rounded hover:bg-blue-50 text-blue-600 text-xs flex items-center gap-1"
                          title="View"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button
                          onClick={() => onEditMember(member.id)}
                          className="p-1.5 rounded hover:bg-gray-50 text-gray-600 text-xs flex items-center gap-1"
                          title="Edit"
                        >
                          <UserCheck size={14} /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredMembers.length === 0 && !loading && (
              <div className="text-center py-16 text-gray-500">
                <Users size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No members found</p>
                <p className="text-sm">Try adjusting your search or add a new member.</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

