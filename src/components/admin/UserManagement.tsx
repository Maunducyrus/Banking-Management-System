import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Search, Filter, UserPlus, Shield, CheckCircle, Eye, EyeOff } from 'lucide-react';
// import { Search, Filter, UserPlus, Shield, CheckCircle, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { getStorageData } from '../../utils/LocalStorage';
import type { User } from '../../types';
import toast from 'react-hot-toast';
import { authApi, type RegisterPayload } from '../../services/api';

const EMPTY_REG: RegisterPayload = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [localUsers, setLocalUsers] = useState<User[]>(() => getStorageData().users);

  // Register new user
  const [showAdd, setShowAdd] = useState(false);
  const [reg, setReg] = useState<RegisterPayload>({ ...EMPTY_REG });
  const [registering, setRegistering] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // Activate user
  const [activateEmail, setActivateEmail] = useState('');
  const [activating, setActivating] = useState(false);
  const [showActivatePanel, setShowActivatePanel] = useState(false);

  const filteredUsers = localUsers.filter(u => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const regField = (k: keyof RegisterPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setReg(p => ({ ...p, [k]: e.target.value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reg.firstName || !reg.lastName || !reg.email || !reg.phoneNumber || !reg.password) {
      toast.error('Please fill all required fields');
      return;
    }
    if (reg.password !== reg.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setRegistering(true);
    try {
      await authApi.register(reg);
      toast.success(`User ${reg.email} registered! They can now sign in after activation.`);
      setShowAdd(false);
      setReg({ ...EMPTY_REG });
      // Reload local users list
      setLocalUsers(getStorageData().users);
    } catch (err: any) {
      toast.error(err.message ?? 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activateEmail.trim()) { toast.error('Enter email to activate'); return; }
    setActivating(true);
    try {
      await authApi.activateUser({ email: activateEmail.trim(), option: 'True' });
      toast.success(`User ${activateEmail} activated successfully!`);
      setActivateEmail('');
      setShowActivatePanel(false);
    } catch (err: any) {
      toast.error(err.message ?? 'Activation failed');
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield size={24} className="text-blue-600" /> User Management
          </h2>
          <p className="text-gray-600 text-sm mt-1">Register and manage system users</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowActivatePanel(v => !v)}
            className="flex items-center gap-1"
          >
            <CheckCircle size={14} /> Activate User
          </Button>
          <Button onClick={() => setShowAdd(v => !v)} className="flex items-center gap-2">
            <UserPlus size={16} /> Register User
          </Button>
        </div>
      </div>

      {/* Activate User Panel */}
      {showActivatePanel && (
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" /> Activate User Account
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Enter the email of a registered user to activate their account via the API.
          </p>
          <form onSubmit={handleActivate} className="flex gap-3">
            <input
              type="email"
              value={activateEmail}
              onChange={e => setActivateEmail(e.target.value)}
              placeholder="user@example.com"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" loading={activating} size="sm">Activate</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowActivatePanel(false)}>Cancel</Button>
          </form>
        </Card>
      )}

      {/* Register User Form */}
      {showAdd && (
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <UserPlus size={16} className="text-blue-600" /> Register New User
          </h3>
          <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              ['First Name *', 'firstName', 'text'],
              ['Last Name *', 'lastName', 'text'],
              ['Email *', 'email', 'email'],
              ['Phone *', 'phoneNumber', 'tel'],
            ] as [string, keyof RegisterPayload, string][]).map(([label, key, type]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  value={String(reg[key])}
                  onChange={regField(key)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={reg.password}
                  onChange={regField('password')}
                  placeholder="Min 8 chars, include symbol"
                  className="w-full px-3 py-2 pr-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password *</label>
              <input
                type="password"
                value={reg.confirmPassword}
                onChange={regField('confirmPassword')}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  reg.confirmPassword && reg.password !== reg.confirmPassword
                    ? 'border-red-400'
                    : 'border-gray-300'
                }`}
              />
            </div>
            <div className="col-span-full flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button type="submit" loading={registering} size="sm">
                Register User
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search users…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card padding="sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {['User', 'Email', 'Role', 'Status', 'Created'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-sm font-medium text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <span className="font-medium text-sm text-gray-900">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Shield size={36} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No users found.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Note about API */}
      {/* <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
        <strong>Note:</strong> User registration and activation use the live API
        (<code>POST /api/v1/auth/register</code> and <code>POST /api/v1/auth/enable_user</code>).
        The table above shows locally cached users. Newly registered users will appear after the next page load.
      </div> */}
    </div>
  );
};
