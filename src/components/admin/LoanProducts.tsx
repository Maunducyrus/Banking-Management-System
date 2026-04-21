import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Search, Filter, Plus, Trash2, DollarSign, Edit2, X, RefreshCw } from 'lucide-react';
import { getStorageData, addProduct, updateProduct, deleteProduct } from '../../utils/LocalStorage';
import toast from 'react-hot-toast';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

const EMPTY: any = {
  code: '', name: '', description: '', interestType: 'reducing',
  interestRate: '', minAmount: '', maxAmount: '',
  minTerm: '', maxTerm: '', repaymentFrequency: 'monthly', gracePeriodDays: '0',
};

export const LoanProducts: React.FC = () => {
  const [products,     setProducts]     = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm,     setShowForm]     = useState(false);
  const [editId,       setEditId]       = useState<string | null>(null);
  const [form,         setForm]         = useState<any>({ ...EMPTY });

  const load = useCallback(() => {
    setLoading(true);
    setProducts(getStorageData().products ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = products.filter(p => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q);
    return matchSearch && (statusFilter === 'all' || p.status === statusFilter);
  });

  const openAdd = () => { setEditId(null); setForm({ ...EMPTY }); setShowForm(true); };
  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({ ...p, interestRate: String(p.interestRate), minAmount: String(p.minAmount), maxAmount: String(p.maxAmount), minTerm: String(p.minTerm), maxTerm: String(p.maxTerm), gracePeriodDays: String(p.gracePeriodDays ?? 0) });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.code || !form.name || !form.description) { toast.error('Code, name and description are required'); return; }
    if (Number(form.minAmount) >= Number(form.maxAmount)) { toast.error('Max amount must exceed min amount'); return; }
    if (Number(form.minTerm) >= Number(form.maxTerm)) { toast.error('Max term must exceed min term'); return; }
    const payload = {
      ...form,
      interestRate: parseFloat(form.interestRate) || 0,
      minAmount: parseInt(form.minAmount) || 0,
      maxAmount: parseInt(form.maxAmount) || 0,
      minTerm: parseInt(form.minTerm) || 0,
      maxTerm: parseInt(form.maxTerm) || 0,
      gracePeriodDays: parseInt(form.gracePeriodDays) || 0,
      status: form.status ?? 'active',
      createdBy: 'admin',
    };
    if (editId) { updateProduct(editId, payload); toast.success('Product updated!'); }
    else { addProduct(payload); toast.success('Product created!'); }
    load(); setShowForm(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteProduct(id); load(); toast.success('Product deleted');
    }
  };

  const handleStatusToggle = (id: string, current: string) => {
    const next = current === 'active' ? 'inactive' : 'active';
    updateProduct(id, { status: next }); load();
    toast.success(`Product ${next}`);
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p: any) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="space-y-6">
      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <DollarSign size={18} className="text-blue-600" />
                {editId ? 'Edit Loan Product' : 'New Loan Product'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['Product Code *', 'code', 'text', 'e.g. M-LOAN'],
                ['Product Name *', 'name', 'text', 'e.g. Monthly Loan'],
                ['Interest Rate (%) *', 'interestRate', 'number', '12.5'],
                ['Grace Period (days)', 'gracePeriodDays', 'number', '5'],
                ['Min Amount (Ksh) *', 'minAmount', 'number', '5000'],
                ['Max Amount (Ksh) *', 'maxAmount', 'number', '100000'],
                ['Min Term (months) *', 'minTerm', 'number', '3'],
                ['Max Term (months) *', 'maxTerm', 'number', '12'],
              ].map(([label, key, type, placeholder]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} value={form[key] ?? ''} onChange={f(key)} placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Interest Type *</label>
                <select value={form.interestType} onChange={f('interestType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="flat">Flat Rate</option>
                  <option value="reducing">Reducing Balance</option>
                  <option value="declining_balance">Declining Balance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Repayment Frequency *</label>
                <select value={form.repaymentFrequency} onChange={f('repaymentFrequency')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="col-span-full">
                <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
                <textarea value={form.description} onChange={f('description')} rows={3}
                  placeholder="Describe this loan product…"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editId ? 'Save Changes' : 'Create Product'}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign size={24} className="text-blue-600" /> Loan Products
          </h2>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={load} className="flex items-center gap-1"><RefreshCw size={14} /></Button>
          <Button onClick={openAdd} className="flex items-center gap-2"><Plus size={16} /> Add Product</Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search products…" value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
            <p className="font-medium">No loan products yet</p>
            <button onClick={openAdd} className="mt-2 text-blue-600 text-sm hover:underline">Create your first product</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Product', 'Interest', 'Amount Range', 'Term Range', 'Frequency', 'Status', ''].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-sm font-medium text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{p.code}</p>
                      <p className="text-xs text-gray-400 mt-0.5 max-w-40 truncate">{p.description}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-semibold text-gray-900">{p.interestRate}%</p>
                      <p className="text-xs text-gray-500 capitalize">{(p.interestType ?? '').replace('_', ' ')}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {fmt(p.minAmount)} – {fmt(p.maxAmount)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {p.minTerm} – {p.maxTerm} months
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 capitalize">{p.repaymentFrequency}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleStatusToggle(p.id, p.status)}
                        className={`text-xs px-2 py-1 rounded-full font-semibold transition ${
                          p.status === 'active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                        {p.status}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600" title="Edit">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
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
