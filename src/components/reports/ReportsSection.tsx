import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { BarChart3, Users, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import { membersApi, contributionsApi } from '../../services/api';
import { LoadingSpinner } from '../ui/LoadingSpinner';

function fmt(n: number) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);
}

export const ReportsSection: React.FC = () => {
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [members,  setMembers]  = useState<any[]>([]);
  const [contribs, setContribs] = useState<any[]>([]);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [mRes, cRes] = await Promise.allSettled([
        membersApi.getAllMembers(),
        contributionsApi.listContributions(),
      ]);
      // if (mRes.status === 'fulfilled') {
      //   const r = mRes.value as any;
      //   setMembers(Array.isArray(r) ? r : r?.content ?? r?.data ?? []);
      // }
      // if (cRes.status === 'fulfilled') {
      //   const r = cRes.value as any;
      //   setContribs(Array.isArray(r) ? r : r?.content ?? r?.data ?? []);
      // }

      if (mRes.status === 'fulfilled') {
        const r = mRes.value as any;

        let membersList: any[] = [];

        if (Array.isArray(r)) {
          membersList = r;
        } else if (Array.isArray(r?.content)) {
          membersList = r.content;
        } else if (Array.isArray(r?.data)) {
          membersList = r.data;
        } else {
          membersList = [];
        }

        setMembers(membersList);
      }

      if (cRes.status === 'fulfilled') {
        const r = cRes.value as any;

        let contribList: any[] = [];

        if (Array.isArray(r)) {
          contribList = r;
        } else if (Array.isArray(r?.content)) {
          contribList = r.content;
        } else if (Array.isArray(r?.data)) {
          contribList = r.data;
        } else {
          contribList = [];
        }

        setContribs(contribList);
      }

    } catch (e: any) { setError(e.message ?? 'Failed to load reports'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // Derived stats
  const totalContributed = contribs.reduce((s, c) => s + (c.contributedAmount ?? c.amount ?? 0), 0);

  // Group members by department
  const byDept = members.reduce((acc: Record<string, number>, m) => {
    const d = m.department ?? 'Other';
    acc[d] = (acc[d] ?? 0) + 1;
    return acc;
  }, {});

  // Group contributions by member
  const byMember = contribs.reduce((acc: Record<string, number>, c) => {
    const mn = c.memberNumber ?? c.memberId ?? 'Unknown';
    acc[mn] = (acc[mn] ?? 0) + (c.contributedAmount ?? c.amount ?? 0);
    return acc;
  }, {});
  const topContributors = Object.entries(byMember)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5);

  // Members by type
  const byType = members.reduce((acc: Record<string, number>, m) => {
    const t = m.memberType ?? 'MEMBER';
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});

  if (loading) return <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 size={24} className="text-blue-600" /> Reports
          </h2>
          <p className="text-gray-500 text-sm mt-1">Live data from the API</p>
        </div>
        <button onClick={load} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
          <RefreshCw size={16} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 bg-red-50 rounded-lg p-4">
          <AlertCircle size={16} /> <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Members',       value: String(members.length),  icon: Users,      color: 'blue'  },
          { label: 'Total Contributions',  value: String(contribs.length), icon: BarChart3,  color: 'green' },
          { label: 'Total Contributed',    value: fmt(totalContributed),   icon: DollarSign, color: 'amber' },
          { label: 'Avg Contribution',     value: contribs.length ? fmt(totalContributed / contribs.length) : '—', icon: DollarSign, color: 'teal' },
        ].map((s, i) => {
          const Icon = s.icon;
          const cm: Record<string, string> = { blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600', amber: 'bg-amber-100 text-amber-600', teal: 'bg-teal-100 text-teal-600' };
          return (
            <Card key={i} hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${cm[s.color]}`}><Icon size={20} /></div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members by Department */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={16} className="text-blue-600" /> Members by Department
          </h3>
          {Object.keys(byDept).length === 0
            ? <p className="text-gray-400 text-sm text-center py-6">No department data</p>
            : <div className="space-y-3">
                {Object.entries(byDept).sort(([,a],[,b]) => (b as number) - (a as number)).map(([dept, count]) => {
                  const pct = Math.round(((count as number) / members.length) * 100);
                  return (
                    <div key={dept}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{dept}</span>
                        <span className="text-gray-500">{count as number} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
          }
        </Card>

        {/* Top Contributors */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign size={16} className="text-green-600" /> Top Contributors
          </h3>
          {topContributors.length === 0
            ? <p className="text-gray-400 text-sm text-center py-6">No contribution data</p>
            : <div className="space-y-3">
                {topContributors.map(([mn, amount], i) => (
                  <div key={mn} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="text-sm font-mono text-gray-700">{mn}</span>
                    </div>
                    <span className="text-sm font-semibold text-green-700">{fmt(amount as number)}</span>
                  </div>
                ))}
              </div>
          }
        </Card>

        {/* Member Types */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">Members by Type</h3>
          {Object.keys(byType).length === 0
            ? <p className="text-gray-400 text-sm text-center py-6">No data</p>
            : <div className="space-y-3">
                {Object.entries(byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm font-medium text-gray-700">{type}</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">{count as number} member{(count as number) !== 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
          }
        </Card>

        {/* Recent Contributions table */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">Recent Contributions</h3>
          {contribs.length === 0
            ? <p className="text-gray-400 text-sm text-center py-6">No contributions yet</p>
            : <div className="space-y-2">
                {contribs.slice(0, 6).map((c, i) => (
                  <div key={c.id ?? i} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                    <span className="font-mono text-gray-600">{c.memberNumber ?? c.memberId ?? '—'}</span>
                    <span className="font-semibold text-green-700">{fmt(c.contributedAmount ?? c.amount ?? 0)}</span>
                  </div>
                ))}
              </div>
          }
        </Card>
      </div>
    </div>
  );
};
