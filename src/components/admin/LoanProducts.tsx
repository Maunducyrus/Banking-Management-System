// import React, { useState, useEffect, useCallback } from 'react';
// import { Card } from '../ui/Card';
// import { Button } from '../ui/Button';
// import { LoadingSpinner } from '../ui/LoadingSpinner';
// import { Search, Filter, Plus, Trash2, DollarSign, Edit2, X, RefreshCw } from 'lucide-react';
// import { getStorageData, addProduct, updateProduct, deleteProduct } from '../../utils/LocalStorage';
// import toast from 'react-hot-toast';

// const fmt = (n: number) =>
//   new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

// const EMPTY: any = {
//   code: '', name: '', description: '', interestType: 'reducing',
//   interestRate: '', minAmount: '', maxAmount: '',
//   minTerm: '', maxTerm: '', repaymentFrequency: 'monthly', gracePeriodDays: '0',
// };

// export const LoanProducts: React.FC = () => {
//   const [products,     setProducts]     = useState<any[]>([]);
//   const [loading,      setLoading]      = useState(true);
//   const [searchTerm,   setSearchTerm]   = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [showForm,     setShowForm]     = useState(false);
//   const [editId,       setEditId]       = useState<string | null>(null);
//   const [form,         setForm]         = useState<any>({ ...EMPTY });

//   const load = useCallback(() => {
//     setLoading(true);
//     setProducts(getStorageData().products ?? []);
//     setLoading(false);
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   const filtered = products.filter(p => {
//     const q = searchTerm.toLowerCase();
//     const matchSearch = !q ||
//       p.name.toLowerCase().includes(q) ||
//       p.code.toLowerCase().includes(q) ||
//       (p.description ?? '').toLowerCase().includes(q);
//     return matchSearch && (statusFilter === 'all' || p.status === statusFilter);
//   });

//   const openAdd = () => { setEditId(null); setForm({ ...EMPTY }); setShowForm(true); };
//   const openEdit = (p: any) => {
//     setEditId(p.id);
//     setForm({ ...p, interestRate: String(p.interestRate), minAmount: String(p.minAmount), maxAmount: String(p.maxAmount), minTerm: String(p.minTerm), maxTerm: String(p.maxTerm), gracePeriodDays: String(p.gracePeriodDays ?? 0) });
//     setShowForm(true);
//   };

//   const handleSave = () => {
//     if (!form.code || !form.name || !form.description) { toast.error('Code, name and description are required'); return; }
//     if (Number(form.minAmount) >= Number(form.maxAmount)) { toast.error('Max amount must exceed min amount'); return; }
//     if (Number(form.minTerm) >= Number(form.maxTerm)) { toast.error('Max term must exceed min term'); return; }
//     const payload = {
//       ...form,
//       interestRate: parseFloat(form.interestRate) || 0,
//       minAmount: parseInt(form.minAmount) || 0,
//       maxAmount: parseInt(form.maxAmount) || 0,
//       minTerm: parseInt(form.minTerm) || 0,
//       maxTerm: parseInt(form.maxTerm) || 0,
//       gracePeriodDays: parseInt(form.gracePeriodDays) || 0,
//       status: form.status ?? 'active',
//       createdBy: 'admin',
//     };
//     if (editId) { updateProduct(editId, payload); toast.success('Product updated!'); }
//     else { addProduct(payload); toast.success('Product created!'); }
//     load(); setShowForm(false);
//   };

//   const handleDelete = (id: string, name: string) => {
//     if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
//       deleteProduct(id); load(); toast.success('Product deleted');
//     }
//   };

//   const handleStatusToggle = (id: string, current: string) => {
//     const next = current === 'active' ? 'inactive' : 'active';
//     updateProduct(id, { status: next }); load();
//     toast.success(`Product ${next}`);
//   };

//   const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
//     setForm((p: any) => ({ ...p, [k]: e.target.value }));

//   return (
//     <div className="space-y-6">
//       {/* Form Modal */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//               <h3 className="font-bold text-gray-900 flex items-center gap-2">
//                 <DollarSign size={18} className="text-blue-600" />
//                 {editId ? 'Edit Loan Product' : 'New Loan Product'}
//               </h3>
//               <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
//             </div>
//             <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {[
//                 ['Product Code *', 'code', 'text', 'e.g. M-LOAN'],
//                 ['Product Name *', 'name', 'text', 'e.g. Monthly Loan'],
//                 ['Interest Rate (%) *', 'interestRate', 'number', '12.5'],
//                 ['Grace Period (days)', 'gracePeriodDays', 'number', '5'],
//                 ['Min Amount (Ksh) *', 'minAmount', 'number', '5000'],
//                 ['Max Amount (Ksh) *', 'maxAmount', 'number', '100000'],
//                 ['Min Term (months) *', 'minTerm', 'number', '3'],
//                 ['Max Term (months) *', 'maxTerm', 'number', '12'],
//               ].map(([label, key, type, placeholder]) => (
//                 <div key={key}>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
//                   <input type={type} value={form[key] ?? ''} onChange={f(key)} placeholder={placeholder}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                 </div>
//               ))}
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Interest Type *</label>
//                 <select value={form.interestType} onChange={f('interestType')}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//                   <option value="flat">Flat Rate</option>
//                   <option value="reducing">Reducing Balance</option>
//                   <option value="declining_balance">Declining Balance</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Repayment Frequency *</label>
//                 <select value={form.repaymentFrequency} onChange={f('repaymentFrequency')}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//                   <option value="daily">Daily</option>
//                   <option value="weekly">Weekly</option>
//                   <option value="monthly">Monthly</option>
//                 </select>
//               </div>
//               <div className="col-span-full">
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
//                 <textarea value={form.description} onChange={f('description')} rows={3}
//                   placeholder="Describe this loan product…"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
//               </div>
//             </div>
//             <div className="p-6 border-t flex justify-end gap-3">
//               <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
//               <Button onClick={handleSave}>{editId ? 'Save Changes' : 'Create Product'}</Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <DollarSign size={24} className="text-blue-600" /> Loan Products
//           </h2>
//           <p className="text-gray-500 text-sm mt-1">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="ghost" size="sm" onClick={load} className="flex items-center gap-1"><RefreshCw size={14} /></Button>
//           <Button onClick={openAdd} className="flex items-center gap-2"><Plus size={16} /> Add Product</Button>
//         </div>
//       </div>

//       {/* Filters */}
//       <Card>
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//             <input type="text" placeholder="Search products…" value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
//           </div>
//           <div className="flex items-center gap-2">
//             <Filter size={16} className="text-gray-400" />
//             <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//               <option value="all">All</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
//         </div>
//       </Card>

//       {/* Table */}
//       <Card padding="sm">
//         {loading ? (
//           <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
//         ) : filtered.length === 0 ? (
//           <div className="text-center py-16 text-gray-400">
//             <DollarSign size={40} className="mx-auto mb-3 text-gray-300" />
//             <p className="font-medium">No loan products yet</p>
//             <button onClick={openAdd} className="mt-2 text-blue-600 text-sm hover:underline">Create your first product</button>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   {['Product', 'Interest', 'Amount Range', 'Term Range', 'Frequency', 'Status', ''].map(h => (
//                     <th key={h} className="text-left py-3 px-4 text-sm font-medium text-gray-700">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((p, i) => (
//                   <tr key={p.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="py-3 px-4">
//                       <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
//                       <p className="text-xs text-gray-500 font-mono">{p.code}</p>
//                       <p className="text-xs text-gray-400 mt-0.5 max-w-40 truncate">{p.description}</p>
//                     </td>
//                     <td className="py-3 px-4">
//                       <p className="text-sm font-semibold text-gray-900">{p.interestRate}%</p>
//                       <p className="text-xs text-gray-500 capitalize">{(p.interestType ?? '').replace('_', ' ')}</p>
//                     </td>
//                     <td className="py-3 px-4 text-sm text-gray-700">
//                       {fmt(p.minAmount)} – {fmt(p.maxAmount)}
//                     </td>
//                     <td className="py-3 px-4 text-sm text-gray-700">
//                       {p.minTerm} – {p.maxTerm} months
//                     </td>
//                     <td className="py-3 px-4 text-sm text-gray-700 capitalize">{p.repaymentFrequency}</td>
//                     <td className="py-3 px-4">
//                       <button onClick={() => handleStatusToggle(p.id, p.status)}
//                         className={`text-xs px-2 py-1 rounded-full font-semibold transition ${
//                           p.status === 'active'
//                             ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                         }`}>
//                         {p.status}
//                       </button>
//                     </td>
//                     <td className="py-3 px-4">
//                       <div className="flex items-center gap-1">
//                         <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600" title="Edit">
//                           <Edit2 size={13} />
//                         </button>
//                         <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Delete">
//                           <Trash2 size={13} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// };


// import React, { useState, useEffect, useCallback } from 'react';
// import { Card } from '../ui/Card';
// import { Button } from '../ui/Button';
// import { LoadingSpinner } from '../ui/LoadingSpinner';
// import { Search, Filter, Plus, Trash2, DollarSign, Edit2, X, RefreshCw, AlertCircle, Percent, Calendar } from 'lucide-react';
// import { loanProductApi } from '../../services/api'; // Adjust path to your API service
// import type { AddLoanProductPayload, ListLoanProductsParams } from '../../services/api'; // Adjust path
// import toast from 'react-hot-toast';

// const fmt = (n: number) =>
//   new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

// // ── Type definitions ────────────────────────────────────────────────────
// interface LoanProduct {
//   id?: number;
//   code?: string;
//   loanProductName?: string;
//   productCode?: string;
//   name?: string;
//   description?: string;
//   percentage?: number;
//   interestRate?: number;
//   loanPeriod?: number;
//   minAmount?: number;
//   maxAmount?: number;
//   minTerm?: number;
//   maxTerm?: number;
//   interestType?: string;
//   repaymentFrequency?: string;
//   gracePeriodDays?: number;
//   status?: string | boolean;
//   createdBy?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// // ── Empty form template matching Postman API ────────────────────────────
// const EMPTY_FORM: AddLoanProductPayload = {
//   loanProductName: '',
//   percentage: 0,
//   loanPeriod: 0,
// };

// // ── LoanProducts Component ──────────────────────────────────────────────
// export const LoanProducts: React.FC = () => {
//   const [products,     setProducts]     = useState<LoanProduct[]>([]);
//   const [loading,      setLoading]      = useState(true);
//   const [error,        setError]        = useState<string | null>(null);
//   const [searchTerm,   setSearchTerm]   = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [showForm,     setShowForm]     = useState(false);
//   const [editId,       setEditId]       = useState<number | null>(null);
//   const [form,         setForm]         = useState<AddLoanProductPayload>({ ...EMPTY_FORM });
//   const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);

//   // ── Fetch products from API ──────────────────────────────────────────
//   // const loadProducts = useCallback(async () => {
//   //   setLoading(true);
//   //   setError(null);
    
//   //   try {
//   //     // GET /api/v1/loan-products?status=false&name=X
//   //     const params: ListLoanProductsParams = {
//   //       status: statusFilter !== 'all' ? statusFilter : undefined,
//   //       name: searchTerm || undefined,
//   //     };
      
//   //     const response = await loanProductApi.listProducts(params);

//   //     // Debugging
//   //     console.log('API RESPONSE:', response); 
//   //     console.log('PRODUCT DATA:', response?.data?.content);
      
//   //     // Handle different response structures
//   //     const productData = response?.data || response?.content || response || [];
//   //     // const productData = response?.data?.content || [];
//   //     // setProducts(productData);
//   //     setProducts(Array.isArray(productData) ? productData : []);
//   //   } catch (err: any) {
//   //     setError(err.message || 'Failed to fetch loan products');
//   //     console.error('Error fetching loan products:', err);

//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // }, [statusFilter, searchTerm]);

//   const loadProducts = useCallback(async () => {
//   setLoading(true);
//   setError(null);
  
//   try {
//     const params: ListLoanProductsParams = {
//       status: statusFilter !== 'all' ? statusFilter : undefined,
//       name: searchTerm || undefined,
//     };
    
//     const response = await loanProductApi.listProducts(params);

//     console.log('API RESPONSE:', response);
//     console.log('PRODUCT DATA:', response?.data?.content);
    
//     // FIX: Properly extract the content array from paginated response
//     let productData = [];
    
//     if (response?.data?.content && Array.isArray(response.data.content)) {
//       // Paginated Spring Boot response
//       productData = response.data.content;
//     } else if (Array.isArray(response?.data)) {
//       // Direct array in data
//       productData = response.data;
//     } else if (Array.isArray(response?.content)) {
//       // Array directly in content
//       productData = response.content;
//     } else if (Array.isArray(response)) {
//       // Direct array response
//       productData = response;
//     }
    
//     console.log('PARSED PRODUCT DATA:', productData);
//     setProducts(productData);
//   } catch (err: any) {
//     setError(err.message || 'Failed to fetch loan products');
//     console.error('Error fetching loan products:', err);
//   } finally {
//     setLoading(false);
//   }
// }, [statusFilter, searchTerm]);

//   useEffect(() => {
//     loadProducts();
//   }, [loadProducts]);

//   // ── Form handlers ────────────────────────────────────────────────────
//   const openAdd = () => { 
//     setEditId(null); 
//     setForm({ ...EMPTY_FORM }); 
//     setShowForm(true); 
//   };

//   const openEdit = (p: LoanProduct) => {
//     setEditId(p.id || null);
//     setForm({ 
//       loanProductName: p.loanProductName || p.name || '',
//       percentage: p.percentage || p.interestRate || 0,
//       loanPeriod: p.loanPeriod || p.maxTerm || 0,
//     });
//     setShowForm(true);
//   };

//   // const handleInputChange = (field: keyof AddLoanProductPayload) => (
//   //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   // ) => {
//   //   const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
//   //   setForm((prev: AddLoanProductPayload) => ({ ...prev, [field]: value }));
//   // };

//   const handleInputChange = (field: keyof AddLoanProductPayload) => (
//   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
// ) => {
//   // FIX: Explicitly convert number fields to numbers
//   let value: string | number = e.target.value;
  
//   if (e.target.type === 'number') {
//     value = e.target.value === '' ? 0 : Number(e.target.value);
//   }
  
//   setForm((prev: AddLoanProductPayload) => ({ ...prev, [field]: value }));
// };

//   // ── Save (Add/Update) product ────────────────────────────────────────
//   const handleSave = async () => {
    
//     //Debugging
//     console.log('Sending payload:', {
//       loanProductName: form.loanProductName,
//       percentage: Number(form.percentage),
//       loanPeriod: Number(form.loanPeriod)
//   });

//     // Validation
//     if (!form.loanProductName.trim()) {
//       toast.error('Product name is required');
//       return;
//     }
//     if (form.percentage <= 0) {
//       toast.error('Interest rate must be greater than 0');
//       return;
//     }
//     if (form.loanPeriod <= 0) {
//       toast.error('Loan period must be greater than 0');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       if (editId) {
//         // PUT endpoint not in Postman, using POST as workaround or show message
//         // Note: Based on Postman collection, there's no PUT endpoint for loan products
//         // You may need to add one or delete and recreate
//         toast.error('Update endpoint not available yet. Please delete and recreate.');
//         return;
//       } else {
//         // POST /api/v1/loan-products — Add a new loan product
//         await loanProductApi.addProduct(form);
//         toast.success('Product created successfully!');
//       }
      
//       setShowForm(false);
//       loadProducts(); // Refresh list
//     } catch (err: any) {
//       setError(err.message || 'Failed to save product');
//       toast.error(err.message || 'Failed to save product');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Delete product ───────────────────────────────────────────────────
//   const handleDelete = async (id: number, name: string) => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Note: Based on Postman collection, there's no DELETE endpoint for loan products
//       // You may need to add one or implement a soft delete
//       toast.error('Delete endpoint not available yet. Please implement the backend endpoint.');
//       setDeleteConfirm(null);
//       return;
      
//       // Uncomment when backend endpoint is available:
//       // await loanProductApi.deleteProduct(id);
//       // toast.success(`Product "${name}" deleted`);
//       // loadProducts();
//     } catch (err: any) {
//       setError(err.message || 'Failed to delete product');
//       toast.error(err.message || 'Failed to delete product');
//     } finally {
//       setLoading(false);
//       setDeleteConfirm(null);
//     }
//   };

//   // ── Local filtering for display ─────────────────────────────────────
//   const filtered = products.filter(p => {
//     const productName = (p.loanProductName || p.name || '').toLowerCase();
//     const status = p.status;
    
//     // If API filtering is working, we can skip local filtering
//     // But keeping for safety
//     if (statusFilter !== 'all') {
//       const statusStr = String(status).toLowerCase();
//       const filterStr = statusFilter.toLowerCase();
//       if (statusStr !== filterStr) return false;
//     }
    
//     if (searchTerm && !productName.includes(searchTerm.toLowerCase())) {
//       return false;
//     }
    
//     return true;
//   });

//   return (
//     <div className="space-y-6">
//       {/* Add/Edit Form Modal */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
//             <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                 <DollarSign size={20} className="text-green-600" />
//                 {editId ? 'Edit Loan Product' : 'Add New Loan Product'}
//               </h3>
//               <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
//                 <X size={20} />
//               </button>
//             </div>
            
//             <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="p-6 space-y-4">
//               {error && (
//                 <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
//                   <AlertCircle size={16} className="mt-0.5 shrink-0" />
//                   <span>{error}</span>
//                 </div>
//               )}
              
//               {/* Product Name — matches Postman field: loanProductName */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Product Name *
//                 </label>
//                 <input
//                   type="text"
//                   value={form.loanProductName}
//                   onChange={handleInputChange('loanProductName')}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   placeholder="e.g., YEARLY"
//                   required
//                 />
//               </div>
              
//               {/* Interest Rate — matches Postman field: percentage */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Interest Rate (%) *
//                 </label>
//                 <div className="relative">
//                   <Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="number"
//                     value={form.percentage || ''}
//                     onChange={handleInputChange('percentage')}
//                     className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="10"
//                     min="0"
//                     step="0.1"
//                     required
//                   />
//                 </div>
//               </div>
              
//               {/* Loan Period — matches Postman field: loanPeriod */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Loan Period (months) *
//                 </label>
//                 <div className="relative">
//                   <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="number"
//                     value={form.loanPeriod || ''}
//                     onChange={handleInputChange('loanPeriod')}
//                     className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="12"
//                     min="1"
//                     required
//                   />
//                 </div>
//                 <p className="mt-1 text-xs text-gray-500">Number of months for loan repayment</p>
//               </div>
              
//               {/* Form Actions */}
//               <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//                 <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>
//                   Cancel
//                 </Button>
//                 <Button 
//                   type="submit" 
//                   disabled={loading}
//                   className="bg-green-600 hover:bg-green-700 text-white"
//                 >
//                   {loading ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteConfirm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//             <div className="text-center">
//               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
//                 <AlertCircle className="h-6 w-6 text-red-600" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Product</h3>
//               <p className="text-sm text-gray-500 mb-6">
//                 Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
//               </p>
//               <div className="flex justify-center gap-3">
//                 <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
//                   Cancel
//                 </Button>
//                 <Button 
//                   onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.name)}
//                   disabled={loading}
//                   className="bg-red-600 hover:bg-red-700 text-white"
//                 >
//                   {loading ? 'Deleting...' : 'Delete'}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <DollarSign size={24} className="text-green-600" /> Loan Products
//           </h2>
//           <p className="text-gray-500 text-sm mt-1">
//             {filtered.length} product{filtered.length !== 1 ? 's' : ''}
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="ghost" size="sm" onClick={loadProducts} className="flex items-center gap-1">
//             <RefreshCw size={14} /> Refresh
//           </Button>
//           <Button onClick={openAdd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
//             <Plus size={16} /> Add Product
//           </Button>
//         </div>
//       </div>

//       {/* Filters */}
//       <Card>
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//             <input 
//               type="text" 
//               placeholder="Search products by name…" 
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <Filter size={16} className="text-gray-400" />
//             <select 
//               value={statusFilter} 
//               onChange={e => setStatusFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             >
//               <option value="all">All Status</option>
//               <option value="true">Active</option>
//               <option value="false">Inactive</option>
//             </select>
//           </div>
//         </div>
//       </Card>

//       {/* Products Table */}
//       <Card padding="sm">
//         {loading ? (
//           <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
//         ) : filtered.length === 0 ? (
//           <div className="text-center py-16 text-gray-400">
//             <DollarSign size={40} className="mx-auto mb-3 text-gray-300" />
//             <p className="font-medium">No loan products yet</p>
//             <p className="text-sm">Click "Add Product" to create your first loan product.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   {['Product Name', 'Interest Rate', 'Loan Period', 'Status', 'Actions'].map(h => (
//                     <th key={h} className="text-left py-3 px-4 text-sm font-medium text-gray-700">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((p) => (
//                   <tr key={p.id || p.productCode} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                     <td className="py-3 px-4">
//                       <p className="font-semibold text-gray-900 text-sm">
//                         {p.loanProductName || p.name || 'N/A'}
//                       </p>
//                       {p.productCode && (
//                         <p className="text-xs text-gray-500 font-mono">{p.productCode}</p>
//                       )}
//                     </td>
//                     <td className="py-3 px-4">
//                       <p className="text-sm font-semibold text-gray-900">
//                         {p.percentage || p.interestRate || 0}%
//                       </p>
//                     </td>
//                     <td className="py-3 px-4 text-sm text-gray-700">
//                       {p.loanPeriod || p.maxTerm || 0} months
//                     </td>
//                     <td className="py-3 px-4">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         p.status === true || p.status === 'true' || p.status === 'active'
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-gray-100 text-gray-600'
//                       }`}>
//                         {p.status === true || p.status === 'true' || p.status === 'active' ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4">
//                       <div className="flex items-center gap-2">
//                         <button 
//                           onClick={() => openEdit(p)} 
//                           className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors" 
//                           title="Edit product"
//                         >
//                           <Edit2 size={14} />
//                         </button>
//                         <button 
//                           onClick={() => setDeleteConfirm({ 
//                             id: p.id || 0, 
//                             name: p.loanProductName || p.name || 'Unknown' 
//                           })} 
//                           className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors" 
//                           title="Delete product"
//                         >
//                           <Trash2 size={14} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// };

// import React, { useState, useEffect, useCallback } from 'react';
// import { Card } from '../ui/Card';
// import { Button } from '../ui/Button';
// import { LoadingSpinner } from '../ui/LoadingSpinner';
// import {
//   Search, Filter, Plus, Trash2, DollarSign,
//   Edit2, X, RefreshCw, AlertCircle, Percent, Calendar,
// } from 'lucide-react';
// import { loanProductApi } from '../../services/api';
// import type { AddLoanProductPayload, ListLoanProductsParams } from '../../services/api';
// import toast from 'react-hot-toast';

// // ── helpers ───────────────────────────────────────────────────────────────────
// // Confirmed API envelope: { success, data: { content: [...] }, timestamp }
// function extractProductList(res: any): any[] {
//   if (!res) return [];
//   // { success, data: { content: [...] } }
//   if (Array.isArray(res?.data?.content)) return res.data.content;
//   // { data: [...] }
//   if (Array.isArray(res?.data))          return res.data;
//   // { content: [...] }
//   if (Array.isArray(res?.content))       return res.content;
//   // bare array
//   if (Array.isArray(res))                return res;
//   return [];
// }

// function isActive(p: any): boolean {
//   return p.status === true || p.status === 'true' || p.status === 'ACTIVE' || p.status === 'active';
// }

// function formatDate(d?: string | null): string {
//   if (!d) return '—';
//   return new Date(d).toLocaleDateString('en-KE', {
//     day: '2-digit', month: 'short', year: 'numeric',
//   });
// }

// // ── types ─────────────────────────────────────────────────────────────────────
// interface LoanProduct {
//   id?: number;
//   productCode?: string;
//   loanProductName?: string;
//   name?: string;
//   percentage?: number;
//   interestRate?: number;
//   loanPeriod?: number;
//   maxTerm?: number;
//   status?: string | boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // KEY FIX: use a separate raw-string form state so inputs are controlled
// // correctly, then convert to numbers only when submitting.
// // This avoids the HTML-input-always-returns-string bug.
// // ─────────────────────────────────────────────────────────────────────────────
// interface FormState {
//   loanProductName: string;
//   percentage:      string; // kept as string while user types
//   loanPeriod:      string; // kept as string while user types
// }

// const EMPTY_FORM: FormState = { loanProductName: '', percentage: '', loanPeriod: '' };

// export const LoanProducts: React.FC = () => {
//   const [products,      setProducts]      = useState<LoanProduct[]>([]);
//   const [loading,       setLoading]       = useState(true);
//   const [saving,        setSaving]        = useState(false);
//   const [error,         setError]         = useState<string | null>(null);
//   const [searchTerm,    setSearchTerm]    = useState('');
//   const [statusFilter,  setStatusFilter]  = useState('all');
//   const [showForm,      setShowForm]      = useState(false);
//   const [editId,        setEditId]        = useState<number | null>(null);
//   const [form,          setForm]          = useState<FormState>({ ...EMPTY_FORM });
//   const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);
//   const [deleting,      setDeleting]      = useState(false);

//   // ── fetch ─────────────────────────────────────────────────────────────────
//   const loadProducts = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const params: ListLoanProductsParams = {
//         status: statusFilter !== 'all' ? statusFilter : undefined,
//         name:   searchTerm   || undefined,
//       };
//       const res = await loanProductApi.listProducts(params);
//       console.log('[LoanProducts] raw response:', res);
//       const list = extractProductList(res);
//       console.log('[LoanProducts] extracted list:', list);
//       setProducts(list);
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch loan products');
//     } finally {
//       setLoading(false);
//     }
//   }, [statusFilter, searchTerm]);

//   useEffect(() => { loadProducts(); }, [loadProducts]);

//   // ── open forms ────────────────────────────────────────────────────────────
//   const openAdd = () => {
//     setEditId(null);
//     setForm({ ...EMPTY_FORM });
//     setError(null);
//     setShowForm(true);
//   };

//   const openEdit = (p: LoanProduct) => {
//     setEditId(p.id ?? null);
//     setForm({
//       loanProductName: p.loanProductName ?? p.name ?? '',
//       percentage:      String(p.percentage  ?? p.interestRate ?? ''),
//       loanPeriod:      String(p.loanPeriod  ?? p.maxTerm      ?? ''),
//     });
//     setError(null);
//     setShowForm(true);
//   };

//   const field = (k: keyof FormState) =>
//     (e: React.ChangeEvent<HTMLInputElement>) =>
//       setForm(prev => ({ ...prev, [k]: e.target.value }));

//   // ── save ──────────────────────────────────────────────────────────────────
//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // ── Convert to numbers HERE, at submission time ───────────────────────
//     // This is the fix: HTML inputs always give strings; we parse at the
//     // last possible moment so the API always receives real numbers.
//     const payload: AddLoanProductPayload = {
//       loanProductName: form.loanProductName.trim().toUpperCase(),
//       percentage:      parseFloat(form.percentage),
//       loanPeriod:      parseInt(form.loanPeriod, 10),
//     };

//     console.log('[LoanProducts] Submitting payload:', payload);

//     if (!payload.loanProductName) { toast.error('Product name is required'); return; }
//     if (isNaN(payload.percentage) || payload.percentage <= 0) {
//       toast.error('Interest rate must be greater than 0'); return;
//     }
//     if (isNaN(payload.loanPeriod) || payload.loanPeriod <= 0) {
//       toast.error('Loan period must be greater than 0'); return;
//     }

//     setSaving(true);
//     setError(null);

//     try {
//       if (editId) {
//         // No PUT endpoint for loan products in Postman — inform user
//         toast.error('Update is not yet available. Please delete and recreate.');
//         return;
//       }
//       await loanProductApi.addProduct(payload);
//       toast.success(`Product "${payload.loanProductName}" created!`);
//       setShowForm(false);
//       setForm({ ...EMPTY_FORM });
//       loadProducts();
//     } catch (err: any) {
//       setError(err.message || 'Failed to save product');
//       toast.error(err.message || 'Failed to save product');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── delete ────────────────────────────────────────────────────────────────
//   const handleDelete = async (id: number, name: string) => {
//     setDeleting(true);
//     try {
//       // No DELETE endpoint for loan products in Postman — inform user
//       toast.error('Delete is not yet available for loan products.');
//       setDeleteConfirm(null);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   // ── client-side filter (safety net) ──────────────────────────────────────
//   const filtered = products.filter(p => {
//     const name = (p.loanProductName ?? p.name ?? '').toLowerCase();
//     const matchSearch = !searchTerm || name.includes(searchTerm.toLowerCase());
//     const matchStatus =
//       statusFilter === 'all' ||
//       (statusFilter === 'true'  &&  isActive(p)) ||
//       (statusFilter === 'false' && !isActive(p));
//     return matchSearch && matchStatus;
//   });

//   // ── render ────────────────────────────────────────────────────────────────
//   return (
//     <div className="space-y-6">

//       {/* ── Add / Edit Modal ── */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
//             <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                 <DollarSign size={20} className="text-blue-600" />
//                 {editId ? 'Edit Loan Product' : 'Add New Loan Product'}
//               </h3>
//               <button onClick={() => setShowForm(false)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors">
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleSave} className="p-6 space-y-4">
//               {error && (
//                 <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
//                   <AlertCircle size={16} className="mt-0.5 shrink-0" />
//                   <span>{error}</span>
//                 </div>
//               )}

//               {/* Product name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Product Name *
//                   <span className="text-gray-400 text-xs ml-2">e.g. YEARLY, MONTHLY</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={form.loanProductName}
//                   onChange={field('loanProductName')}
//                   placeholder="YEARLY"
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase placeholder:normal-case"
//                   required
//                 />
//               </div>

//               {/* Interest rate — string field, parsed on submit */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Interest Rate (%) *
//                 </label>
//                 <div className="relative">
//                   <Percent size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="number"
//                     value={form.percentage}
//                     onChange={field('percentage')}
//                     placeholder="10"
//                     min="0.01"
//                     step="0.01"
//                     className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 {form.percentage && !isNaN(parseFloat(form.percentage)) && (
//                   <p className="text-xs text-blue-600 mt-1 font-medium">
//                     {parseFloat(form.percentage)}% interest
//                   </p>
//                 )}
//               </div>

//               {/* Loan period — string field, parsed on submit */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Loan Period (months) *
//                 </label>
//                 <div className="relative">
//                   <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="number"
//                     value={form.loanPeriod}
//                     onChange={field('loanPeriod')}
//                     placeholder="12"
//                     min="1"
//                     step="1"
//                     className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 {form.loanPeriod && !isNaN(parseInt(form.loanPeriod)) && (
//                   <p className="text-xs text-gray-400 mt-1">
//                     {parseInt(form.loanPeriod)} month repayment period
//                   </p>
//                 )}
//               </div>

//               {/* Payload preview */}
//               {form.loanProductName && form.percentage && form.loanPeriod && (
//                 <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
//                   <p className="text-xs text-gray-500 font-medium mb-1">
//                     POST /tujipange/api/v1/loan-products
//                   </p>
//                   <pre className="text-xs font-mono text-gray-700">
// {JSON.stringify({
//   loanProductName: form.loanProductName.toUpperCase(),
//   percentage:      parseFloat(form.percentage)  || 0,
//   loanPeriod:      parseInt(form.loanPeriod, 10) || 0,
// }, null, 2)}
//                   </pre>
//                 </div>
//               )}

//               <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
//                 <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" loading={saving}>
//                   {editId ? 'Update Product' : 'Create Product'}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ── Delete Confirm Modal ── */}
//       {deleteConfirm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
//             <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
//               <AlertCircle size={24} className="text-red-600" />
//             </div>
//             <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product</h3>
//             <p className="text-sm text-gray-500 mb-6">
//               Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>?
//               This action cannot be undone.
//             </p>
//             <div className="flex justify-center gap-3">
//               <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
//               <Button
//                 loading={deleting}
//                 onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.name)}
//                 className="bg-red-600 hover:bg-red-700"
//               >
//                 Delete
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Header ── */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <DollarSign size={24} className="text-blue-600" /> Loan Products
//           </h2>
//           <p className="text-gray-500 text-sm mt-1">
//             {filtered.length} product{filtered.length !== 1 ? 's' : ''}
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="ghost" size="sm" onClick={loadProducts}
//             className="flex items-center gap-1">
//             <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
//           </Button>
//           <Button onClick={openAdd} className="flex items-center gap-2">
//             <Plus size={16} /> Add Product
//           </Button>
//         </div>
//       </div>

//       {/* ── Error ── */}
//       {error && !showForm && (
//         <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-4">
//           <AlertCircle size={16} className="text-red-600 shrink-0" />
//           <p className="text-red-700 text-sm">{error}</p>
//         </div>
//       )}

//       {/* ── Filters ── */}
//       <Card>
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//             <input
//               type="text" value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               placeholder="Search products by name…"
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <Filter size={16} className="text-gray-400" />
//             <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//               <option value="all">All Status</option>
//               <option value="true">Active</option>
//               <option value="false">Inactive</option>
//             </select>
//           </div>
//         </div>
//       </Card>

//       {/* ── Table ── */}
//       <Card padding="sm">
//         {loading ? (
//           <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
//         ) : filtered.length === 0 ? (
//           <div className="text-center py-16 text-gray-400">
//             <DollarSign size={40} className="mx-auto mb-3 text-gray-200" />
//             <p className="font-semibold text-gray-500">
//               {searchTerm || statusFilter !== 'all'
//                 ? 'No products match your filters'
//                 : 'No loan products yet'}
//             </p>
//             {!searchTerm && statusFilter === 'all' && (
//               <button onClick={openAdd}
//                 className="mt-3 text-blue-600 text-sm hover:underline">
//                 Create your first product
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   {['Product Name', 'Code', 'Interest Rate', 'Period', 'Status', 'Created', 'Actions'].map(h => (
//                     <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((p, i) => (
//                   <tr key={p.id ?? p.productCode ?? i}
//                     className="border-b border-gray-100 hover:bg-gray-50 transition-colors">

//                     <td className="py-3 px-4">
//                       <p className="font-bold text-gray-900 text-sm uppercase">
//                         {p.loanProductName ?? p.name ?? '—'}
//                       </p>
//                     </td>

//                     <td className="py-3 px-4">
//                       {p.productCode
//                         ? <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{p.productCode}</span>
//                         : <span className="text-gray-300 text-xs">—</span>}
//                     </td>

//                     <td className="py-3 px-4">
//                       {/* Show the actual stored value — if 0, it means backend received wrong type */}
//                       <div className="flex items-center gap-0.5">
//                         <span className="text-lg font-bold text-blue-700">
//                           {p.percentage ?? p.interestRate ?? 0}
//                         </span>
//                         <span className="text-xs text-blue-500 font-medium">%</span>
//                       </div>
//                     </td>

//                     <td className="py-3 px-4">
//                       <div className="flex items-center gap-0.5">
//                         <span className="text-sm font-bold text-gray-800">
//                           {p.loanPeriod ?? p.maxTerm ?? 0}
//                         </span>
//                         <span className="text-xs text-gray-400 ml-0.5">mo</span>
//                       </div>
//                     </td>

//                     <td className="py-3 px-4">
//                       <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-semibold ${
//                         isActive(p) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
//                       }`}>
//                         {isActive(p) ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>

//                     <td className="py-3 px-4 text-sm text-gray-500">
//                       {formatDate(p.createdAt)}
//                     </td>

//                     <td className="py-3 px-4">
//                       <div className="flex items-center gap-1">
//                         <button onClick={() => openEdit(p)}
//                           className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
//                           title="Edit product">
//                           <Edit2 size={14} />
//                         </button>
//                         <button
//                           onClick={() => setDeleteConfirm({
//                             id:   p.id ?? 0,
//                             name: p.loanProductName ?? p.name ?? 'Unknown',
//                           })}
//                           className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
//                           title="Delete product">
//                           <Trash2 size={14} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// };



import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import {
  Search, Filter, Plus, Trash2, DollarSign,
  Edit2, X, RefreshCw, AlertCircle, Percent, Calendar,
} from 'lucide-react';
import { loanProductApi } from '../../services/api';
import type { AddLoanProductPayload, ListLoanProductsParams } from '../../services/api';
import toast from 'react-hot-toast';

// ── helpers ───────────────────────────────────────────────────────────────────
// Confirmed API envelope: { success, data: { content: [...] }, timestamp }
function extractProductList(res: any): any[] {
  if (!res) return [];
  // { success, data: { content: [...] } }  — Spring Page
  if (Array.isArray(res?.data?.content)) return res.data.content;
  // { data: { data: { content: [...] } } }  — double-wrapped
  if (Array.isArray(res?.data?.data?.content)) return res.data.data.content;
  // { data: [...] }
  if (Array.isArray(res?.data)) return res.data;
  // { content: [...] }
  if (Array.isArray(res?.content)) return res.content;
  // bare array
  if (Array.isArray(res)) return res;
  return [];
}

function isActive(p: any): boolean {
  // Backend may use status:true/false OR active:true/false
  return p.status === true || p.status === 'true' || p.status === 'ACTIVE' || p.status === 'active'
    || p.active === true || p.active === 'true';
}

function formatDate(d?: string | null): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-KE', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ── types ─────────────────────────────────────────────────────────────────────
interface LoanProduct {
  id?: number;
  productCode?: string;
  loanProductName?: string;
  name?: string;
  percentage?: number;
  interestRate?: number;
  loanPeriod?: number;
  maxTerm?: number;
  status?: string | boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// KEY FIX: use a separate raw-string form state so inputs are controlled
// correctly, then convert to numbers only when submitting.
// This avoids the HTML-input-always-returns-string bug.
// ─────────────────────────────────────────────────────────────────────────────
interface FormState {
  loanProductName: string;
  percentage:      string; // kept as string while user types
  loanPeriod:      string; // kept as string while user types
}

const EMPTY_FORM: FormState = { loanProductName: '', percentage: '', loanPeriod: '' };

export const LoanProducts: React.FC = () => {
  const [products,      setProducts]      = useState<LoanProduct[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [searchTerm,    setSearchTerm]    = useState('');
  const [statusFilter,  setStatusFilter]  = useState('all');
  const [showForm,      setShowForm]      = useState(false);
  const [editId,        setEditId]        = useState<number | null>(null);
  const [form,          setForm]          = useState<FormState>({ ...EMPTY_FORM });
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);
  const [deleting,      setDeleting]      = useState(false);

  // ── fetch ─────────────────────────────────────────────────────────────────
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: ListLoanProductsParams = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        name:   searchTerm   || undefined,
      };
      const res = await loanProductApi.listProducts(params);

      //Debugging
      console.log('[LoanProducts] raw response:', res);
      const list = extractProductList(res);

      // Debugging
      console.log('[LoanProducts] extracted list:', list);
      console.log('[LoanProducts] first product raw:', JSON.stringify(list[0], null, 2));

      setProducts(list);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch loan products');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  // ── open forms ────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM });
    setError(null);
    setShowForm(true);
  };

  const openEdit = (p: LoanProduct) => {
    setEditId(p.id ?? null);
    setForm({
      loanProductName: p.loanProductName ?? p.name ?? '',
      percentage:      String(p.percentage  ?? p.interestRate ?? ''),
      loanPeriod:      String(p.loanPeriod  ?? p.maxTerm      ?? ''),
    });
    setError(null);
    setShowForm(true);
  };

  const field = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  // ── save ──────────────────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // ── Convert to numbers HERE, at submission time ───────────────────────
    // This is the fix: HTML inputs always give strings; we parse at the
    // last possible moment so the API always receives real numbers.
    const payload: AddLoanProductPayload = {
      loanProductName: form.loanProductName.trim().toUpperCase(),
      percentage:      parseFloat(form.percentage),
      loanPeriod:      parseInt(form.loanPeriod, 10),
    };

    // Debugging

    console.log('[LoanProducts] Submitting payload:', payload);
    console.log('Sending payload to API:', JSON.stringify(payload, null, 2));


    if (!payload.loanProductName) { toast.error('Product name is required'); return; }
    if (isNaN(payload.percentage) || payload.percentage <= 0) {
      toast.error('Interest rate must be greater than 0'); return;
    }
    if (isNaN(payload.loanPeriod) || payload.loanPeriod <= 0) {
      toast.error('Loan period must be greater than 0'); return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editId) {
        // No PUT endpoint for loan products in Postman — inform user
        toast.error('Update is not yet available. Please delete and recreate.');
        return;
      }
      await loanProductApi.addProduct(payload);
      toast.success(`Product "${payload.loanProductName}" created!`);
      setShowForm(false);
      setForm({ ...EMPTY_FORM });
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
      toast.error(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  // ── delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (_id: number, _name: string) => {
    setDeleting(true);
    try {
      // No DELETE endpoint for loan products in Postman — inform user
      toast.error('Delete is not yet available for loan products.');
      setDeleteConfirm(null);
    } finally {
      setDeleting(false);
    }
  };

  // ── client-side filter (safety net) ──────────────────────────────────────
  const filtered = products.filter(p => {
    const name = (p.loanProductName ?? p.name ?? '').toLowerCase();
    const matchSearch = !searchTerm || name.includes(searchTerm.toLowerCase());
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'true'  &&  isActive(p)) ||
      (statusFilter === 'false' && !isActive(p));
    return matchSearch && matchStatus;
  });

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <DollarSign size={20} className="text-blue-600" />
                {editId ? 'Edit Loan Product' : 'Add New Loan Product'}
              </h3>
              <button onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Product name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                  <span className="text-gray-400 text-xs ml-2">e.g. YEARLY, MONTHLY</span>
                </label>
                <input
                  type="text"
                  value={form.loanProductName}
                  onChange={field('loanProductName')}
                  placeholder="YEARLY"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase placeholder:normal-case"
                  required
                />
              </div>

              {/* Interest rate — string field, parsed on submit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (%) *
                </label>
                <div className="relative">
                  <Percent size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={form.percentage}
                    onChange={field('percentage')}
                    placeholder="10"
                    min="0.01"
                    step="0.01"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {form.percentage && !isNaN(parseFloat(form.percentage)) && (
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    {parseFloat(form.percentage)}% interest
                  </p>
                )}
              </div>

              {/* Loan period — string field, parsed on submit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Period (months) *
                </label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={form.loanPeriod}
                    onChange={field('loanPeriod')}
                    placeholder="12"
                    min="1"
                    step="1"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {form.loanPeriod && !isNaN(parseInt(form.loanPeriod)) && (
                  <p className="text-xs text-gray-400 mt-1">
                    {parseInt(form.loanPeriod)} month repayment period
                  </p>
                )}
              </div>

              {/* Payload preview */}
              {form.loanProductName && form.percentage && form.loanPeriod && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    POST /tujipange/api/v1/loan-products
                  </p>
                  <pre className="text-xs font-mono text-gray-700">
{JSON.stringify({
  loanProductName: form.loanProductName.toUpperCase(),
  percentage:      parseFloat(form.percentage)  || 0,
  loanPeriod:      parseInt(form.loanPeriod, 10) || 0,
}, null, 2)}
                  </pre>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={saving}>
                  {editId ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button
                loading={deleting}
                onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.name)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign size={24} className="text-blue-600" /> Loan Products
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={loadProducts}
            className="flex items-center gap-1">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </Button>
          <Button onClick={openAdd} className="flex items-center gap-2">
            <Plus size={16} /> Add Product
          </Button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && !showForm && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* ── Filters ── */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text" value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search products by name…"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* ── Table ── */}
      <Card padding="sm">
        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <DollarSign size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="font-semibold text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'No products match your filters'
                : 'No loan products yet'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button onClick={openAdd}
                className="mt-3 text-blue-600 text-sm hover:underline">
                Create your first product
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Product Name', 'Code', 'Interest Rate', 'Period', 'Status', 'Created', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {

                  return (
                  <tr key={p.id ?? p.productCode ?? i}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors">

                    <td className="py-3 px-4">
                      <p className="font-bold text-gray-900 text-sm uppercase">
                        {p.loanProductName ?? p.name ?? '—'}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      {p.productCode
                        ? <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{p.productCode}</span>
                        : <span className="text-gray-300 text-xs">—</span>}
                    </td>

                    <td className="py-3 px-4">
                      {/* Show the actual stored value — if 0, it means backend received wrong type */}
                      <div className="flex items-center gap-0.5">
                        <span className="text-lg font-bold text-blue-700">
                          {p.percentage ?? p.interestRate ?? 0}
                        </span>
                        <span className="text-xs text-blue-500 font-medium">%</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-0.5">
                        <span className="text-sm font-bold text-gray-800">
                          {p.loanPeriod ?? p.maxTerm ?? 0}
                        </span>
                        <span className="text-xs text-gray-400 ml-0.5">mo</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-semibold ${
                        isActive(p) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {isActive(p) ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-sm text-gray-500">
                      {formatDate(p.createdAt)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)}
                          className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                          title="Edit product">
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({
                            id:   p.id ?? 0,
                            name: p.loanProductName ?? p.name ?? 'Unknown',
                          })}
                          className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                          title="Delete product">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
