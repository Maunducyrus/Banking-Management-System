import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Clock, RefreshCw, DollarSign, Users, AlertCircle } from 'lucide-react';
import { contributionsApi, membersApi } from '../../services/api';

interface ActivityItem {
  id: string;
  type: 'contribution' | 'member';
  description: string;
  amount?: string;
  timestamp: string;
  raw: any;
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [contribRes, membersRes] = await Promise.allSettled([
        contributionsApi.listContributions(),
        // membersApi.getAllMembers({ size: 10, sort: 'createdAt,desc' }),
        membersApi.getAllMembers()
      ]);

      const items: ActivityItem[] = [];

      // Contributions
      if (contribRes.status === 'fulfilled') {
        const list: any[] = Array.isArray(contribRes.value)
          ? contribRes.value
          : (contribRes.value as any)?.content ?? (contribRes.value as any)?.data ?? [];
        list.slice(0, 8).forEach((c: any) => {
          items.push({
            id: `c-${c.id ?? c.contributionId ?? Math.random()}`,
            type: 'contribution',
            description: `Contribution from ${c.memberNumber ?? c.memberId ?? 'member'}`,
            amount: fmt(c.contributedAmount ?? c.amount ?? 0),
            timestamp: timeAgo(c.contributionDate ?? c.createdAt ?? c.date ?? ''),
            raw: c,
          });
        });
      }

      // Recent members
      let list: any[] = [];

      if (membersRes.status === 'fulfilled') {
        const r = membersRes.value as any;

        if (Array.isArray(r)) {
          list = r;
        } else if (Array.isArray(r?.content)) {
          list = r.content;
        } else if (Array.isArray(r?.data)) {
          list = r.data;
        } else {
          list = []; // fallback
        }
      }
      list.slice(0, 5).forEach((m: any) => {
      items.push({
        id: `m-${m.memberNumber ?? m.id ?? Math.random()}`,
        type: 'member',
        description: `New member: ${m.firstName ?? ''} ${m.lastName ?? ''}`.trim(),
        timestamp: timeAgo(m.welfareJoinDate ?? m.createdAt ?? ''),
        raw: m,
      });
    });

      // if (membersRes.status === 'fulfilled') {
      //   const list: any[] = Array.isArray(membersRes.value)
      //     ? membersRes.value
      //     : (membersRes.value as any)?.content ?? (membersRes.value as any)?.data ?? [];
      //   list.slice(0, 5).forEach((m: any) => {
      //     items.push({
      //       id: `m-${m.memberNumber ?? m.id ?? Math.random()}`,
      //       type: 'member',
      //       description: `New member: ${m.firstName ?? ''} ${m.lastName ?? ''}`.trim(),
      //       timestamp: timeAgo(m.welfareJoinDate ?? m.createdAt ?? ''),
      //       raw: m,
      //     });
      //   });
      // }

      // Sort by most recent (contributions first if no timestamps)
      setActivities(items.slice(0, 10));
    } catch (e: any) {
      setError(e.message ?? 'Failed to load activity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <button onClick={load} disabled={loading}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition disabled:opacity-40">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-2 text-red-500 bg-red-50 rounded-lg p-3">
          <AlertCircle size={16} /> <span className="text-sm">{error}</span>
        </div>
      )}

      {!loading && !error && activities.length === 0 && (
        <p className="text-center text-gray-400 py-8 text-sm">No activity yet.</p>
      )}

      {!loading && !error && activities.length > 0 && (
        <div className="space-y-3">
          {activities.map(a => (
            <div key={a.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full mt-0.5 ${a.type === 'contribution' ? 'bg-green-100' : 'bg-blue-100'}`}>
                  {a.type === 'contribution'
                    ? <DollarSign size={13} className="text-green-600" />
                    : <Users size={13} className="text-blue-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{a.description}</p>
                  {a.amount && <p className="text-sm font-semibold text-green-600 mt-0.5">{a.amount}</p>}
                  <p className="text-xs text-gray-400 mt-0.5">{a.timestamp}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                a.type === 'contribution' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {a.type === 'contribution' ? 'Contribution' : 'New Member'}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
