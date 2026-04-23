// ─── src/components/contributions/ContributionsList.tsx ──────────────────────
// Endpoint: GET /api/v1/contributions
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { RefreshCw, AlertCircle, DollarSign, Search, TrendingUp, Users } from 'lucide-react';
import { contributionsApi } from '../../services/api';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

const getAmount = (c: any): number => c.contributedAmount ?? c.amount ?? 0;

const getDate = (c: any): string => {
  const raw = c.contributionDate ?? c.createdAt ?? c.date ?? '';
  return raw ? new Date(raw).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
};

const extractList = (res: any): any[] => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  return res.content ?? res.data ?? res.contributions ?? res.items ?? [];
};

export const ContributionsList: React.FC = () => {
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [search,        setSearch]        = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await contributionsApi.listContributions();
      setContributions(extractList(res));
    } catch (err: any) {
      setError(err.message ?? 'Failed to load contributions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = contributions.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (c.memberNumber ?? c.memberId ?? '').toLowerCase().includes(q) ||
      (c.status ?? '').toLowerCase().includes(q) ||
      String(getAmount(c)).includes(q)
    );
  });

  const totalAmount = filtered.reduce((s, c) => s + getAmount(c), 0);

  // Stats
  // const uniqueMembers = new Set(filtered.map(c => c.memberNumber ?? c.memberId ?? '')).size;
  const avgAmount     = filtered.length > 0 ? totalAmount / filtered.length : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">All Contributions</h3>
          {/* <p className="text-xs text-gray-400 font-mono mt-0.5">GET /api/v1/contributions</p> */}
        </div>
        <Button
          variant="ghost" size="sm" onClick={load} disabled={loading}
          className="flex items-center gap-1.5"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </Button>
      </div>

      {/* Summary strip */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Records',  value: String(filtered.length), icon: DollarSign, color: 'green'  },
            { label: 'Total Amount',   value: fmt(totalAmount),         icon: TrendingUp, color: 'blue'   },
            { label: 'Avg per Record', value: fmt(avgAmount),           icon: Users,      color: 'purple' },
          ].map((s, i) => {
            const Icon = s.icon;
            const cls: Record<string, string> = {
              green:  'bg-green-50  text-green-600',
              blue:   'bg-blue-50   text-blue-600',
              purple: 'bg-purple-50 text-purple-600',
            };
            return (
              <Card key={i} padding="sm">
                <div className="flex items-center gap-3 p-1">
                  <div className={`p-2 rounded-lg ${cls[s.color]}`}><Icon size={16} /></div>
                  <div>
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className="text-sm font-bold text-gray-900">{s.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by member number or status…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <div>
            <p className="text-red-700 text-sm font-medium">Failed to load contributions</p>
            <p className="text-red-600 text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <LoadingSpinner size="lg" />
          <p className="text-sm">Fetching contributions…</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <Card>
          <div className="text-center py-16">
            <DollarSign size={44} className="mx-auto mb-3 text-gray-200" />
            <p className="font-semibold text-gray-500">
              {search ? 'No results for your search' : 'No contributions recorded yet'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {search ? 'Try a different search term.' : 'Use the "Make Contribution" tab to record one.'}
            </p>
          </div>
        </Card>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <Card padding="sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {['#', 'Member Number', 'Amount', 'Date', 'Status', 'Ref / ID'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id ?? i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-xs text-gray-400">{i + 1}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                        {c.memberNumber ?? c.memberId ?? '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-bold text-green-700">{fmt(getAmount(c))}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{getDate(c)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-semibold ${
                        (c.status ?? '').toLowerCase() === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {c.status ?? 'Recorded'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-gray-400 truncate max-w-28">
                      {c.reference ?? c.id ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr className="border-t-2 border-gray-200">
                  <td colSpan={2} className="py-3 px-4 text-sm font-bold text-gray-700">
                    Total ({filtered.length} records)
                  </td>
                  <td className="py-3 px-4 text-sm font-bold text-green-700">{fmt(totalAmount)}</td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
