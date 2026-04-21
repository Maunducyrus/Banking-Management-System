import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Search, Filter, DollarSign, User, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { getStorageData, updateApplication, addApplication } from '../../utils/LocalStorage';
import { membersApi } from '../../services/api';
import toast from 'react-hot-toast';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

export const LoanDisbursement: React.FC = () => {
  const [applications,  setApplications]  = useState<any[]>([]);
  const [apiMembers,    setApiMembers]     = useState<any[]>([]);
  const [loading,       setLoading]        = useState(true);
  const [searchTerm,    setSearchTerm]     = useState('');
  const [statusFilter,  setStatusFilter]   = useState('approved');
  const [disbursing,    setDisbursing]     = useState<string | null>(null);

  const loadApplications = useCallback(() => {
    setLoading(true);
    setApplications(getStorageData().applications ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadApplications();
    // Fetch real members from API to show names in the table
    membersApi.getAllMembers()
      .then((res: any) => {
        const list = Array.isArray(res) ? res : res?.content ?? res?.data ?? [];
        setApiMembers(list);
      })
      .catch(() => setApiMembers([]));
  }, [loadApplications]);

  // Lookup member name by memberNumber / memberId
  const getMemberName = (id: string) => {
    const m = apiMembers.find((m: any) => m.memberNumber === id || m.id === id);
    return m ? `${m.firstName} ${m.lastName}` : id;
  };

  const filtered = applications.filter(a => {
    const q = searchTerm.toLowerCase();
    const name = getMemberName(a.memberNumber ?? a.memberId ?? '').toLowerCase();
    const matchSearch = !q ||
      (a.id ?? '').toLowerCase().includes(q) ||
      (a.memberNumber ?? a.memberId ?? '').toLowerCase().includes(q) ||
      name.includes(q) ||
      (a.purpose ?? '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const readyCount  = applications.filter(a => a.status === 'approved').length;
  const totalAmount = applications
    .filter(a => a.status === 'approved')
    .reduce((s, a) => s + (a.amountRequested ?? 0), 0);
  const avgAmount   = readyCount > 0 ? totalAmount / readyCount : 0;

  const handleDisburse = async (app: any) => {
    if (!window.confirm(`Disburse ${fmt(app.amountRequested)} to ${getMemberName(app.memberNumber ?? app.memberId)}?`)) return;
    setDisbursing(app.id);
    try {
      // Mark application as disbursed in localStorage
      updateApplication(app.id, { status: 'disbursed', disbursedAt: new Date().toISOString() });

      // Create a loan record in localStorage
      const data = getStorageData();
      const products = data.products ?? [];
      const product = products.find((p: any) => p.id === app.productId) ?? products[0];
      const loanRecord = {
        loanNumber: `LN-${Date.now()}`,
        memberId: app.memberNumber ?? app.memberId,
        productId: app.productId ?? '',
        principalAmount: app.amountRequested,
        interestRate: product?.interestRate ?? 0,
        term: app.term,
        startDate: new Date().toISOString().split('T')[0],
        maturityDate: new Date(Date.now() + (app.term ?? 12) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
        balancePrincipal: app.amountRequested,
        balanceInterest: 0,
        nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };

      // Persist loan — extend LocalStorage with loans key
      const raw = JSON.parse(localStorage.getItem('p2p_local_data') ?? '{}');
      raw.loans = [...(raw.loans ?? []), { ...loanRecord, id: Date.now().toString(), createdAt: new Date().toISOString(), disbursedAt: new Date().toISOString() }];
      localStorage.setItem('p2p_local_data', JSON.stringify(raw));

      loadApplications();
      toast.success(`Loan disbursed successfully! Loan # ${loanRecord.loanNumber} created.`);
    } finally {
      setDisbursing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign size={24} className="text-green-600" /> Loan Disbursement
          </h2>
          <p className="text-gray-500 text-sm mt-1">Process approved loans for disbursement</p>
        </div>
        <Button variant="ghost" size="sm" onClick={loadApplications} className="flex items-center gap-1">
          <RefreshCw size={14} /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Ready for Disbursement', value: String(readyCount), icon: CheckCircle, color: 'blue' },
          { label: 'Total Amount Ready',      value: fmt(totalAmount),   icon: DollarSign,  color: 'green' },
          { label: 'Average Loan Size',       value: fmt(avgAmount),     icon: User,        color: 'amber' },
        ].map((s, i) => {
          const Icon = s.icon;
          const cm: Record<string, string> = { blue: 'text-blue-600 bg-blue-50', green: 'text-green-600 bg-green-50', amber: 'text-amber-600 bg-amber-50' };
          return (
            <Card key={i} hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${cm[s.color]}`}><Icon size={22} /></div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search by member, ID, purpose…" value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="approved">Ready for Disbursement</option>
              <option value="disbursed">Already Disbursed</option>
              <option value="all">All Applications</option>
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
            <DollarSign size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No loans ready for disbursement</p>
            <p className="text-sm">Approve applications in the Applications tab first.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Application', 'Member', 'Amount', 'Term', 'Purpose', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-sm font-medium text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, i) => {
                  const memberName = getMemberName(app.memberNumber ?? app.memberId ?? '');
                  const isLoading  = disbursing === app.id;
                  return (
                    <tr key={app.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="text-xs font-mono text-gray-500">{(app.id ?? '—').slice(0, 10)}</p>
                        <p className="text-xs text-gray-400">
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                            <User size={13} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{memberName}</p>
                            <p className="text-xs text-gray-400 font-mono">{app.memberNumber ?? app.memberId ?? '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-bold text-green-700">{fmt(app.amountRequested ?? 0)}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{app.term}m</td>
                      <td className="py-3 px-4 text-sm text-gray-700 max-w-32 truncate">{app.purpose}</td>
                      <td className="py-3 px-4"><StatusBadge status={app.status} variant="application" /></td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {app.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3 px-4">
                        {app.status === 'approved' ? (
                          <Button size="sm" onClick={() => handleDisburse(app)} loading={isLoading}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
                            <DollarSign size={13} /> Disburse
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            {app.status === 'disbursed' ? '✓ Disbursed' : app.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Guidelines */}
      <Card>
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Disbursement Guidelines</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Only applications with status <strong>Approved</strong> can be disbursed</li>
              <li>• Disbursement creates an active loan record under Active Loans</li>
              <li>• Member names are resolved from the live API</li>
              <li>• Once disbursed, the application status changes to <strong>Disbursed</strong> and cannot be reversed</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
