import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { User, CreditCard, FileText, DollarSign, TrendingUp, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { membersApi, contributionsApi } from '../../services/api';

interface Props { onNavigate: (view: string) => void; }

function fmt(n: number) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);
}

export const MemberDashboard: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [memberData,     setMemberData]     = useState<any>(null);
  const [contributions,  setContributions]  = useState<any[]>([]);
  const [loadingMember,  setLoadingMember]  = useState(true);
  const [loadingContrib, setLoadingContrib] = useState(true);

  // Try to find the logged-in user's member record
  useEffect(() => {
    const load = async () => {
      setLoadingMember(true);
      try {
        // Search by email first
        const res = await membersApi.getAllMembers({ search: user?.email }) as any;
        const list: any[] = Array.isArray(res) ? res : res?.content ?? res?.data ?? [];
        const match = list.find((m: any) => m.email === user?.email) ?? list[0] ?? null;
        setMemberData(match);
      } catch (_) { setMemberData(null); }
      finally { setLoadingMember(false); }
    };
    if (user?.email) load();
    else setLoadingMember(false);
  }, [user?.email]);

  // Load contributions for this member
  useEffect(() => {
    if (!memberData?.memberNumber) { setLoadingContrib(false); return; }
    contributionsApi.getMemberContributions(memberData.memberNumber)
      .then((res: any) => {
        const list = Array.isArray(res) ? res : res?.content ?? res?.data ?? res?.contributions ?? [];
        setContributions(list);
      })
      .catch(() => setContributions([]))
      .finally(() => setLoadingContrib(false));
  }, [memberData?.memberNumber]);

  const totalContributed = contributions.reduce((s, c) => s + (c.contributedAmount ?? c.amount ?? 0), 0);
  const recentContribs   = contributions.slice(0, 3);

  if (loadingMember) {
    return <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-1">
          Welcome back, {memberData?.firstName ?? user?.firstName ?? user?.email ?? 'Member'}!
        </h1>
        <p className="text-blue-100 text-sm">
          {memberData
            ? `Member No: ${memberData.memberNumber ?? '—'} · ${memberData.department ?? memberData.memberType ?? ''}`
            : 'Your member profile is being set up'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'My Contributions',   value: loadingContrib ? '…' : String(contributions.length), icon: TrendingUp, color: 'blue' },
          { label: 'Total Contributed',  value: loadingContrib ? '…' : fmt(totalContributed),         icon: DollarSign, color: 'green' },
          { label: 'Active Loans',        value: '—',                                                   icon: CreditCard, color: 'amber' },
          { label: 'Member Status',       value: memberData?.status ?? '—',                             icon: User,       color: 'teal' },
        ].map((s, i) => {
          const Icon = s.icon;
          const colorMap: Record<string, string> = { blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600', amber: 'bg-amber-100 text-amber-600', teal: 'bg-teal-100 text-teal-600' };
          return (
            <Card key={i} hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorMap[s.color]}`}><Icon size={20} /></div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-base font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ['apply-loan', 'Apply for Loan',    Plus,     'bg-blue-600 hover:bg-blue-700 text-white'],
            ['payments',   'Make Contribution',  DollarSign, 'bg-green-600 hover:bg-green-700 text-white'],
            ['kyc',        'Upload Documents',   FileText,  'bg-gray-100 hover:bg-gray-200 text-gray-800'],
            ['profile',    'My Profile',         User,      'bg-gray-100 hover:bg-gray-200 text-gray-800'],
          ].map(([view, label, Icon, cls]) => (
            <button key={view as string}
              onClick={() => onNavigate(view as string)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl text-sm font-medium transition ${cls}`}>
              {React.createElement(Icon as any, { size: 20 })}
              {typeof label === "string" ? label : React.createElement(label)}
              {/* {label} */}
            </button>
          ))}
        </div>
      </Card>

      {/* Member Details + Recent Contributions side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Info */}
        <Card>
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center justify-between">
            Profile Summary
            <button onClick={() => onNavigate('profile')} className="text-xs text-blue-600 hover:underline">Edit</button>
          </h2>
          {memberData ? (
            <div className="space-y-3">
              {[
                ['Member #',   memberData.memberNumber],
                ['Name',       `${memberData.firstName ?? ''} ${memberData.lastName ?? ''}`.trim()],
                ['Email',      memberData.email],
                ['Phone',      memberData.phone],
                ['Department', memberData.department],
                ['Join Date',  memberData.welfareJoinDate ? new Date(memberData.welfareJoinDate).toLocaleDateString() : null],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label as string} className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 w-24 shrink-0">{label}</span>
                  <span className="text-gray-900 font-medium">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <User size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No member profile found for your account.</p>
              <p className="text-xs mt-1">Contact an admin to link your account to a member record.</p>
            </div>
          )}
        </Card>

        {/* Recent Contributions */}
        <Card>
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center justify-between">
            Recent Contributions
            <button onClick={() => onNavigate('payments')} className="text-xs text-blue-600 hover:underline">View all</button>
          </h2>
          {loadingContrib ? (
            <div className="flex justify-center py-6"><LoadingSpinner /></div>
          ) : recentContribs.length > 0 ? (
            <div className="space-y-3">
              {recentContribs.map((c, i) => (
                <div key={c.id ?? i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <DollarSign size={14} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{fmt(c.contributedAmount ?? c.amount ?? 0)}</p>
                      <p className="text-xs text-gray-500">
                        {c.contributionDate ?? c.createdAt
                          ? new Date(c.contributionDate ?? c.createdAt).toLocaleDateString()
                          : 'Date unknown'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
                    {c.status ?? 'Recorded'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <DollarSign size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No contributions yet.</p>
              <button onClick={() => onNavigate('payments')}
                className="mt-2 text-blue-600 text-xs hover:underline">Make your first contribution</button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
