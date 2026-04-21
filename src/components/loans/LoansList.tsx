import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Search, Filter, Eye, CreditCard, RefreshCw, AlertCircle, X } from 'lucide-react';
import { getStorageData } from '../../utils/LocalStorage';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

interface LoanDetailModal { loan: any; onClose: () => void; }

const LoanDetail: React.FC<LoanDetailModal> = ({ loan, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Loan Details — {loan.loanNumber}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
      </div>
      <div className="p-6 grid grid-cols-2 gap-4">
        {[
          ['Loan Number',    loan.loanNumber],
          ['Member',         loan.memberId],
          ['Principal',      fmt(loan.principalAmount ?? 0)],
          ['Interest Rate',  `${loan.interestRate ?? 0}%`],
          ['Term',           `${loan.term ?? 0} months`],
          ['Start Date',     loan.startDate ? new Date(loan.startDate).toLocaleDateString() : '—'],
          ['Maturity Date',  loan.maturityDate ? new Date(loan.maturityDate).toLocaleDateString() : '—'],
          ['Balance (P)',    fmt(loan.balancePrincipal ?? 0)],
          ['Balance (I)',    fmt(loan.balanceInterest ?? 0)],
          ['Next Due',       loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString() : 'N/A'],
          ['Status',         loan.status],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
          </div>
        ))}
      </div>
      <div className="p-6 border-t border-gray-200 flex justify-end">
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </div>
  </div>
);

export const LoansList: React.FC = () => {
  const [loans,        setLoans]        = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewLoan,     setViewLoan]     = useState<any>(null);

  const load = useCallback(() => {
    setLoading(true);
    // Loans live in localStorage until a backend endpoint exists
    const data = getStorageData();
    setLoans((data as any).loans ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = loans.filter(l => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q ||
      (l.loanNumber ?? '').toLowerCase().includes(q) ||
      (l.memberId ?? '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalOutstanding = filtered.reduce((s, l) => s + (l.balancePrincipal ?? 0) + (l.balanceInterest ?? 0), 0);

  return (
    <div className="space-y-6">
      {viewLoan && <LoanDetail loan={viewLoan} onClose={() => setViewLoan(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard size={24} className="text-blue-600" /> Active Loans
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {filtered.length} loan{filtered.length !== 1 ? 's' : ''} · Outstanding: {fmt(totalOutstanding)}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={load} className="flex items-center gap-1">
          <RefreshCw size={14} /> Refresh
        </Button>
      </div>

      {/* Note banner — no API yet */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
        <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-amber-700 text-sm">
          Loan processing endpoints are not yet available.
          Loans created via the Disbursement page are stored locally.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search by loan number or member…"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="defaulted">Defaulted</option>
              <option value="written_off">Written Off</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="sm">
        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <CreditCard size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No loans found</p>
            <p className="text-sm">Loans appear here after disbursement.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Loan', 'Member', 'Principal', 'Balance', 'Rate', 'Status', 'Next Due', ''].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-sm font-medium text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((loan, i) => (
                  <tr key={loan.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900 text-sm">{loan.loanNumber}</p>
                      <p className="text-xs text-gray-500">{loan.term} months</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{loan.memberId ?? '—'}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{fmt(loan.principalAmount ?? 0)}</td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-900">P: {fmt(loan.balancePrincipal ?? 0)}</p>
                      <p className="text-xs text-gray-500">I: {fmt(loan.balanceInterest ?? 0)}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{loan.interestRate ?? 0}%</td>
                    <td className="py-3 px-4"><StatusBadge status={loan.status} variant="loan" /></td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => setViewLoan(loan)}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
