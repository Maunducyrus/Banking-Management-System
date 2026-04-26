import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import {
  Users, Heart, Plus, ChevronDown,
  User, RefreshCw, Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  membersApi,
  type NextOfKinPayload,
  type BeneficiaryPayload,
} from '../../services/api';

// ── Constants ──────────────────────────────────────────────────────────────────
const RELATIONSHIPS = ['SPOUSE', 'CHILD', 'PARENT', 'SIBLING', 'OTHER'];

const EMPTY_KIN: NextOfKinPayload = {
  fullName: '', relationship: 'SPOUSE', identificationNumber: '',
  phone: '', email: '', address: '',
};

const EMPTY_BEN: BeneficiaryPayload = {
  fullName: '', relationship: 'SPOUSE', identification: '',
  phone: '', email: '', beneficiaryPercentage: 0,
};

// ── API unwrapper (confirmed shape: { success, data: { content: [] } }) ────────
function extractMemberList(res: any): any[] {
  if (!res) return [];
  if (Array.isArray(res?.data?.content)) return res.data.content;
  if (Array.isArray(res?.data))          return res.data;
  if (Array.isArray(res?.content))       return res.content;
  if (Array.isArray(res))                return res;
  return [];
}

// ── Component ──────────────────────────────────────────────────────────────────
export const KinBeneficiaries: React.FC = () => {
  // Members list (for dropdown)
  const [members,        setMembers]        = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [memberSearch,   setMemberSearch]   = useState('');
  const [dropdownOpen,   setDropdownOpen]   = useState(false);

  // Selected member
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<'kin' | 'beneficiary'>('kin');

  // Next of Kin form
  const [kin,       setKin]       = useState<NextOfKinPayload>({ ...EMPTY_KIN });
  const [addingKin, setAddingKin] = useState(false);

  // Beneficiary form
  const [ben,       setBen]       = useState<BeneficiaryPayload>({ ...EMPTY_BEN });
  const [addingBen, setAddingBen] = useState(false);

  // ── Load all members on mount ────────────────────────────────────────────────
  const loadMembers = useCallback(async () => {
    setLoadingMembers(true);
    try {
      const res = await membersApi.getAllMembers();
      setMembers(extractMemberList(res));
    } catch (err: any) {
      toast.error('Failed to load members');
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  useEffect(() => { loadMembers(); }, [loadMembers]);

  // ── Reload selected member (after add) ──────────────────────────────────────
  const reloadMember = useCallback(async () => {
    if (!selectedMember?.memberNumber) return;
    try {
      const res  = await membersApi.getMemberByNumber(selectedMember.memberNumber);
      const list = extractMemberList(res);
      const fresh = list.find(
        (m: any) => m.memberNumber === selectedMember.memberNumber
      ) ?? list[0] ?? null;
      if (fresh) setSelectedMember(fresh);
    } catch (_) {}
  }, [selectedMember?.memberNumber]);

  // ── Select a member from dropdown ───────────────────────────────────────────
  const handleSelectMember = (m: any) => {
    setSelectedMember(m);
    setMemberSearch('');
    setDropdownOpen(false);
    setActiveTab('kin');
  };

  // ── Filtered members for search ──────────────────────────────────────────────
  const filteredMembers = members.filter(m => {
    if (!memberSearch) return true;
    const q = memberSearch.toLowerCase();
    return (
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
      (m.memberNumber ?? '').toLowerCase().includes(q) ||
      (m.department ?? '').toLowerCase().includes(q) ||
      (m.email ?? '').toLowerCase().includes(q)
    );
  });

  // ── Add Next of Kin ──────────────────────────────────────────────────────────
  const handleAddKin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) { toast.error('Select a member first'); return; }
    if (!kin.fullName || !kin.identificationNumber || !kin.phone) {
      toast.error('Full name, ID number and phone are required'); return;
    }
    setAddingKin(true);
    try {
      await membersApi.addNextOfKin(selectedMember.memberNumber, kin);
      toast.success('Next of kin added!');
      setKin({ ...EMPTY_KIN });
      await reloadMember();
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to add next of kin');
    } finally {
      setAddingKin(false);
    }
  };

  // ── Add Beneficiary ──────────────────────────────────────────────────────────
  const handleAddBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) { toast.error('Select a member first'); return; }
    if (!ben.fullName || !ben.identification || !ben.phone || !ben.beneficiaryPercentage) {
      toast.error('Please fill all required fields'); return;
    }
    if (ben.beneficiaryPercentage <= 0 || ben.beneficiaryPercentage > 100) {
      toast.error('Percentage must be between 1 and 100'); return;
    }
    setAddingBen(true);
    try {
      await membersApi.addBeneficiary(selectedMember.memberNumber, ben);
      toast.success('Beneficiary added!');
      setBen({ ...EMPTY_BEN });
      await reloadMember();
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
      setBen(p => ({
        ...p,
        [k]: k === 'beneficiaryPercentage' ? Number(e.target.value) : e.target.value,
      }));

  const nextOfKin:     any[] = selectedMember?.nextOfKin     ?? selectedMember?.next_of_kin ?? [];
  const beneficiaries: any[] = selectedMember?.beneficiaries ?? selectedMember?.beneficiary  ?? [];
  const totalPct = beneficiaries.reduce(
    (s: number, b: any) => s + (b.beneficiaryPercentage ?? 0), 0
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Next of Kin & Beneficiaries</h2>
        <p className="text-gray-500 text-sm mt-1">
          Select a member to view and manage their next of kin and beneficiaries
        </p>
      </div>

      {/* ── Member selector ── */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">Select Member *</label>
          <button
            onClick={loadMembers}
            disabled={loadingMembers}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition disabled:opacity-40"
          >
            <RefreshCw size={12} className={loadingMembers ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Custom dropdown */}
        <div className="relative">
          {/* Trigger button */}
          <button
            type="button"
            onClick={() => setDropdownOpen(v => !v)}
            className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-sm transition-all ${
              dropdownOpen
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-300 hover:border-gray-400'
            } bg-white`}
          >
            {selectedMember ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                  {selectedMember.firstName?.[0]}{selectedMember.lastName?.[0]}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 leading-tight">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </p>
                  <p className="text-xs text-gray-400 font-mono leading-tight">
                    {selectedMember.memberNumber}
                    {selectedMember.department ? ` · ${selectedMember.department}` : ''}
                  </p>
                </div>
              </div>
            ) : (
              <span className="text-gray-400">
                {loadingMembers ? 'Loading members…' : '— Select a member —'}
              </span>
            )}
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown panel */}
          {dropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
              {/* Search inside dropdown */}
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    autoFocus
                    type="text"
                    value={memberSearch}
                    onChange={e => setMemberSearch(e.target.value)}
                    placeholder="Search by name, member number…"
                    className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  />
                </div>
              </div>

              {/* List */}
              <div className="max-h-64 overflow-y-auto">
                {loadingMembers ? (
                  <div className="flex justify-center py-6">
                    <LoadingSpinner />
                  </div>
                ) : filteredMembers.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-sm">
                    {memberSearch ? 'No members match your search' : 'No members found'}
                  </div>
                ) : (
                  filteredMembers.map((m: any) => {
                    const isSelected = selectedMember?.memberNumber === m.memberNumber;
                    return (
                      <button
                        key={m.memberNumber ?? m.id}
                        type="button"
                        onClick={() => handleSelectMember(m)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-blue-50 ${
                          isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                        }`}
                      >
                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {m.firstName?.[0]}{m.lastName?.[0]}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 leading-tight truncate">
                            {m.firstName} {m.lastName}
                            {m.otherNames ? ` ${m.otherNames}` : ''}
                          </p>
                          <p className="text-xs text-gray-400 font-mono leading-tight">
                            {m.memberNumber}
                            {m.department ? ` · ${m.department}` : ''}
                          </p>
                        </div>
                        {/* Badges */}
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          {m.nextOfKin?.length > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                              {m.nextOfKin.length} kin
                            </span>
                          )}
                          {m.beneficiaries?.length > 0 && (
                            <span className="text-xs bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-full font-medium">
                              {m.beneficiaries.length} ben
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer count */}
              {!loadingMembers && (
                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-400">
                    {filteredMembers.length} of {members.length} member{members.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Overlay to close dropdown */}
        {dropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => { setDropdownOpen(false); setMemberSearch(''); }}
          />
        )}
      </Card>

      {/* ── No member selected state ── */}
      {!selectedMember && (
        <Card>
          <div className="text-center py-16 text-gray-400">
            <Users size={44} className="mx-auto mb-3 text-gray-200" />
            <p className="font-semibold text-gray-500">No member selected</p>
            <p className="text-sm mt-1">
              Use the dropdown above to select a member
            </p>
          </div>
        </Card>
      )}

      {/* ── Content (only when member is selected) ── */}
      {selectedMember && (
        <>
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
              {nextOfKin.length > 0 && (
                <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">
                  {nextOfKin.length}
                </span>
              )}
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
              {beneficiaries.length > 0 && (
                <span className="ml-1 text-xs bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-full font-semibold">
                  {beneficiaries.length}
                </span>
              )}
            </button>
          </div>

          {/* ══════════ NEXT OF KIN TAB ══════════ */}
          {activeTab === 'kin' && (
            <div className="space-y-5">

              {/* Add form */}
              <Card>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Plus size={16} className="text-blue-600" />
                  Add Next of Kin for{' '}
                  <span className="text-blue-700">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </span>
                </h3>
                <form onSubmit={handleAddKin} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {([
                      ['Full Name *',   'fullName',             'text',  'Jane Doe'      ],
                      ['ID Number *',   'identificationNumber', 'text',  '31000456'      ],
                      ['Phone *',       'phone',                'tel',   '0712345678'    ],
                      ['Email',         'email',                'email', 'jane@email.com'],
                      ['Address',       'address',              'text',  'Nairobi, Kenya'],
                    ] as [string, keyof NextOfKinPayload, string, string][]).map(
                      ([label, key, type, placeholder]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                          <input
                            type={type}
                            value={String(kin[key])}
                            onChange={kinField(key)}
                            placeholder={placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      )
                    )}
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
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" loading={addingKin} className="flex items-center gap-2">
                      <Plus size={16} /> Add Next of Kin
                    </Button>
                  </div>
                </form>
              </Card>

              {/* Existing records */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {nextOfKin.length > 0
                    ? `${nextOfKin.length} Next of Kin on record`
                    : 'No next of kin added yet'}
                </p>
                {nextOfKin.length === 0 ? (
                  <Card>
                    <div className="text-center py-10 text-gray-400">
                      <Users size={36} className="mx-auto mb-2 text-gray-200" />
                      <p className="text-sm">No next of kin recorded for this member</p>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {nextOfKin.map((k: any, i: number) => (
                      <Card key={k.id ?? i} padding="sm">
                        <div className="flex items-start gap-3 p-1">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <User size={17} className="text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-gray-900 text-sm truncate">
                                {k.fullName}
                              </p>
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium shrink-0">
                                {k.relationship}
                              </span>
                            </div>
                            <div className="mt-1 space-y-0.5 text-xs text-gray-500">
                              <p><span className="font-medium text-gray-600">ID:</span> {k.identificationNumber}</p>
                              <p><span className="font-medium text-gray-600">Phone:</span> {k.phone}</p>
                              {k.email   && <p><span className="font-medium text-gray-600">Email:</span> {k.email}</p>}
                              {k.address && <p className="text-gray-400">{k.address}</p>}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════ BENEFICIARIES TAB ══════════ */}
          {activeTab === 'beneficiary' && (
            <div className="space-y-5">

              {/* Add form */}
              <Card>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Plus size={16} className="text-pink-600" />
                  Add Beneficiary for{' '}
                  <span className="text-pink-700">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </span>
                </h3>
                <form onSubmit={handleAddBeneficiary} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {([
                      ['Full Name *', 'fullName',       'text',  'Jane Doe'      ],
                      ['ID Number *', 'identification', 'text',  '31000456'      ],
                      ['Phone *',     'phone',          'tel',   '0712345678'    ],
                      ['Email',       'email',          'email', 'jane@email.com'],
                    ] as [string, keyof BeneficiaryPayload, string, string][]).map(
                      ([label, key, type, placeholder]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                          <input
                            type={type}
                            value={String(ben[key])}
                            onChange={benField(key)}
                            placeholder={placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      )
                    )}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Share (%) *</label>
                      <input
                        type="number" min={1} max={100}
                        value={ben.beneficiaryPercentage || ''}
                        onChange={benField('beneficiaryPercentage')}
                        placeholder="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {beneficiaries.length > 0 && (
                        <p className="text-xs mt-1">
                          Currently:{' '}
                          <span className={`font-semibold ${
                            totalPct > 100 ? 'text-red-600' :
                            totalPct === 100 ? 'text-green-600' : 'text-amber-600'
                          }`}>
                            {totalPct}% allocated · {Math.max(0, 100 - totalPct)}% remaining
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" loading={addingBen} className="flex items-center gap-2">
                      <Plus size={16} /> Add Beneficiary
                    </Button>
                  </div>
                </form>
              </Card>

              {/* Existing records */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {beneficiaries.length > 0
                    ? `${beneficiaries.length} Beneficiar${beneficiaries.length === 1 ? 'y' : 'ies'} on record`
                    : 'No beneficiaries added yet'}
                </p>

                {beneficiaries.length === 0 ? (
                  <Card>
                    <div className="text-center py-10 text-gray-400">
                      <Heart size={36} className="mx-auto mb-2 text-gray-200" />
                      <p className="text-sm">No beneficiaries recorded for this member</p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {/* Allocation bar */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">Total allocation</span>
                        <span className={`text-sm font-bold ${
                          totalPct === 100 ? 'text-green-600' :
                          totalPct > 100   ? 'text-red-600'   : 'text-amber-600'
                        }`}>
                          {totalPct}%
                          {totalPct === 100 && ' ✓'}
                          {totalPct > 100  && ' — exceeds 100%'}
                          {totalPct < 100  && ` — ${100 - totalPct}% unallocated`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            totalPct > 100  ? 'bg-red-500' :
                            totalPct === 100 ? 'bg-green-500' : 'bg-amber-400'
                          }`}
                          style={{ width: `${Math.min(totalPct, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {beneficiaries.map((b: any, i: number) => (
                        <Card key={b.id ?? i} padding="sm">
                          <div className="flex items-start gap-3 p-1">
                            {/* Share circle */}
                            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                              <span className="text-pink-700 font-bold text-sm leading-none">
                                {b.beneficiaryPercentage}%
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-semibold text-gray-900 text-sm truncate">
                                  {b.fullName}
                                </p>
                                <span className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full font-medium shrink-0">
                                  {b.relationship}
                                </span>
                              </div>
                              <div className="mt-1 space-y-0.5 text-xs text-gray-500">
                                <p><span className="font-medium text-gray-600">ID:</span> {b.identification}</p>
                                <p><span className="font-medium text-gray-600">Phone:</span> {b.phone}</p>
                                {b.email && <p><span className="font-medium text-gray-600">Email:</span> {b.email}</p>}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default KinBeneficiaries;
