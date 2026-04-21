import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Users, CreditCard, DollarSign, TrendingUp } from 'lucide-react';
import { membersApi, contributionsApi } from '../../services/api';

function fmt(n: number) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);
}

export const DashboardStats: React.FC = () => {
  const [memberCount,       setMemberCount]       = useState<string>('…');
  const [contributionTotal, setContributionTotal] = useState<string>('…');
  const [contributionCount, setContributionCount] = useState<string>('…');
  const [loading,           setLoading]           = useState(true);

  useEffect(() => {
  Promise.allSettled([
    membersApi.getAllMembers({ page: 0, size: 1 }),
    contributionsApi.listContributions(),
  ]).then(([membersRes, contribRes]) => {

    // ── Members count ──
    if (membersRes.status === 'fulfilled') {
      const r = membersRes.value as any;

      const total = r?.data?.totalElements;

      setMemberCount(
        typeof total === 'number' ? String(total) : '—'
      );
    } else {
      setMemberCount('—');
    }

    // ── Contributions ──
    if (contribRes.status === 'fulfilled') {
      const r = contribRes.value as any;
      const list: any[] = Array.isArray(r) ? r : r?.content ?? r?.data ?? [];

      setContributionCount(String(list.length));

      const sum = list.reduce(
        (acc: number, c: any) =>
          acc + (c.contributedAmount ?? c.amount ?? 0),
        0
      );

      setContributionTotal(sum > 0 ? fmt(sum) : 'Ksh 0');
    } else {
      setContributionCount('—');
      setContributionTotal('—');
    }

    setLoading(false);
  });
}, []);

  const stats = [
    { title: 'Total Members',       value: loading ? '…' : memberCount,       sub: '', icon: Users,       color: 'blue',  live: true  },
    { title: 'Total Contributions',  value: loading ? '…' : contributionCount,  sub: '', icon: CreditCard,  color: 'green', live: true  },
    { title: 'Contributions Value',  value: loading ? '…' : contributionTotal,  sub: '', icon: DollarSign,  color: 'amber', live: true  },
    { title: 'Loan Processing',      value: '—',                                sub: 'Coming soon',   icon: TrendingUp,  color: 'teal',  live: false },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600', teal: 'bg-teal-100 text-teal-600',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <Card key={i} hover className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{s.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
                <p className={`text-xs mt-1 ${s.live ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{s.sub}</p>
              </div>
              <div className={`p-3 rounded-lg ${colorMap[s.color]}`}><Icon size={24} /></div>
            </div>
            {s.live && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> live
                </span>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
