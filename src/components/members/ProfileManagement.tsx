import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Shield, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { NextOfKin } from '../../types';
import toast from 'react-hot-toast';

interface ProfileManagementProps {
  onBack: () => void;
}

export const ProfileManagement: React.FC<ProfileManagementProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'nextofkin' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Mock member data
  const [memberData, setMemberData] = useState({
    firstName: user?.firstName || '',
    middleName: '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+1-234-567-8900',
    nationalId: 'ID123456789',
    dateOfBirth: '1985-06-15',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA'
    },
    employmentStatus: 'employed',
    monthlyIncome: '5000',
    employer: 'Tech Solutions Inc.'
  });

  const [nextOfKinList, setNextOfKinList] = useState<NextOfKin[]>([
    {
      id: '1',
      memberId: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@email.com',
      phone: '+1-234-567-8901',
      relationship: 'Spouse',
      address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA'
      },
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    }
  ]);

  const [newNextOfKin, setNewNextOfKin] = useState<Omit<NextOfKin, 'id' | 'memberId' | 'createdAt' | 'updatedAt'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    relationship: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    }
  });

  const [showAddNextOfKin, setShowAddNextOfKin] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setMemberData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setMemberData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNextOfKinChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setNewNextOfKin(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setNewNextOfKin(prev => ({ ...prev, [field]: value }));
    }
  };

  const saveProfile = () => {
    // Validate required fields
    if (!memberData.firstName || !memberData.lastName || !memberData.email || !memberData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Profile updated successfully! Changes may take a few minutes to reflect.');
    setIsEditing(false);
  };

  const addNextOfKin = () => {
    if (!newNextOfKin.firstName || !newNextOfKin.lastName || !newNextOfKin.phone || !newNextOfKin.relationship) {
      toast.error('Please fill in all required fields');
      return;
    }

    const nextOfKin: NextOfKin = {
      ...newNextOfKin,
      id: Date.now().toString(),
      memberId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNextOfKinList(prev => [...prev, nextOfKin]);
    setNewNextOfKin({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      relationship: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      }
    });
    setShowAddNextOfKin(false);
    toast.success('Next of kin added successfully!');
  };

  const removeNextOfKin = (id: string) => {
    setNextOfKinList(prev => prev.filter(nok => nok.id !== id));
    toast.success('Next of kin removed successfully!');
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
          <h2 className="text-2xl font-bold text-gray-900">Profile Management</h2>
          <p className="text-gray-600">Manage your personal information and settings</p>
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {memberData.firstName} {memberData.lastName}
              </h3>
              <p className="text-gray-600">{memberData.email}</p>
              <div className="flex items-center mt-1">
                <StatusBadge status="verified" variant="kyc" />
                <span className="ml-2 text-sm text-gray-600">KYC Verified</span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? 'secondary' : 'primary'}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-800">Member Since</p>
            <p className="text-xs text-blue-600">Jan 2024</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-800">Account Status</p>
            <p className="text-xs text-green-600">Active</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <User className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-amber-800">Active Loans</p>
            <p className="text-xs text-amber-600">2 Loans</p>
          </div>
          <div className="text-center p-4 bg-teal-50 rounded-lg">
            <Mail className="w-6 h-6 text-teal-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-teal-800">Credit Score</p>
            <p className="text-xs text-teal-600">720</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card>
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab('nextofkin')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'nextofkin'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Next of Kin
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'security'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Security Settings
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={memberData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={memberData.middleName}
                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={memberData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={memberData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={memberData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    National ID *
                  </label>
                  <input
                    type="text"
                    value={memberData.nationalId}
                    onChange={(e) => handleInputChange('nationalId', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={memberData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Status
                  </label>
                  <select
                    value={memberData.employmentStatus}
                    onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    <option value="employed">Employed</option>
                    <option value="self_employed">Self Employed</option>
                    <option value="business_owner">Business Owner</option>
                    <option value="retired">Retired</option>
                    <option value="student">Student</option>
                  </select>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Address Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={memberData.address.street}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={memberData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      value={memberData.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={memberData.address.postalCode}
                      onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={memberData.address.country}
                      onChange={(e) => handleInputChange('address.country', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4">
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveProfile}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'nextofkin' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Next of Kin</h3>
                <Button
                  onClick={() => setShowAddNextOfKin(true)}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Next of Kin
                </Button>
              </div>

              {showAddNextOfKin && (
                <Card className="border-2 border-blue-200">
                  <h4 className="font-medium text-gray-900 mb-4">Add New Next of Kin</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={newNextOfKin.firstName}
                        onChange={(e) => handleNextOfKinChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={newNextOfKin.lastName}
                        onChange={(e) => handleNextOfKinChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={newNextOfKin.phone}
                        onChange={(e) => handleNextOfKinChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relationship *
                      </label>
                      <input
                        type="text"
                        value={newNextOfKin.relationship}
                        onChange={(e) => handleNextOfKinChange('relationship', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Spouse, Parent, Sibling"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newNextOfKin.email}
                        onChange={(e) => handleNextOfKinChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-4">
                    <Button variant="ghost" onClick={() => setShowAddNextOfKin(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addNextOfKin}>
                      Add Next of Kin
                    </Button>
                  </div>
                </Card>
              )}

              <div className="space-y-4">
                {nextOfKinList.map((nok) => (
                  <Card key={nok.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User className="w-10 h-10 text-gray-400 mr-4" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {nok.firstName} {nok.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">{nok.relationship}</p>
                          <div className="flex items-center mt-1 text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-1" />
                            {nok.phone}
                            {nok.email && (
                              <>
                                <Mail className="w-4 h-4 ml-3 mr-1" />
                                {nok.email}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNextOfKin(nok.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {nextOfKinList.length === 0 && !showAddNextOfKin && (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No next of kin added yet</p>
                  <Button onClick={() => setShowAddNextOfKin(true)} variant="ghost">
                    Add Your First Next of Kin
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
              
              <Card className="border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Change Password</h4>
                    <p className="text-sm text-gray-600">Update your account password</p>
                  </div>
                  <Button variant="ghost">
                    Change Password
                  </Button>
                </div>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <StatusBadge status="inactive" />
                </div>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Login Notifications</h4>
                    <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
                  </div>
                  <StatusBadge status="active" />
                </div>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Account Deactivation</h4>
                    <p className="text-sm text-gray-600">Temporarily deactivate your account</p>
                  </div>
                  <Button variant="ghost" className="text-red-600 hover:text-red-700">
                    Deactivate Account
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};