import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ArrowLeft, User, Users, Heart, Plus, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { membersApi, type NextOfKinPayload, type BeneficiaryPayload } from '../../services/api';

interface MemberEditProps {
  memberId: string; // memberNumber e.g. "WM-30023456-1"
  onBack: () => void;
}

const RELATIONSHIPS = ['SPOUSE', 'CHILD', 'PARENT', 'SIBLING', 'OTHER'];

const EMPTY_KIN: NextOfKinPayload = {
  fullName: '', relationship: 'SPOUSE', identificationNumber: '',
  phone: '', email: '', address: '',
};

const EMPTY_BEN: BeneficiaryPayload = {
  fullName: '', relationship: 'SPOUSE', identification: '',
  phone: '', email: '', beneficiaryPercentage: 0,
};

// ─── Confirmed API response shape ─────────────────────────────────────────────
// {
//   success: true,
//   message: "Members retrieved",
//   data: {
//     content: [ { memberNumber, firstName, ..., nextOfKin: [], beneficiaries: [] } ],
//     totalElements: N, ...
//   },
//   timestamp: "..."
// }
// getMemberByNumber uses the same shape (content[0]).
// ─────────────────────────────────────────────────────────────────────────────
function normaliseMember(res: any): any | null {
  if (!res) return null;

  // Unwrap: res.data.content[0]  (confirmed shape)
  let m: any = null;

  if (Array.isArray(res?.data?.content) && res.data.content.length > 0) {
    m = res.data.content[0];
  } else if (res?.data && !Array.isArray(res.data) && !res.data.content) {
    // Non-paginated direct object: res.data = { memberNumber, ... }
    m = res.data;
  } else if (Array.isArray(res?.data)) {
    m = res.data[0];
  } else if (Array.isArray(res?.content)) {
    m = res.content[0];
  } else if (Array.isArray(res)) {
    m = res[0];
  }

  if (!m) return null;

  return {
    memberNumber:    m.memberNumber    ?? m.id          ?? '',
    firstName:       m.firstName       ?? m.first_name  ?? '',
    lastName:        m.lastName        ?? m.last_name   ?? '',
    otherNames:      m.otherNames      ?? m.other_names ?? '',
    email:           m.email           ?? '',
    phone:           m.phone           ?? '',
    nationalId:      m.nationalId      ?? '',
    dateOfBirth:     m.dateOfBirth     ?? '',
    department:      m.department      ?? '',
    employeeNumber:  m.employeeNumber  ?? '',
    memberType:      m.memberType      ?? '',
    welfareJoinDate: m.welfareJoinDate ?? '',
    status:          m.status          ?? 'ACTIVE',
    kycStatus:       m.kycStatus       ?? 'PENDING',
    nextOfKin:       Array.isArray(m.nextOfKin)    ? m.nextOfKin    :
                     Array.isArray(m.next_of_kin)  ? m.next_of_kin  : [],
    beneficiaries:   Array.isArray(m.beneficiaries) ? m.beneficiaries :
                     Array.isArray(m.beneficiary)   ? m.beneficiary   : [],
  };
}

export const MemberEdit: React.FC<MemberEditProps> = ({ memberId, onBack }) => {
  const [member,      setMember]      = useState<any | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [reloading,   setReloading]   = useState(false);
  const [activeTab,   setActiveTab]   = useState<'info' | 'kin' | 'beneficiaries'>('info');

  const [kin,         setKin]         = useState<NextOfKinPayload>({ ...EMPTY_KIN });
  const [addingKin,   setAddingKin]   = useState(false);
  const [showKinForm, setShowKinForm] = useState(false);

  const [ben,         setBen]         = useState<BeneficiaryPayload>({ ...EMPTY_BEN });
  const [addingBen,   setAddingBen]   = useState(false);
  const [showBenForm, setShowBenForm] = useState(false);

  // ── Load / reload member ───────────────────────────────────────────────────
  const loadMember = useCallback(async (isReload = false) => {
    if (isReload) setReloading(true);
    try {
      const res = await membersApi.getMemberByNumber(memberId);
      console.log('[MemberEdit] raw response:', res);
      const normalised = normaliseMember(res);
      console.log('[MemberEdit] normalised:', normalised);
      setMember(normalised);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to load member');
      setMember(null);
    } finally {
      setLoading(false);
      setReloading(false);
    }
  }, [memberId]);

  useEffect(() => {
    setLoading(true);
    loadMember();
  }, [loadMember]);

  // ── Add Next of Kin ────────────────────────────────────────────────────────
  const handleAddKin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kin.fullName || !kin.identificationNumber || !kin.phone) {
      toast.error('Full name, ID number and phone are required');
      return;
    }
    setAddingKin(true);
    try {
      await membersApi.addNextOfKin(memberId, kin);
      toast.success('Next of kin added!');
      setKin({ ...EMPTY_KIN });
      setShowKinForm(false);
      await loadMember(true);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to add next of kin');
    } finally {
      setAddingKin(false);
    }
  };

  // ── Add Beneficiary ────────────────────────────────────────────────────────
  const handleAddBen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ben.fullName || !ben.identification || !ben.phone || !ben.beneficiaryPercentage) {
      toast.error('All fields including share percentage are required');
      return;
    }
    setAddingBen(true);
    try {
      await membersApi.addBeneficiary(memberId, ben);
      toast.success('Beneficiary added!');
      setBen({ ...EMPTY_BEN });
      setShowBenForm(false);
      await loadMember(true);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Members
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {member?.firstName || member?.lastName
              ? `${member.firstName} ${member.lastName}`
              : memberId}
          </h2>
          <p className="text-gray-500 text-sm font-mono">{memberId}</p>
        </div>
        <button
          onClick={() => loadMember(true)}
          disabled={reloading}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition disabled:opacity-40"
        >
          <RefreshCw size={13} className={reloading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex border-b border-gray-200">
        {([
          ['info',          'Member Info',   User  ],
          ['kin',           'Next of Kin',   Users ],
          ['beneficiaries', 'Beneficiaries', Heart ],
        ] as [string, string, any][]).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* ══════════════ TAB: Member Info ══════════════ */}
      {activeTab === 'info' && (
        member ? (
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-bold select-none">
                {member.firstName?.[0] ?? '?'}{member.lastName?.[0] ?? ''}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {[member.firstName, member.otherNames, member.lastName].filter(Boolean).join(' ')}
                </h3>
                <p className="text-gray-500 text-sm">{member.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={member.status} />
                  <StatusBadge status={member.kycStatus} variant="kyc" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {([
                ['Member Number', member.memberNumber || memberId],
                ['National ID',   member.nationalId],
                ['Phone',         member.phone],
                ['Email',         member.email],
                ['Date of Birth', member.dateOfBirth],
                ['Department',    member.department],
                ['Employee No.',  member.employeeNumber],
                ['Member Type',   member.memberType],
                ['Join Date',     member.welfareJoinDate],
              ] as [string, string][]).filter(([, v]) => !!v).map(([label, value]) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {label}
                  </span>
                  <span className="text-sm text-gray-900 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card>
            <div className="text-center py-12 text-gray-400">
              <User size={36} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Could not load member details</p>
              <p className="text-xs mt-1 font-mono text-gray-400">{memberId}</p>
              <button
                onClick={() => loadMember(true)}
                className="mt-3 text-blue-600 text-sm hover:underline"
              >
                Try again
              </button>
            </div>
          </Card>
        )
      )}

      {/* ══════════════ TAB: Next of Kin ══════════════ */}
      {activeTab === 'kin' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              Next of Kin
              {member?.nextOfKin?.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  {member.nextOfKin.length}
                </span>
              )}
            </h3>
            <Button
              size="sm"
              onClick={() => setShowKinForm(v => !v)}
              className="flex items-center gap-1"
            >
              <Plus size={14} /> Add
            </Button>
          </div>

          {/* Add form */}
          {showKinForm && (
            <Card>
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users size={16} /> Add Next of Kin
              </h4>
              <form onSubmit={handleAddKin} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  ['Full Name *',  'fullName',             'text',  'Jane Doe'       ],
                  ['ID Number *',  'identificationNumber', 'text',  '31000456'       ],
                  ['Phone *',      'phone',                'tel',   '0712345678'     ],
                  ['Email',        'email',                'email', 'jane@email.com' ],
                  ['Address',      'address',              'text',  'Nairobi, Kenya' ],
                ] as [string, keyof NextOfKinPayload, string, string][]).map(
                  ([label, key, type, placeholder]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={String(kin[key])}
                        onChange={kinField(key)}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Relationship *
                  </label>
                  <select
                    value={kin.relationship}
                    onChange={kinField('relationship')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="col-span-full flex justify-end gap-3">
                  <Button
                    variant="ghost" size="sm" type="button"
                    onClick={() => setShowKinForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" type="submit" loading={addingKin}>
                    Save Next of Kin
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Existing records */}
          {member?.nextOfKin?.length > 0 ? (
            <div className="space-y-3">
              {member.nextOfKin.map((k: any, i: number) => (
                <Card key={k.id ?? i} padding="sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{k.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {k.relationship} · {k.phone}
                      </p>
                      {k.email   && <p className="text-xs text-gray-400 mt-0.5">{k.email}</p>}
                      {k.address && <p className="text-xs text-gray-400">{k.address}</p>}
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium shrink-0">
                      {k.relationship}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            !showKinForm && (
              <Card>
                <div className="text-center py-10 text-gray-400">
                  <Users size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-medium">No next of kin added yet</p>
                  <button
                    onClick={() => setShowKinForm(true)}
                    className="mt-3 text-blue-600 text-sm hover:underline"
                  >
                    Add next of kin
                  </button>
                </div>
              </Card>
            )
          )}
        </div>
      )}

      {/* ══════════════ TAB: Beneficiaries ══════════════ */}
      {activeTab === 'beneficiaries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              Beneficiaries
              {member?.beneficiaries?.length > 0 && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  {member.beneficiaries.length}
                </span>
              )}
            </h3>
            <Button
              size="sm"
              onClick={() => setShowBenForm(v => !v)}
              className="flex items-center gap-1"
            >
              <Plus size={14} /> Add
            </Button>
          </div>

          {/* Add form */}
          {showBenForm && (
            <Card>
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Heart size={16} /> Add Beneficiary
              </h4>
              <form onSubmit={handleAddBen} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  ['Full Name *', 'fullName',       'text',  'Jane Doe'       ],
                  ['ID Number *', 'identification', 'text',  '31000456'       ],
                  ['Phone *',     'phone',          'tel',   '0712345678'     ],
                  ['Email',       'email',          'email', 'jane@email.com' ],
                ] as [string, keyof BeneficiaryPayload, string, string][]).map(
                  ([label, key, type, placeholder]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={String(ben[key])}
                        onChange={benField(key)}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Relationship *
                  </label>
                  <select
                    value={ben.relationship}
                    onChange={benField('relationship')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Share (%) *
                  </label>
                  <input
                    type="number" min={1} max={100}
                    value={ben.beneficiaryPercentage || ''}
                    onChange={benField('beneficiaryPercentage')}
                    placeholder="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-full flex justify-end gap-3">
                  <Button
                    variant="ghost" size="sm" type="button"
                    onClick={() => setShowBenForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" type="submit" loading={addingBen}>
                    Save Beneficiary
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Existing records */}
          {member?.beneficiaries?.length > 0 ? (
            <div className="space-y-3">
              {member.beneficiaries.map((b: any, i: number) => (
                <Card key={b.id ?? i} padding="sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{b.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {b.relationship} · {b.phone}
                      </p>
                      {b.email && <p className="text-xs text-gray-400 mt-0.5">{b.email}</p>}
                    </div>
                    <span className="text-2xl font-bold text-green-600 shrink-0">
                      {b.beneficiaryPercentage}%
                    </span>
                  </div>
                </Card>
              ))}

              {/* Total allocation bar */}
              {(() => {
                const total = member.beneficiaries.reduce(
                  (s: number, b: any) => s + (b.beneficiaryPercentage ?? 0), 0
                );
                return (
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5 text-sm border border-gray-100">
                    <span className="text-gray-600">Total allocated</span>
                    <span className={`font-bold ${total === 100 ? 'text-green-600' : 'text-amber-600'}`}>
                      {total}%{total === 100 ? ' ✓' : ' — should total 100%'}
                    </span>
                  </div>
                );
              })()}
            </div>
          ) : (
            !showBenForm && (
              <Card>
                <div className="text-center py-10 text-gray-400">
                  <Heart size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-medium">No beneficiaries added yet</p>
                  <button
                    onClick={() => setShowBenForm(true)}
                    className="mt-3 text-blue-600 text-sm hover:underline"
                  >
                    Add beneficiary
                  </button>
                </div>
              </Card>
            )
          )}
        </div>
      )}

    </div>
  );
};
