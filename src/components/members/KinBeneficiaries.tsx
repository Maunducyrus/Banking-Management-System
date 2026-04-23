import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Users, Heart, Plus, CheckCircle } from 'lucide-react';
// import { Users, Heart, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';

import toast from 'react-hot-toast';
import { membersApi, type NextOfKinPayload, type BeneficiaryPayload } from '../../services/api';

// ── helpers ───────────────────────────────────────────────────────────────────
const RELATIONSHIPS = ['SPOUSE', 'CHILD', 'PARENT', 'SIBLING', 'OTHER'];

const EMPTY_KIN: NextOfKinPayload = {
  fullName: '',
  relationship: 'SPOUSE',
  identificationNumber: '',
  phone: '',
  email: '',
  address: '',
};

const EMPTY_BENEFICIARY: BeneficiaryPayload = {
  fullName: '',
  relationship: 'SPOUSE',
  identification: '',
  phone: '',
  email: '',
  beneficiaryPercentage: 0,
};

// ── component ─────────────────────────────────────────────────────────────────
export const KinBeneficiaries: React.FC = () => {
  const [memberNumber, setMemberNumber] = useState('');
  const [activeTab, setActiveTab] = useState<'kin' | 'beneficiary'>('kin');

  // Next of Kin
  const [kin, setKin] = useState<NextOfKinPayload>({ ...EMPTY_KIN });
  const [addingKin, setAddingKin] = useState(false);
  const [kinSuccess, setKinSuccess] = useState(false);

  // Beneficiary
  const [ben, setBen] = useState<BeneficiaryPayload>({ ...EMPTY_BENEFICIARY });
  const [addingBen, setAddingBen] = useState(false);
  const [benSuccess, setBenSuccess] = useState(false);

  // ── submit kin ───────────────────────────────────────────────────────────────
  const handleAddKin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberNumber.trim()) { toast.error('Enter a member number first'); return; }
    if (!kin.fullName || !kin.identificationNumber || !kin.phone) {
      toast.error('Please fill all required fields'); return;
    }
    setAddingKin(true);
    try {
      await membersApi.addNextOfKin(memberNumber.trim(), kin);
      setKinSuccess(true);
      toast.success('Next of kin added!');
      setKin({ ...EMPTY_KIN });
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to add next of kin');
    } finally {
      setAddingKin(false);
    }
  };

  // ── submit beneficiary ───────────────────────────────────────────────────────
  const handleAddBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberNumber.trim()) { toast.error('Enter a member number first'); return; }
    if (!ben.fullName || !ben.identification || !ben.phone || !ben.beneficiaryPercentage) {
      toast.error('Please fill all required fields'); return;
    }
    if (ben.beneficiaryPercentage <= 0 || ben.beneficiaryPercentage > 100) {
      toast.error('Percentage must be between 1 and 100'); return;
    }
    setAddingBen(true);
    try {
      await membersApi.addBeneficiary(memberNumber.trim(), ben);
      setBenSuccess(true);
      toast.success('Beneficiary added!');
      setBen({ ...EMPTY_BENEFICIARY });
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to add beneficiary');
    } finally {
      setAddingBen(false);
    }
  };

  const kinField = (k: keyof NextOfKinPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setKin(p => ({ ...p, [k]: e.target.value }));

  const benField = (k: keyof BeneficiaryPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setBen(p => ({ ...p, [k]: k === 'beneficiaryPercentage' ? Number(e.target.value) : e.target.value }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Next of Kin & Beneficiaries</h2>
        <p className="text-gray-600 text-sm mt-1">Add next of kin and beneficiaries to a member profile</p>
      </div>

      {/* Member Number Input */}
      <Card>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Member Number *</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={memberNumber}
            onChange={e => { setMemberNumber(e.target.value); setKinSuccess(false); setBenSuccess(false); }}
            placeholder="e.g. WM-30023456-1"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Enter the member number before adding next of kin or beneficiaries.</p>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('kin')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'kin'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={16} /> Next of Kin
        </button>
        <button
          onClick={() => setActiveTab('beneficiary')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'beneficiary'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Heart size={16} /> Beneficiaries
        </button>
      </div>

      {/* Next of Kin Form */}
      {activeTab === 'kin' && (
        <Card>
          {kinSuccess && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
              <CheckCircle size={16} className="text-green-600" />
              <p className="text-green-700 text-sm font-medium">Next of kin added successfully!</p>
            </div>
          )}
          <form onSubmit={handleAddKin} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={kin.fullName}
                  onChange={kinField('fullName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
                <select
                  value={kin.relationship}
                  onChange={kinField('relationship')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Number *</label>
                <input
                  type="text"
                  value={kin.identificationNumber}
                  onChange={kinField('identificationNumber')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="31000456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={kin.phone}
                  onChange={kinField('phone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="0712345678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={kin.email}
                  onChange={kinField('email')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="jane@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={kin.address}
                  onChange={kinField('address')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Nairobi, Kenya"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" loading={addingKin} className="flex items-center gap-2">
                <Plus size={16} /> Add Next of Kin
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Beneficiary Form */}
      {activeTab === 'beneficiary' && (
        <Card>
          {benSuccess && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
              <CheckCircle size={16} className="text-green-600" />
              <p className="text-green-700 text-sm font-medium">Beneficiary added successfully!</p>
            </div>
          )}
          <form onSubmit={handleAddBeneficiary} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={ben.fullName}
                  onChange={benField('fullName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
                <select
                  value={ben.relationship}
                  onChange={benField('relationship')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Number *</label>
                <input
                  type="text"
                  value={ben.identification}
                  onChange={benField('identification')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="31000456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={ben.phone}
                  onChange={benField('phone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="0712345678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={ben.email}
                  onChange={benField('email')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="jane@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Percentage (%) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={ben.beneficiaryPercentage || ''}
                  onChange={benField('beneficiaryPercentage')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="50"
                />
                <p className="text-xs text-gray-500 mt-1">Total across all beneficiaries should equal 100%</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" loading={addingBen} className="flex items-center gap-2">
                <Plus size={16} /> Add Beneficiary
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default KinBeneficiaries;