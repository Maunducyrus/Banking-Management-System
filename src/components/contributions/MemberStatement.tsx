
// src/components/contributions/MemberStatement.tsx
// Endpoint: GET /tujipange/api/v1/contributionsStatement/:memberNumber
//
// NOTE: The API returns ALL contributions across all members (not filtered).

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import {
  TrendingUp, AlertCircle, DollarSign,
  Search, Download, User, ChevronDown,
} from 'lucide-react';
import { contributionsApi, membersApi } from '../../services/api';
import toast from 'react-hot-toast';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-KE', {
    style: 'currency', currency: 'KES', maximumFractionDigits: 0,
  }).format(n);

// Confirmed from console log: field is "contributionAmount"
const getAmount = (c: any): number =>
  Number(c.contributionAmount ?? c.contributedAmount ?? c.amount ?? 0);

const getDate = (c: any): string => {
  const raw = c.contributionDate ?? c.createdAt ?? c.date ?? '';
  return raw
    ? new Date(raw).toLocaleDateString('en-KE', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '—';
};

// ── Response unwrappers ───────────────────────────────────────────────────────
// Confirmed shape: { success, data: { content: [...] } }  for members
// Statement returns a bare array directly

const extractMemberList = (res: any): any[] => {
  if (!res) return [];
  if (Array.isArray(res?.data?.content)) return res.data.content;
  if (Array.isArray(res?.data))          return res.data;
  if (Array.isArray(res?.content))       return res.content;
  if (Array.isArray(res))                return res;
  return [];
};

const extractMember = (res: any): any | null => {
  if (!res) return null;
  if (Array.isArray(res?.data?.content)) return res.data.content[0] ?? null;
  if (res?.data && !Array.isArray(res.data) && !res.data.content) return res.data;
  if (Array.isArray(res?.data))          return res.data[0] ?? null;
  if (Array.isArray(res?.content))       return res.content[0] ?? null;
  if (Array.isArray(res))                return res[0] ?? null;
  return res ?? null;
};

// Extracts the contributions list from any envelope shape
const extractContribList = (res: any): any[] => {
  if (!res) return [];
  if (Array.isArray(res))                      return res;         // ← bare array (confirmed)
  if (Array.isArray(res?.data?.content))       return res.data.content;
  if (Array.isArray(res?.data))                return res.data;
  if (Array.isArray(res?.content))             return res.content;
  if (Array.isArray(res?.contributions))       return res.contributions;
  if (Array.isArray(res?.statement))           return res.statement;
  if (Array.isArray(res?.items))               return res.items;
  if (Array.isArray(res?.records))             return res.records;
  if (typeof res === 'object')                 return [res];
  return [];
};

// ─────────────────────────────────────────────────────────────────────────────

export const MemberStatement: React.FC = () => {
  const [members,        setMembers]        = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [membersFetched, setMembersFetched] = useState(false);
  const [memberNumber,   setMemberNumber]   = useState('');
  const [memberInfo,     setMemberInfo]     = useState<any>(null);
  const [statement,      setStatement]      = useState<any[]>([]);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState('');
  const [hasFetched,     setHasFetched]     = useState(false);

  // ── Lazy-load member dropdown ─────────────────────────────────────────────
  const loadMembers = () => {
    if (membersFetched || loadingMembers) return;
    setLoadingMembers(true);
    membersApi.getAllMembers()
      .then((res: any) => {
        setMembers(extractMemberList(res));
        setMembersFetched(true);
      })
      .catch(() => setMembersFetched(true))
      .finally(() => setLoadingMembers(false));
  };

  // ── Fetch statement ───────────────────────────────────────────────────────
  const fetchStatement = async (e: React.FormEvent) => {
    e.preventDefault();
    const mn = memberNumber.trim();
    if (!mn) { toast.error('Please enter or select a member number'); return; }

    setLoading(true);
    setError('');
    setStatement([]);
    setMemberInfo(null);
    setHasFetched(true);

    try {
      const [stmtResult, memberResult] = await Promise.allSettled([
        contributionsApi.getMemberContributions(mn),
        membersApi.getMemberByNumber(mn),
      ]);

      // ── Process contributions ─────────────────────────────────────────────
      if (stmtResult.status === 'fulfilled') {
        //debugging
        console.log('RAW STATEMENT RESPONSE:', stmtResult.value);

        const allRecords = extractContribList(stmtResult.value);

        // The API returns ALL members' contributions — filter to this member only
        const filtered = allRecords.filter(
          (c: any) =>
            (c.memberNumber ?? c.memberId ?? '').toLowerCase() === mn.toLowerCase()
        );

        console.log(`[Statement] total records: ${allRecords.length}, filtered for ${mn}: ${filtered.length}`);
        setStatement(filtered);
      } else {
        throw new Error(
          (stmtResult.reason as Error)?.message ?? 'Statement fetch failed'
        );
      }

      // ── Process member info ───────────────────────────────────────────────
      // getMemberByNumber also returns all members — find the right one
      if (memberResult.status === 'fulfilled') {
        const allMembers = extractMemberList(memberResult.value);
        // Try to find exact match first, then fall back to extractMember
        const match =
          allMembers.find(
            (m: any) => (m.memberNumber ?? '').toLowerCase() === mn.toLowerCase()
          ) ?? extractMember(memberResult.value);
        setMemberInfo(match ?? null);
      }
    } catch (err: any) {
      console.error('[Statement] error:', err);
      setError(err.message ?? 'Failed to fetch statement');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = statement.reduce((s, c) => s + getAmount(c), 0);
  const avgAmount   = statement.length > 0 ? totalAmount / statement.length : 0;

  const exportCSV = () => {
    const rows = [
      ['#', 'Member Number', 'Contribution Code', 'Amount (KES)', 'Pending Balance', 'Date', 'Status'].join(','),
      ...statement.map((c, i) =>
        [
          i + 1,
          c.memberNumber ?? memberNumber,
          c.contributionCode ?? '—',
          getAmount(c),
          c.pendingBalance ?? '—',
          getDate(c),
          c.status ?? 'Recorded',
        ].join(',')
      ),
    ].join('\n');
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([rows], { type: 'text/csv' })),
      download: `statement-${memberNumber}.csv`,
    });
    a.click();
    toast.success('CSV exported!');
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp size={20} className="text-purple-600" /> Member Statement
        </h3>
        {/* <p className="text-xs text-gray-400 font-mono mt-0.5">
          GET /tujipange/api/v1/contributionsStatement/:memberNumber
        </p> */}
      </div>

      {/* ── Search form ── */}
      <Card>
        <form onSubmit={fetchStatement} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Member Number <span className="text-red-500">*</span>
            </label>

            {/* Dropdown — lazy loaded from API */}
            <div className="relative mb-2">
              <select
                onFocus={loadMembers}
                value={memberNumber}
                onChange={e => {
                  setMemberNumber(e.target.value);
                  setError('');
                  setHasFetched(false);
                }}
                className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="">
                  {loadingMembers
                    ? 'Loading members…'
                    : membersFetched && members.length === 0
                      ? 'No members found — type below'
                      : '— Select a member (click to load) —'}
                </option>
                {members.map((m: any) => {
                  const mn   = m.memberNumber ?? m.id ?? '';
                  const name = `${m.firstName ?? ''} ${m.lastName ?? ''}`.trim();
                  return (
                    <option key={mn} value={mn}>{name} — {mn}</option>
                  );
                })}
              </select>
              <ChevronDown
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {/* Manual text input */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={15}
              />
              <input
                type="text"
                value={memberNumber}
                onChange={e => {
                  setMemberNumber(e.target.value);
                  setError('');
                  setHasFetched(false);
                }}
                placeholder="Or type e.g. WM-30023456-1"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono placeholder:font-sans"
              />
            </div>
          </div>

          <Button
            type="submit" loading={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
          >
            <TrendingUp size={16} />
            {loading ? 'Fetching Statement…' : 'Fetch Statement'}
          </Button>
        </form>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
          <LoadingSpinner size="lg" />
          <p className="text-sm">
            Fetching statement for <span className="font-mono font-medium">{memberNumber}</span>…
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 font-semibold text-sm">Failed to fetch statement</p>
            <p className="text-red-600 text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Member banner */}
      {!loading && !error && memberInfo && statement.length > 0 && (
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <User size={22} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-lg leading-tight">
                  {memberInfo.firstName} {memberInfo.lastName}
                </p>
                <p className="text-purple-200 text-sm font-mono">
                  {memberInfo.memberNumber ?? memberNumber}
                </p>
                {memberInfo.department && (
                  <p className="text-purple-300 text-xs mt-0.5">
                    {memberInfo.department} · {memberInfo.memberType}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-purple-200 text-xs">Total Contributed</p>
              <p className="text-2xl font-bold">{fmt(totalAmount)}</p>
              <p className="text-purple-300 text-xs">
                {statement.length} contribution{statement.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats strip */}
      {!loading && !error && statement.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Contributed', value: fmt(totalAmount),         color: 'green'  },
            { label: 'Average Amount',    value: fmt(avgAmount),           color: 'blue'   },
            { label: 'Total Records',     value: String(statement.length), color: 'purple' },
          ].map((s, i) => (
            <Card key={i} padding="sm">
              <div className="p-1 text-center">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`text-sm font-bold mt-0.5 ${
                  s.color === 'green'  ? 'text-green-700'  :
                  s.color === 'blue'   ? 'text-blue-700'   : 'text-purple-700'
                }`}>{s.value}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && hasFetched && statement.length === 0 && (
        <Card>
          <div className="text-center py-14">
            <DollarSign size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="font-semibold text-gray-500">No contributions found</p>
            <p className="text-sm text-gray-400 mt-1">
              Member{' '}
              <span className="font-mono text-gray-600">{memberNumber}</span>{' '}
              has no recorded contributions.
            </p>
          </div>
        </Card>
      )}

      {/* Statement table */}
      {!loading && !error && statement.length > 0 && (
        <Card padding="sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h4 className="font-semibold text-gray-800 text-sm">
              Statement —{' '}
              <span className="font-mono text-purple-700">{memberNumber}</span>
            </h4>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              <Download size={13} /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['#', 'Code', 'Amount', 'Pending Balance', 'Date', 'Status'].map(h => (
                    <th
                      key={h}
                      className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {statement.map((c, i) => {
                  const amount  = getAmount(c);
                  // const pending = c.pendingBalance ?? null;
                  const rawPending = Number(c.pendingBalance ?? 0);

                  const pending = rawPending > 0 ? rawPending : 0;
                  const overpaid = rawPending < 0 ? Math.abs(rawPending) : 0;

                  return (
                    <tr
                      key={c.contributionCode ?? c.id ?? i}
                      className="border-b border-gray-100 hover:bg-purple-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-xs text-gray-400">{i + 1}</td>

                      {/* Contribution code */}
                      <td className="py-3 px-4">
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {c.contributionCode ?? '—'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4">
                        <span className="text-sm font-bold text-green-700">
                          {fmt(amount)}
                        </span>
                      </td>

                      {/* Pending balance */}
                      {/* <td className="py-3 px-4">
                        {pending !== null ? (
                          <span className={`text-sm font-semibold ${
                            pending < 0 ? 'text-red-600' : 'text-gray-700'
                          }`}>
                            {fmt(pending)}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td> */}
                      <td className="py-3 px-4">
                        <span className="text-sm font-semibold">
                          {rawPending < 0 ? (
                            <span className="text-blue-600">
                              Overpaid {fmt(overpaid)}
                            </span>
                          ) : (
                            <span className="text-gray-700">
                              {fmt(pending)}
                            </span>
                          )}
                        </span>
                      </td>                      

                      {/* Date */}
                      <td className="py-3 px-4 text-sm text-gray-600">{getDate(c)}</td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          (c.status ?? '').toLowerCase() === 'failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {c.status ?? 'Recorded'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr className="border-t-2 border-gray-200">
                  <td colSpan={2} className="py-3 px-4 text-sm font-bold text-gray-700">
                    Total ({statement.length} record{statement.length !== 1 ? 's' : ''})
                  </td>
                  <td className="py-3 px-4 text-sm font-bold text-green-700">
                    {fmt(totalAmount)}
                  </td>
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
