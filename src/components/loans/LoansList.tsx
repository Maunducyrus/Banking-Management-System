// import React, { useState, useEffect, useCallback } from 'react';
// import { Card } from '../ui/Card';
// import { Button } from '../ui/Button';
// import { StatusBadge } from '../ui/StatusBadge';
// import { LoadingSpinner } from '../ui/LoadingSpinner';
// import { Search, Filter, Eye, CreditCard, RefreshCw, AlertCircle, X } from 'lucide-react';
// import { getStorageData } from '../../utils/LocalStorage';

// const fmt = (n: number) =>
//   new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

// interface LoanDetailModal { loan: any; onClose: () => void; }

// const LoanDetail: React.FC<LoanDetailModal> = ({ loan, onClose }) => (
//   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
//       <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//         <h3 className="text-lg font-bold text-gray-900">Loan Details — {loan.loanNumber}</h3>
//         <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
//       </div>
//       <div className="p-6 grid grid-cols-2 gap-4">
//         {[
//           ['Loan Number',    loan.loanNumber],
//           ['Member',         loan.memberId],
//           ['Principal',      fmt(loan.principalAmount ?? 0)],
//           ['Interest Rate',  `${loan.interestRate ?? 0}%`],
//           ['Term',           `${loan.term ?? 0} months`],
//           ['Start Date',     loan.startDate ? new Date(loan.startDate).toLocaleDateString() : '—'],
//           ['Maturity Date',  loan.maturityDate ? new Date(loan.maturityDate).toLocaleDateString() : '—'],
//           ['Balance (P)',    fmt(loan.balancePrincipal ?? 0)],
//           ['Balance (I)',    fmt(loan.balanceInterest ?? 0)],
//           ['Next Due',       loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString() : 'N/A'],
//           ['Status',         loan.status],
//         ].map(([label, value]) => (
//           <div key={label}>
//             <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
//             <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
//           </div>
//         ))}
//       </div>
//       <div className="p-6 border-t border-gray-200 flex justify-end">
//         <Button variant="ghost" onClick={onClose}>Close</Button>
//       </div>
//     </div>
//   </div>
// );

// export const LoansList: React.FC = () => {
//   const [loans,        setLoans]        = useState<any[]>([]);
//   const [loading,      setLoading]      = useState(true);
//   const [searchTerm,   setSearchTerm]   = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [viewLoan,     setViewLoan]     = useState<any>(null);

//   const load = useCallback(() => {
//     setLoading(true);
//     // Loans live in localStorage until a backend endpoint exists
//     const data = getStorageData();
//     setLoans((data as any).loans ?? []);
//     setLoading(false);
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   const filtered = loans.filter(l => {
//     const q = searchTerm.toLowerCase();
//     const matchSearch = !q ||
//       (l.loanNumber ?? '').toLowerCase().includes(q) ||
//       (l.memberId ?? '').toLowerCase().includes(q);
//     const matchStatus = statusFilter === 'all' || l.status === statusFilter;
//     return matchSearch && matchStatus;
//   });

//   const totalOutstanding = filtered.reduce((s, l) => s + (l.balancePrincipal ?? 0) + (l.balanceInterest ?? 0), 0);

//   return (
//     <div className="space-y-6">
//       {viewLoan && <LoanDetail loan={viewLoan} onClose={() => setViewLoan(null)} />}

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <CreditCard size={24} className="text-blue-600" /> Active Loans
//           </h2>
//           <p className="text-gray-500 text-sm mt-1">
//             {filtered.length} loan{filtered.length !== 1 ? 's' : ''} · Outstanding: {fmt(totalOutstanding)}
//           </p>
//         </div>
//         <Button variant="ghost" size="sm" onClick={load} className="flex items-center gap-1">
//           <RefreshCw size={14} /> Refresh
//         </Button>
//       </div>

//       {/* Note banner — no API yet */}
//       <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
//         <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
//         <p className="text-amber-700 text-sm">
//           Loan processing endpoints are not yet available.
//           Loans created via the Disbursement page are stored locally.
//         </p>
//       </div>

//       {/* Filters */}
//       <Card>
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//             <input type="text" placeholder="Search by loan number or member…"
//               value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
//           </div>
//           <div className="flex items-center gap-2">
//             <Filter size={16} className="text-gray-400" />
//             <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="closed">Closed</option>
//               <option value="defaulted">Defaulted</option>
//               <option value="written_off">Written Off</option>
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
//             <CreditCard size={40} className="mx-auto mb-3 text-gray-300" />
//             <p className="font-medium">No loans found</p>
//             <p className="text-sm">Loans appear here after disbursement.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   {['Loan', 'Member', 'Principal', 'Balance', 'Rate', 'Status', 'Next Due', ''].map(h => (
//                     <th key={h} className="text-left py-3 px-4 text-sm font-medium text-gray-700">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((loan, i) => (
//                   <tr key={loan.id ?? i} className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="py-3 px-4">
//                       <p className="font-medium text-gray-900 text-sm">{loan.loanNumber}</p>
//                       <p className="text-xs text-gray-500">{loan.term} months</p>
//                     </td>
//                     <td className="py-3 px-4 text-sm text-gray-700">{loan.memberId ?? '—'}</td>
//                     <td className="py-3 px-4 text-sm font-medium text-gray-900">{fmt(loan.principalAmount ?? 0)}</td>
//                     <td className="py-3 px-4">
//                       <p className="text-sm text-gray-900">P: {fmt(loan.balancePrincipal ?? 0)}</p>
//                       <p className="text-xs text-gray-500">I: {fmt(loan.balanceInterest ?? 0)}</p>
//                     </td>
//                     <td className="py-3 px-4 text-sm text-gray-700">{loan.interestRate ?? 0}%</td>
//                     <td className="py-3 px-4"><StatusBadge status={loan.status} variant="loan" /></td>
//                     <td className="py-3 px-4 text-sm text-gray-600">
//                       {loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString() : 'N/A'}
//                     </td>
//                     <td className="py-3 px-4">
//                       <button onClick={() => setViewLoan(loan)}
//                         className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
//                         <Eye size={13} /> View
//                       </button>
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
// import { StatusBadge } from '../ui/StatusBadge';
// import { LoadingSpinner } from '../ui/LoadingSpinner';
// import { Search, Filter, Eye, CreditCard, RefreshCw, AlertCircle, X, Plus, Calendar, DollarSign } from 'lucide-react';
// import { loanApi } from '../../services/api'; // Adjust path to your API service
// import type { ApplyLoanPayload, ListLoansParams } from '../../services/api'; // Adjust path

// const fmt = (n: number) =>
//   new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

// // ── Type definitions ────────────────────────────────────────────────────
// interface Loan {
//   id?: number;
//   loanCode?: string;
//   loanNumber?: string;
//   memberNumber?: string;
//   memberId?: string;
//   productCode?: string;
//   principalAmount?: number;
//   interestRate?: number;
//   term?: number;
//   status?: string;
//   startDate?: string;
//   maturityDate?: string;
//   balancePrincipal?: number;
//   balanceInterest?: number;
//   nextDueDate?: string;
//   amount?: number;
//   createdAt?: string;
// }

// // ── Loan Detail Modal ──────────────────────────────────────────────────
// interface LoanDetailModalProps { 
//   loan: Loan; 
//   onClose: () => void; 
// }

// const LoanDetail: React.FC<LoanDetailModalProps> = ({ loan, onClose }) => (
//   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
//       <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//         <h3 className="text-lg font-bold text-gray-900">
//           Loan Details — {loan.loanCode || loan.loanNumber || 'N/A'}
//         </h3>
//         <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
//           <X size={20} />
//         </button>
//       </div>
//       <div className="p-6 grid grid-cols-2 gap-4">
//         {[
//           ['Loan Code',     loan.loanCode || loan.loanNumber || 'N/A'],
//           ['Member',        loan.memberNumber || loan.memberId || '—'],
//           ['Product Code',  loan.productCode || '—'],
//           ['Principal',     fmt(loan.principalAmount ?? loan.amount ?? 0)],
//           ['Interest Rate', `${loan.interestRate ?? 0}%`],
//           ['Term',          loan.term ? `${loan.term} months` : '—'],
//           ['Start Date',    loan.startDate ? new Date(loan.startDate).toLocaleDateString() : '—'],
//           ['Maturity Date', loan.maturityDate ? new Date(loan.maturityDate).toLocaleDateString() : '—'],
//           ['Balance (P)',   fmt(loan.balancePrincipal ?? 0)],
//           ['Balance (I)',   fmt(loan.balanceInterest ?? 0)],
//           ['Next Due',      loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString() : 'N/A'],
//           ['Status',        loan.status || 'N/A'],
//         ].map(([label, value]) => (
//           <div key={label}>
//             <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
//             <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
//           </div>
//         ))}
//       </div>
//       <div className="p-6 border-t border-gray-200 flex justify-end">
//         <Button variant="ghost" onClick={onClose}>Close</Button>
//       </div>
//     </div>
//   </div>
// );

// // ── Apply Loan Modal ───────────────────────────────────────────────────
// interface ApplyLoanModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const ApplyLoanModal: React.FC<ApplyLoanModalProps> = ({ isOpen, onClose, onSuccess }) => {
//   const [formData, setFormData] = useState<ApplyLoanPayload>({
//     memberNumber: '',
//     productCode: '',
//     amount: 0,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
    
//     try {
//       // POST /api/v1/loans/apply — Apply for a new loan
//       await loanApi.applyForLoan(formData);
//       onSuccess();
//       onClose();
//       // Reset form
//       setFormData({ memberNumber: '', productCode: '', amount: 0 });
//     } catch (err: any) {
//       setError(err.message || 'Failed to apply for loan');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//         <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//           <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//             <Plus size={20} className="text-green-600" /> Apply for Loan
//           </h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
//             <X size={20} />
//           </button>
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {error && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
//               {error}
//             </div>
//           )}
          
//           {/* Member Number */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Member Number *
//             </label>
//             <input
//               type="text"
//               value={formData.memberNumber}
//               onChange={(e) => setFormData({ ...formData, memberNumber: e.target.value })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               placeholder="e.g., WM-30023456-1"
//               required
//             />
//           </div>
          
//           {/* Product Code */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Product Code *
//             </label>
//             <input
//               type="text"
//               value={formData.productCode}
//               onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               placeholder="e.g., HRW-Y-ADB545"
//               required
//             />
//           </div>
          
//           {/* Amount */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Loan Amount (KES) *
//             </label>
//             <div className="relative">
//               <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="number"
//                 value={formData.amount || ''}
//                 onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 placeholder="50000.00"
//                 min="0"
//                 step="0.01"
//                 required
//               />
//             </div>
//           </div>
          
//           {/* Actions */}
//           <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//             <Button variant="ghost" type="button" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
//               {loading ? 'Submitting...' : 'Apply Now'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // ── Defer Loan Modal ───────────────────────────────────────────────────
// interface DeferLoanModalProps {
//   isOpen: boolean;
//   loanCode: string;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const DeferLoanModal: React.FC<DeferLoanModalProps> = ({ isOpen, loanCode, onClose, onSuccess }) => {
//   const [extensionDays, setExtensionDays] = useState<number>(30);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
    
//     try {
//       // PUT /api/v1/loans/defer?extensionDays=X&loanCode=Y
//       await loanApi.deferLoan(loanCode, extensionDays);
//       onSuccess();
//       onClose();
//     } catch (err: any) {
//       setError(err.message || 'Failed to defer loan');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//         <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//           <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//             <Calendar size={20} className="text-orange-600" /> Defer Loan
//           </h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
//             <X size={20} />
//           </button>
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {error && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
//               {error}
//             </div>
//           )}
          
//           <div>
//             <p className="text-sm text-gray-600 mb-2">
//               Loan Code: <span className="font-medium">{loanCode}</span>
//             </p>
//           </div>
          
//           {/* Extension Days */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Extension Days *
//             </label>
//             <input
//               type="number"
//               value={extensionDays}
//               onChange={(e) => setExtensionDays(parseInt(e.target.value) || 0)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               min="1"
//               max="365"
//               required
//             />
//             <p className="mt-1 text-xs text-gray-500">Number of days to extend the loan repayment period</p>
//           </div>
          
//           {/* Actions */}
//           <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//             <Button variant="ghost" type="button" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white">
//               {loading ? 'Processing...' : 'Defer Loan'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // ── Main LoansList Component ───────────────────────────────────────────
// export const LoansList: React.FC = () => {
//   const [loans,         setLoans]        = useState<Loan[]>([]);
//   const [loading,       setLoading]      = useState(true);
//   const [error,         setError]        = useState<string | null>(null);
//   const [searchTerm,    setSearchTerm]   = useState('');
//   const [statusFilter,  setStatusFilter] = useState('all');
//   const [viewLoan,      setViewLoan]     = useState<Loan | null>(null);
//   const [showApplyModal, setShowApplyModal] = useState(false);
//   const [deferLoanCode, setDeferLoanCode] = useState<string | null>(null);
  
//   // Pagination state
//   const [page, setPage] = useState(0);
//   const [size, setSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);

//   // ── Fetch loans from API ─────────────────────────────────────────────
//   const loadLoans = useCallback(async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       // GET /api/v1/loans?status=&page=&size=
//       const params: ListLoansParams = {
//         status: statusFilter !== 'all' ? statusFilter : undefined,
//         page,
//         size,
//       };
      
//       const response = await loanApi.listLoans(params);
      
//       // Handle different response structures
//       const loanData = response?.data || response?.content || response || [];
//       setLoans(Array.isArray(loanData) ? loanData : []);
      
//       // Set pagination if available
//       if (response?.totalPages !== undefined) {
//         setTotalPages(response.totalPages);
//       } else if (response?.page) {
//         setTotalPages(response.page.totalPages || 0);
//       }
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch loans');
//       console.error('Error fetching loans:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [statusFilter, page, size]);

//   useEffect(() => {
//     loadLoans();
//   }, [loadLoans]);

//   // ── Filter loans locally (as backup, main filtering done via API) ────
//   const filteredLoans = loans.filter(l => {
//     const q = searchTerm.toLowerCase();
//     const matchSearch = !q ||
//       (l.loanCode ?? '').toLowerCase().includes(q) ||
//       (l.loanNumber ?? '').toLowerCase().includes(q) ||
//       (l.memberNumber ?? '').toLowerCase().includes(q) ||
//       (l.memberId ?? '').toLowerCase().includes(q);
//     return matchSearch;
//   });

//   const totalOutstanding = filteredLoans.reduce(
//     (s, l) => s + (l.balancePrincipal ?? 0) + (l.balanceInterest ?? 0), 
//     0
//   );

//   return (
//     <div className="space-y-6">
//       {/* Modals */}
//       {viewLoan && (
//         <LoanDetail loan={viewLoan} onClose={() => setViewLoan(null)} />
//       )}
      
//       <ApplyLoanModal
//         isOpen={showApplyModal}
//         onClose={() => setShowApplyModal(false)}
//         onSuccess={loadLoans}
//       />
      
//       {deferLoanCode && (
//         <DeferLoanModal
//           isOpen={!!deferLoanCode}
//           loanCode={deferLoanCode}
//           onClose={() => setDeferLoanCode(null)}
//           onSuccess={loadLoans}
//         />
//       )}

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <CreditCard size={24} className="text-green-600" /> Loans
//           </h2>
//           <p className="text-gray-500 text-sm mt-1">
//             {filteredLoans.length} loan{filteredLoans.length !== 1 ? 's' : ''} · Outstanding: {fmt(totalOutstanding)}
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Button 
//             onClick={() => setShowApplyModal(true)} 
//             className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
//           >
//             <Plus size={16} /> Apply for Loan
//           </Button>
//           <Button variant="ghost" size="sm" onClick={loadLoans} className="flex items-center gap-1">
//             <RefreshCw size={14} /> Refresh
//           </Button>
//         </div>
//       </div>

//       {/* Error banner */}
//       {error && (
//         <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
//           <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
//           <p className="text-red-700 text-sm">{error}</p>
//         </div>
//       )}

//       {/* Filters */}
//       <Card>
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//             <input 
//               type="text" 
//               placeholder="Search by loan code or member…"
//               value={searchTerm} 
//               onChange={e => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" 
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <Filter size={16} className="text-gray-400" />
//             <select 
//               value={statusFilter} 
//               onChange={e => setStatusFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
//             >
//               <option value="all">All Status</option>
//               <option value="ACTIVE">Active</option>
//               <option value="PENDING">Pending</option>
//               <option value="APPROVED">Approved</option>
//               <option value="DISBURSED">Disbursed</option>
//               <option value="CLOSED">Closed</option>
//               <option value="DEFAULTED">Defaulted</option>
//               <option value="WRITTEN_OFF">Written Off</option>
//               <option value="DEFERRED">Deferred</option>
//             </select>
//           </div>
//         </div>
//       </Card>

//       {/* Loans Table */}
//       <Card padding="sm">
//         {loading ? (
//           <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
//         ) : filteredLoans.length === 0 ? (
//           <div className="text-center py-16 text-gray-400">
//             <CreditCard size={40} className="mx-auto mb-3 text-gray-300" />
//             <p className="font-medium">No loans found</p>
//             <p className="text-sm">Click "Apply for Loan" to get started.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   {['Loan Code', 'Member', 'Principal', 'Balance', 'Rate', 'Status', 'Next Due', 'Actions'].map(h => (
//                     <th key={h} className="text-left py-3 px-4 text-sm font-medium text-gray-700">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredLoans.map((loan) => (
//                   <tr key={loan.id || loan.loanCode} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                     <td className="py-3 px-4">
//                       <p className="font-medium text-gray-900 text-sm">
//                         {loan.loanCode || loan.loanNumber || 'N/A'}
//                       </p>
//                       <p className="text-xs text-gray-500">{loan.productCode || ''}</p>
//                     </td>
//                     <td className="py-3 px-4 text-sm text-gray-700">
//                       {loan.memberNumber || loan.memberId || '—'}
//                     </td>
//                     <td className="py-3 px-4 text-sm font-medium text-gray-900">
//                       {fmt(loan.principalAmount ?? loan.amount ?? 0)}
//                     </td>
//                     <td className="py-3 px-4">
//                       <p className="text-sm text-gray-900">P: {fmt(loan.balancePrincipal ?? 0)}</p>
//                       <p className="text-xs text-gray-500">I: {fmt(loan.balanceInterest ?? 0)}</p>
//                     </td>
//                     <td className="py-3 px-4 text-sm text-gray-700">{loan.interestRate ?? 0}%</td>
//                     <td className="py-3 px-4">
//                       <StatusBadge status={loan.status || 'UNKNOWN'} variant="loan" />
//                     </td>
//                     <td className="py-3 px-4 text-sm text-gray-600">
//                       {loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString() : 'N/A'}
//                     </td>
//                     <td className="py-3 px-4">
//                       <div className="flex items-center gap-2">
//                         {/* View Details */}
//                         <button 
//                           onClick={() => setViewLoan(loan)}
//                           className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium transition-colors"
//                           title="View loan details"
//                         >
//                           <Eye size={13} /> View
//                         </button>
                        
//                         {/* Defer Loan (only for active loans) */}
//                         {(loan.status === 'ACTIVE' || loan.status === 'active') && (
//                           <button 
//                             onClick={() => setDeferLoanCode(loan.loanCode || loan.loanNumber || '')}
//                             className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 font-medium transition-colors"
//                             title="Defer loan repayment"
//                           >
//                             <Calendar size={13} /> Defer
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
        
//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
//             <div className="text-sm text-gray-600">
//               Page {page + 1} of {totalPages}
//             </div>
//             <div className="flex gap-2">
//               <Button 
//                 variant="ghost" 
//                 size="sm" 
//                 onClick={() => setPage(Math.max(0, page - 1))}
//                 disabled={page === 0}
//               >
//                 Previous
//               </Button>
//               <Button 
//                 variant="ghost" 
//                 size="sm" 
//                 onClick={() => setPage(page + 1)}
//                 disabled={page >= totalPages - 1}
//               >
//                 Next
//               </Button>
//             </div>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// };



// import React, { useState, useEffect, useCallback } from 'react';
// import { Card } from '../ui/Card';
// import { Button } from '../ui/Button';
// import { StatusBadge } from '../ui/StatusBadge';
// import { LoadingSpinner } from '../ui/LoadingSpinner';
// import { Search, Filter, Eye, CreditCard, RefreshCw, AlertCircle, X, Plus, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
// import { loanApi, membersApi, loanProductApi } from '../../services/api';
// import type { ApplyLoanPayload, ListLoansParams } from '../../services/api';
// import toast from 'react-hot-toast';

// const fmt = (n: number) =>
//   new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

// // ── Type definitions ────────────────────────────────────────────────────
// interface Loan {
//   id?: number;
//   loanCode?: string;
//   loanNumber?: string;
//   memberNumber?: string;
//   memberId?: string;
//   productCode?: string;
//   principalAmount?: number;
//   interestRate?: number;
//   term?: number;
//   status?: string;
//   startDate?: string;
//   maturityDate?: string;
//   balancePrincipal?: number;
//   balanceInterest?: number;
//   nextDueDate?: string;
//   amount?: number;
//   createdAt?: string;
// }

// interface Member {
//   id?: number;
//   memberNumber?: string;
//   firstName?: string;
//   first_name?: string;
//   lastName?: string;
//   last_name?: string;
//   email?: string;
//   phone?: string;
//   status?: string;
// }

// interface LoanProduct {
//   id?: number;
//   productCode?: string;
//   loanProductName?: string;
//   name?: string;
//   percentage?: number;
//   interestRate?: number;
//   loanPeriod?: number;
//   status?: string | boolean;
// }

// // ── Loan Detail Modal ──────────────────────────────────────────────────
// interface LoanDetailModalProps { 
//   loan: Loan; 
//   onClose: () => void; 
// }

// const LoanDetail: React.FC<LoanDetailModalProps> = ({ loan, onClose }) => (
//   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
//       <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//         <h3 className="text-lg font-bold text-gray-900">
//           Loan Details — {loan.loanCode || loan.loanNumber || 'N/A'}
//         </h3>
//         <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
//           <X size={20} />
//         </button>
//       </div>
//       <div className="p-6 grid grid-cols-2 gap-4">
//         {[
//           ['Loan Code',     loan.loanCode || loan.loanNumber || 'N/A'],
//           ['Member',        loan.memberNumber || loan.memberId || '—'],
//           ['Product Code',  loan.productCode || '—'],
//           ['Principal',     fmt(loan.principalAmount ?? loan.amount ?? 0)],
//           ['Interest Rate', `${loan.interestRate ?? 0}%`],
//           ['Term',          loan.term ? `${loan.term} months` : '—'],
//           ['Start Date',    loan.startDate ? new Date(loan.startDate).toLocaleDateString() : '—'],
//           ['Maturity Date', loan.maturityDate ? new Date(loan.maturityDate).toLocaleDateString() : '—'],
//           ['Balance (P)',   fmt(loan.balancePrincipal ?? 0)],
//           ['Balance (I)',   fmt(loan.balanceInterest ?? 0)],
//           ['Next Due',      loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString() : 'N/A'],
//           ['Status',        loan.status || 'N/A'],
//         ].map(([label, value]) => (
//           <div key={label}>
//             <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
//             <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
//           </div>
//         ))}
//       </div>
//       <div className="p-6 border-t border-gray-200 flex justify-end">
//         <Button variant="ghost" onClick={onClose}>Close</Button>
//       </div>
//     </div>
//   </div>
// );

// // ── Apply Loan Modal with Dropdowns ───────────────────────────────────
// interface ApplyLoanModalProps {
//   isOpen: boolean;
//   members: Member[];
//   products: LoanProduct[];
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const ApplyLoanModal: React.FC<ApplyLoanModalProps> = ({ isOpen, members, products, onClose, onSuccess }) => {
//   const [formData, setFormData] = useState<ApplyLoanPayload>({
//     memberNumber: '',
//     productCode: '',
//     amount: 0,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);

//   const handleMemberChange = (memberNumber: string) => {
//     setFormData(prev => ({ ...prev, memberNumber }));
//   };

//   const handleProductChange = (productCode: string) => {
//     const product = products.find(p => p.productCode === productCode);
//     setSelectedProduct(product || null);
//     setFormData(prev => ({ ...prev, productCode }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.memberNumber) {
//       toast.error('Please select a member');
//       return;
//     }
//     if (!formData.productCode) {
//       toast.error('Please select a loan product');
//       return;
//     }
//     if (!formData.amount || formData.amount <= 0) {
//       toast.error('Please enter a valid amount');
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       // POST /api/v1/loans/apply — Apply for a new loan
//       await loanApi.applyForLoan(formData);
//       toast.success('Loan application submitted successfully!');
//       onSuccess();
//       onClose();
//       // Reset form
//       setFormData({ memberNumber: '', productCode: '', amount: 0 });
//       setSelectedProduct(null);
//     } catch (err: any) {
//       setError(err.message || 'Failed to apply for loan');
//       toast.error(err.message || 'Failed to apply for loan');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   const activeProducts = products.filter(p => 
//     p.status === true || p.status === 'true' || p.status === 'active' || p.status === undefined
//   );

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
//           <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//             <Plus size={20} className="text-green-600" /> Apply for Loan
//           </h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
//             <X size={20} />
//           </button>
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-6 space-y-5">
//           {error && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
//               <AlertCircle size={16} className="mt-0.5 shrink-0" />
//               <span>{error}</span>
//             </div>
//           )}
          
//           {/* Member Selection Dropdown */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Member *
//             </label>
//             <select
//               value={formData.memberNumber}
//               onChange={(e) => handleMemberChange(e.target.value)}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               required
//             >
//               <option value="">-- Select a Member --</option>
//               {members.map((member) => {
//                 const memberNumber = member.memberNumber || member.id?.toString() || '';
//                 const firstName = member.firstName || member.first_name || '';
//                 const lastName = member.lastName || member.last_name || '';
//                 const email = member.email || '';
                
//                 return (
//                   <option key={memberNumber} value={memberNumber}>
//                     {firstName} {lastName} — {memberNumber} {email ? `(${email})` : ''}
//                   </option>
//                 );
//               })}
//             </select>
//           </div>
          
//           {/* Product Selection Dropdown */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Loan Product *
//             </label>
//             <select
//               value={formData.productCode}
//               onChange={(e) => handleProductChange(e.target.value)}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               required
//             >
//               <option value="">-- Select a Product --</option>
//               {activeProducts.map((product) => {
//                 const productCode = product.productCode || product.id?.toString() || '';
//                 const productName = product.loanProductName || product.name || '';
//                 const interestRate = product.percentage || product.interestRate || 0;
//                 const loanPeriod = product.loanPeriod || 0;
                
//                 return (
//                   <option key={productCode} value={productCode}>
//                     {productName} — {interestRate}% interest, {loanPeriod} months
//                   </option>
//                 );
//               })}
//             </select>
//           </div>
          
//           {/* Product Details Preview */}
//           {selectedProduct && (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//               <p className="text-xs font-semibold text-blue-800 mb-1">Product Details</p>
//               <div className="grid grid-cols-2 gap-2 text-sm">
//                 <div>
//                   <span className="text-gray-600">Interest Rate:</span>
//                   <span className="font-medium ml-1">{selectedProduct.percentage || selectedProduct.interestRate || 0}%</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Loan Period:</span>
//                   <span className="font-medium ml-1">{selectedProduct.loanPeriod || 0} months</span>
//                 </div>
//                 <div className="col-span-2">
//                   <span className="text-gray-600">Product Code:</span>
//                   <span className="font-mono text-xs ml-1">{selectedProduct.productCode}</span>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {/* Amount */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Loan Amount (KES) *
//             </label>
//             <div className="relative">
//               <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="number"
//                 value={formData.amount || ''}
//                 onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
//                 className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 placeholder="50000.00"
//                 min="1000"
//                 step="1000"
//                 required
//               />
//             </div>
//             <p className="mt-1 text-xs text-gray-500">Minimum amount: KES 1,000</p>
//           </div>
          
//           {/* Actions */}
//           <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//             <Button variant="ghost" type="button" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
//               {loading ? 'Submitting...' : 'Apply Now'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // ── Defer Loan Modal ───────────────────────────────────────────────────
// interface DeferLoanModalProps {
//   isOpen: boolean;
//   loanCode: string;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const DeferLoanModal: React.FC<DeferLoanModalProps> = ({ isOpen, loanCode, onClose, onSuccess }) => {
//   const [extensionDays, setExtensionDays] = useState<number>(30);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
    
//     try {
//       // PUT /api/v1/loans/defer?extensionDays=X&loanCode=Y
//       await loanApi.deferLoan(loanCode, extensionDays);
//       toast.success(`Loan deferred by ${extensionDays} days!`);
//       onSuccess();
//       onClose();
//     } catch (err: any) {
//       setError(err.message || 'Failed to defer loan');
//       toast.error(err.message || 'Failed to defer loan');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//         <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//           <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//             <Calendar size={20} className="text-orange-600" /> Defer Loan
//           </h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
//             <X size={20} />
//           </button>
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {error && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
//               {error}
//             </div>
//           )}
          
//           <div>
//             <p className="text-sm text-gray-600 mb-2">
//               Loan Code: <span className="font-medium">{loanCode}</span>
//             </p>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Extension Days *
//             </label>
//             <input
//               type="number"
//               value={extensionDays}
//               onChange={(e) => setExtensionDays(parseInt(e.target.value) || 0)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               min="1"
//               max="365"
//               required
//             />
//             <p className="mt-1 text-xs text-gray-500">Number of days to extend the loan repayment period</p>
//           </div>
          
//           <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//             <Button variant="ghost" type="button" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white">
//               {loading ? 'Processing...' : 'Defer Loan'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // ── Repay Loan Modal ───────────────────────────────────────────────────
// interface RepayLoanModalProps {
//   isOpen: boolean;
//   loanCode: string;
//   currentBalance?: number;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const RepayLoanModal: React.FC<RepayLoanModalProps> = ({ isOpen, loanCode, currentBalance = 0, onClose, onSuccess }) => {
//   const [amount, setAmount] = useState<number>(currentBalance);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!amount || amount <= 0) {
//       toast.error('Please enter a valid amount');
//       return;
//     }
    
//     if (amount > currentBalance) {
//       toast.error(`Amount cannot exceed current balance of ${fmt(currentBalance)}`);
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       // POST /api/v1/loans/repay — Repay a loan
//       await loanApi.repayLoan({ loanCode, amount });
//       toast.success(`Repayment of ${fmt(amount)} successful!`);
//       onSuccess();
//       onClose();
//     } catch (err: any) {
//       setError(err.message || 'Failed to process repayment');
//       toast.error(err.message || 'Failed to process repayment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//         <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//           <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//             <DollarSign size={20} className="text-green-600" /> Repay Loan
//           </h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
//             <X size={20} />
//           </button>
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {error && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
//               {error}
//             </div>
//           )}
          
//           <div>
//             <p className="text-sm text-gray-600 mb-2">
//               Loan Code: <span className="font-medium">{loanCode}</span>
//             </p>
//             <p className="text-sm text-gray-600 mb-4">
//               Outstanding Balance: <span className="font-bold text-gray-900">{fmt(currentBalance)}</span>
//             </p>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Repayment Amount (KES) *
//             </label>
//             <div className="relative">
//               <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="number"
//                 value={amount || ''}
//                 onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 placeholder="Enter amount"
//                 min="1"
//                 max={currentBalance}
//                 step="100"
//                 required
//               />
//             </div>
//             <p className="mt-1 text-xs text-gray-500">Maximum: {fmt(currentBalance)}</p>
//           </div>
          
//           <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//             <Button variant="ghost" type="button" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
//               {loading ? 'Processing...' : 'Make Repayment'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // ── Main LoansList Component ───────────────────────────────────────────
// export const LoansList: React.FC = () => {
//   const [loans, setLoans] = useState<Loan[]>([]);
//   const [members, setMembers] = useState<Member[]>([]);
//   const [products, setProducts] = useState<LoanProduct[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [viewLoan, setViewLoan] = useState<Loan | null>(null);
//   const [showApplyModal, setShowApplyModal] = useState(false);
//   const [deferLoanCode, setDeferLoanCode] = useState<string | null>(null);
//   const [repayLoan, setRepayLoan] = useState<{ code: string; balance: number } | null>(null);
  
//   // Pagination state
//   const [page, setPage] = useState(0);
//   const [size, setSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);

//   // ── Fetch Members ─────────────────────────────────────────────────────
//   const fetchMembers = useCallback(async () => {
//     try {
//       const res = await membersApi.getAllMembers();
//       const membersData = res?.data?.content ?? res?.data?.data?.content ?? res?.data ?? [];
//       setMembers(Array.isArray(membersData) ? membersData : []);
//     } catch (err) {
//       console.error("Failed to fetch members", err);
//       setMembers([]);
//     }
//   }, []);

//   // ── Fetch Products ────────────────────────────────────────────────────
//   const fetchProducts = useCallback(async () => {
//     try {
//       const res = await loanProductApi.listProducts({});
//       const productsData = res?.data?.content ?? res?.data ?? res ?? [];
//       setProducts(Array.isArray(productsData) ? productsData : []);
//     } catch (err) {
//       console.error("Failed to fetch loan products", err);
//       setProducts([]);
//     }
//   }, []);

//   // ── Fetch loans from API ─────────────────────────────────────────────
//   const loadLoans = useCallback(async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       // GET /api/v1/loans?status=&page=&size=
//       const params: ListLoansParams = {
//         status: statusFilter !== 'all' ? statusFilter : undefined,
//         page,
//         size,
//       };
      
//       const response = await loanApi.listLoans(params);
      
//       // Handle different response structures
//       const loanData = response?.data?.content ?? response?.data ?? response?.content ?? response ?? [];
//       setLoans(Array.isArray(loanData) ? loanData : []);
      
//       // Set pagination if available
//       if (response?.totalPages !== undefined) {
//         setTotalPages(response.totalPages);
//       } else if (response?.page?.totalPages !== undefined) {
//         setTotalPages(response.page.totalPages);
//       } else if (response?.data?.totalPages !== undefined) {
//         setTotalPages(response.data.totalPages);
//       }
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch loans');
//       console.error('Error fetching loans:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [statusFilter, page, size]);

//   // Load all data on mount
//   useEffect(() => {
//     fetchMembers();
//     fetchProducts();
//   }, [fetchMembers, fetchProducts]);

//   useEffect(() => {
//     loadLoans();
//   }, [loadLoans]);

//   // ── Filter loans locally (as backup) ─────────────────────────────────
//   const filteredLoans = loans.filter(l => {
//     const q = searchTerm.toLowerCase();
//     const matchSearch = !q ||
//       (l.loanCode ?? '').toLowerCase().includes(q) ||
//       (l.loanNumber ?? '').toLowerCase().includes(q) ||
//       (l.memberNumber ?? '').toLowerCase().includes(q) ||
//       (l.memberId ?? '').toLowerCase().includes(q);
//     return matchSearch;
//   });

//   const totalOutstanding = filteredLoans.reduce(
//     (s, l) => s + (l.balancePrincipal ?? 0) + (l.balanceInterest ?? 0), 
//     0
//   );

//   // ── Get loan status color ────────────────────────────────────────────
//   const getStatusActions = (loan: Loan) => {
//     const status = loan.status?.toUpperCase() || '';
//     const isActive = status === 'ACTIVE' || status === 'APPROVED' || status === 'DISBURSED';
//     const isPending = status === 'PENDING' || status === 'SUBMITTED' || status === 'UNDER_REVIEW';
//     const isClosed = status === 'CLOSED' || status === 'COMPLETED';
//     const isDefaulted = status === 'DEFAULTED' || status === 'WRITTEN_OFF';
    
//     return { isActive, isPending, isClosed, isDefaulted };
//   };

//   return (
//     <div className="space-y-6">
//       {/* Modals */}
//       {viewLoan && (
//         <LoanDetail loan={viewLoan} onClose={() => setViewLoan(null)} />
//       )}
      
//       <ApplyLoanModal
//         isOpen={showApplyModal}
//         members={members}
//         products={products}
//         onClose={() => setShowApplyModal(false)}
//         onSuccess={loadLoans}
//       />
      
//       {deferLoanCode && (
//         <DeferLoanModal
//           isOpen={!!deferLoanCode}
//           loanCode={deferLoanCode}
//           onClose={() => setDeferLoanCode(null)}
//           onSuccess={loadLoans}
//         />
//       )}
      
//       {repayLoan && (
//         <RepayLoanModal
//           isOpen={!!repayLoan}
//           loanCode={repayLoan.code}
//           currentBalance={repayLoan.balance}
//           onClose={() => setRepayLoan(null)}
//           onSuccess={loadLoans}
//         />
//       )}

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <CreditCard size={24} className="text-green-600" /> Loans
//           </h2>
//           <p className="text-gray-500 text-sm mt-1">
//             {filteredLoans.length} loan{filteredLoans.length !== 1 ? 's' : ''} · Outstanding: {fmt(totalOutstanding)}
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Button 
//             onClick={() => setShowApplyModal(true)} 
//             className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
//           >
//             <Plus size={16} /> Apply for Loan
//           </Button>
//           <Button variant="ghost" size="sm" onClick={loadLoans} className="flex items-center gap-1">
//             <RefreshCw size={14} /> Refresh
//           </Button>
//         </div>
//       </div>

//       {/* Error banner */}
//       {error && (
//         <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
//           <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
//           <p className="text-red-700 text-sm">{error}</p>
//         </div>
//       )}

//       {/* Filters */}
//       <Card>
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//             <input 
//               type="text" 
//               placeholder="Search by loan code or member…"
//               value={searchTerm} 
//               onChange={e => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" 
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <Filter size={16} className="text-gray-400" />
//             <select 
//               value={statusFilter} 
//               onChange={e => setStatusFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
//             >
//               <option value="all">All Status</option>
//               <option value="ACTIVE">Active</option>
//               <option value="PENDING">Pending</option>
//               <option value="APPROVED">Approved</option>
//               <option value="DISBURSED">Disbursed</option>
//               <option value="CLOSED">Closed</option>
//               <option value="DEFAULTED">Defaulted</option>
//               <option value="WRITTEN_OFF">Written Off</option>
//               <option value="DEFERRED">Deferred</option>
//             </select>
//           </div>
//         </div>
//       </Card>

//       {/* Loans Table */}
//       <Card padding="sm">
//         {loading ? (
//           <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
//         ) : filteredLoans.length === 0 ? (
//           <div className="text-center py-16 text-gray-400">
//             <CreditCard size={40} className="mx-auto mb-3 text-gray-300" />
//             <p className="font-medium">No loans found</p>
//             <p className="text-sm">Click "Apply for Loan" to get started.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   {['Loan Code', 'Member', 'Principal', 'Balance', 'Rate', 'Status', 'Next Due', 'Actions'].map(h => (
//                     <th key={h} className="text-left py-3 px-4 text-sm font-medium text-gray-700">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredLoans.map((loan) => {
//                   const { isActive, isPending, isClosed, isDefaulted } = getStatusActions(loan);
//                   const totalBalance = (loan.balancePrincipal ?? 0) + (loan.balanceInterest ?? 0);
                  
//                   return (
//                     <tr key={loan.id || loan.loanCode} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                       <td className="py-3 px-4">
//                         <p className="font-medium text-gray-900 text-sm">
//                           {loan.loanCode || loan.loanNumber || 'N/A'}
//                         </p>
//                         <p className="text-xs text-gray-500">{loan.productCode || ''}</p>
//                       </td>
//                       <td className="py-3 px-4 text-sm text-gray-700">
//                         {loan.memberNumber || loan.memberId || '—'}
//                       </td>
//                       <td className="py-3 px-4 text-sm font-medium text-gray-900">
//                         {fmt(loan.principalAmount ?? loan.amount ?? 0)}
//                       </td>
//                       <td className="py-3 px-4">
//                         <p className="text-sm text-gray-900">P: {fmt(loan.balancePrincipal ?? 0)}</p>
//                         <p className="text-xs text-gray-500">I: {fmt(loan.balanceInterest ?? 0)}</p>
//                       </td>
//                       <td className="py-3 px-4 text-sm text-gray-700">{loan.interestRate ?? 0}%</td>
//                       <td className="py-3 px-4">
//                         <StatusBadge status={loan.status || 'UNKNOWN'} variant="loan" />
//                       </td>
//                       <td className="py-3 px-4 text-sm text-gray-600">
//                         {loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString() : 'N/A'}
//                       </td>
//                       <td className="py-3 px-4">
//                         <div className="flex flex-wrap items-center gap-2">
//                           {/* View Details */}
//                           <button 
//                             onClick={() => setViewLoan(loan)}
//                             className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium transition-colors"
//                             title="View loan details"
//                           >
//                             <Eye size={13} /> View
//                           </button>
                          
//                           {/* Repay Button - for active loans with balance */}
//                           {isActive && totalBalance > 0 && (
//                             <button 
//                               onClick={() => setRepayLoan({ code: loan.loanCode || loan.loanNumber || '', balance: totalBalance })}
//                               className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
//                               title="Make repayment"
//                             >
//                               <DollarSign size={13} /> Repay
//                             </button>
//                           )}
                          
//                           {/* Defer Button - only for active loans */}
//                           {isActive && (
//                             <button 
//                               onClick={() => setDeferLoanCode(loan.loanCode || loan.loanNumber || '')}
//                               className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 font-medium transition-colors"
//                               title="Defer loan repayment"
//                             >
//                               <Calendar size={13} /> Defer
//                             </button>
//                           )}
                          
//                           {/* Pending Approval Badge */}
//                           {isPending && (
//                             <span className="text-xs text-yellow-600 flex items-center gap-1">
//                               <AlertCircle size={12} /> Awaiting Approval
//                             </span>
//                           )}
                          
//                           {/* Closed/Completed Badge */}
//                           {isClosed && (
//                             <span className="text-xs text-gray-500 flex items-center gap-1">
//                               <CheckCircle size={12} /> Completed
//                             </span>
//                           )}
                          
//                           {/* Defaulted Badge */}
//                           {isDefaulted && (
//                             <span className="text-xs text-red-600 flex items-center gap-1">
//                               <XCircle size={12} /> Defaulted
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
        
//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
//             <div className="text-sm text-gray-600">
//               Page {page + 1} of {totalPages}
//             </div>
//             <div className="flex gap-2">
//               <Button 
//                 variant="ghost" 
//                 size="sm" 
//                 onClick={() => setPage(Math.max(0, page - 1))}
//                 disabled={page === 0}
//               >
//                 Previous
//               </Button>
//               <Button 
//                 variant="ghost" 
//                 size="sm" 
//                 onClick={() => setPage(page + 1)}
//                 disabled={page >= totalPages - 1}
//               >
//                 Next
//               </Button>
//             </div>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// };



import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Search, Filter, Eye, CreditCard, RefreshCw, AlertCircle, X, Plus, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { loanApi, membersApi, loanProductApi } from '../../services/api';
import type { ApplyLoanPayload, ListLoansParams } from '../../services/api';
import toast from 'react-hot-toast';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

// ── Type definitions ────────────────────────────────────────────────────
interface Loan {
  id?: number;
  loanCode?: string;
  loanNumber?: string;
  memberNumber?: string;
  memberId?: string;
  productCode?: string;
  principalAmount?: number;
  interestRate?: number;
  term?: number;
  status?: string;
  startDate?: string;
  maturityDate?: string;
  balancePrincipal?: number;
  balanceInterest?: number;
  nextDueDate?: string;
  amount?: number;
  createdAt?: string;
}

interface Member {
  id?: number;
  memberNumber?: string;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  status?: string;
}

interface LoanProduct {
  id?: number;
  productCode?: string;
  loanProductName?: string;
  name?: string;
  percentage?: number;
  interestRate?: number;
  loanPeriod?: number;
  status?: string | boolean;
}

// ── Loan Detail Modal ──────────────────────────────────────────────────
interface LoanDetailModalProps { 
  loan: Loan; 
  onClose: () => void; 
}

const LoanDetail: React.FC<LoanDetailModalProps> = ({ loan, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">
          Loan Details — {loan.loanCode || loan.loanNumber || 'N/A'}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="p-6 grid grid-cols-2 gap-4">
        {[
          ['Loan Code',     loan.loanCode || loan.loanNumber || 'N/A'],
          ['Member',        loan.memberNumber || loan.memberId || '—'],
          ['Product Code',  loan.productCode || '—'],
          ['Principal',     fmt(loan.principalAmount ?? loan.amount ?? 0)],
          ['Interest Rate', `${loan.interestRate ?? 0}%`],
          ['Term',          loan.term ? `${loan.term} months` : '—'],
          ['Start Date',    loan.startDate ? new Date(loan.startDate).toLocaleDateString() : '—'],
          ['Maturity Date', loan.maturityDate ? new Date(loan.maturityDate).toLocaleDateString() : '—'],
          ['Balance (P)',   fmt(loan.balancePrincipal ?? 0)],
          ['Balance (I)',   fmt(loan.balanceInterest ?? 0)],
          ['Next Due',      loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString() : 'N/A'],
          ['Status',        loan.status || 'N/A'],
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

// ── Apply Loan Modal with Dropdowns ───────────────────────────────────
interface ApplyLoanModalProps {
  isOpen: boolean;
  members: Member[];
  products: LoanProduct[];
  onClose: () => void;
  onSuccess: () => void;
}

const ApplyLoanModal: React.FC<ApplyLoanModalProps> = ({ isOpen, members, products, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<ApplyLoanPayload>({
    memberNumber: '',
    productCode: '',
    amount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);

  const handleMemberChange = (memberNumber: string) => {
    setFormData(prev => ({ ...prev, memberNumber }));
  };

  const handleProductChange = (productCode: string) => {
    const product = products.find(p => p.productCode === productCode);
    setSelectedProduct(product || null);
    setFormData(prev => ({ ...prev, productCode }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.memberNumber) {
      toast.error('Please select a member');
      return;
    }
    if (!formData.productCode) {
      toast.error('Please select a loan product');
      return;
    }
    if (!formData.amount || formData.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // POST /api/v1/loans/apply — Apply for a new loan
      await loanApi.applyForLoan(formData);
      toast.success('Loan application submitted successfully!');
      onSuccess();
      onClose();
      // Reset form
      setFormData({ memberNumber: '', productCode: '', amount: 0 });
      setSelectedProduct(null);
    } catch (err: any) {
      setError(err.message || 'Failed to apply for loan');
      toast.error(err.message || 'Failed to apply for loan');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const activeProducts = products.filter(p => 
    p.status === true || p.status === 'true' || p.status === 'active' || p.status === undefined
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Plus size={20} className="text-green-600" /> Apply for Loan
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Member Selection Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Member *
            </label>
            <select
              value={formData.memberNumber}
              onChange={(e) => handleMemberChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">-- Select a Member --</option>
              {members.map((member) => {
                const memberNumber = member.memberNumber || member.id?.toString() || '';
                const firstName = member.firstName || member.first_name || '';
                const lastName = member.lastName || member.last_name || '';
                const email = member.email || '';
                
                return (
                  <option key={memberNumber} value={memberNumber}>
                    {firstName} {lastName} — {memberNumber} {email ? `(${email})` : ''}
                  </option>
                );
              })}
            </select>
          </div>
          
          {/* Product Selection Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Loan Product *
            </label>
            <select
              value={formData.productCode}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">-- Select a Product --</option>
              {activeProducts.map((product) => {
                const productCode = product.productCode || product.id?.toString() || '';
                const productName = product.loanProductName || product.name || '';
                const interestRate = product.percentage || product.interestRate || 0;
                const loanPeriod = product.loanPeriod || 0;
                
                return (
                  <option key={productCode} value={productCode}>
                    {productName} — {interestRate}% interest, {loanPeriod} months
                  </option>
                );
              })}
            </select>
          </div>
          
          {/* Product Details Preview */}
          {selectedProduct && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-800 mb-1">Product Details</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Interest Rate:</span>
                  <span className="font-medium ml-1">{selectedProduct.percentage || selectedProduct.interestRate || 0}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Loan Period:</span>
                  <span className="font-medium ml-1">{selectedProduct.loanPeriod || 0} months</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Product Code:</span>
                  <span className="font-mono text-xs ml-1">{selectedProduct.productCode}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount (KES) *
            </label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="50000.00"
                min="1000"
                step="1000"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Minimum amount: KES 1,000</p>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
              {loading ? 'Submitting...' : 'Apply Now'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Defer Loan Modal ───────────────────────────────────────────────────
interface DeferLoanModalProps {
  isOpen: boolean;
  loanCode: string;
  onClose: () => void;
  onSuccess: () => void;
}

const DeferLoanModal: React.FC<DeferLoanModalProps> = ({ isOpen, loanCode, onClose, onSuccess }) => {
  const [extensionDays, setExtensionDays] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // PUT /api/v1/loans/defer?extensionDays=X&loanCode=Y
      await loanApi.deferLoan(loanCode, extensionDays);
      toast.success(`Loan deferred by ${extensionDays} days!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to defer loan');
      toast.error(err.message || 'Failed to defer loan');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={20} className="text-orange-600" /> Defer Loan
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Loan Code: <span className="font-medium">{loanCode}</span>
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Extension Days *
            </label>
            <input
              type="number"
              value={extensionDays}
              onChange={(e) => setExtensionDays(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="1"
              max="365"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Number of days to extend the loan repayment period</p>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white">
              {loading ? 'Processing...' : 'Defer Loan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Repay Loan Modal ───────────────────────────────────────────────────
interface RepayLoanModalProps {
  isOpen: boolean;
  loanCode: string;
  currentBalance?: number;
  onClose: () => void;
  onSuccess: () => void;
}

const RepayLoanModal: React.FC<RepayLoanModalProps> = ({ isOpen, loanCode, currentBalance = 0, onClose, onSuccess }) => {
  const [amount, setAmount] = useState<number>(currentBalance);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (amount > currentBalance) {
      toast.error(`Amount cannot exceed current balance of ${fmt(currentBalance)}`);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // POST /api/v1/loans/repay — Repay a loan
      await loanApi.repayLoan({ loanCode, amount });
      toast.success(`Repayment of ${fmt(amount)} successful!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to process repayment');
      toast.error(err.message || 'Failed to process repayment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <DollarSign size={20} className="text-green-600" /> Repay Loan
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Loan Code: <span className="font-medium">{loanCode}</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Outstanding Balance: <span className="font-bold text-gray-900">{fmt(currentBalance)}</span>
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repayment Amount (KES) *
            </label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter amount"
                min="1"
                max={currentBalance}
                step="100"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Maximum: {fmt(currentBalance)}</p>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
              {loading ? 'Processing...' : 'Make Repayment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main LoansList Component ───────────────────────────────────────────
export const LoansList: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewLoan, setViewLoan] = useState<Loan | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [deferLoanCode, setDeferLoanCode] = useState<string | null>(null);
  const [repayModal, setRepayModal] = useState<{ code: string; balance: number } | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [size, _setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // ── Fetch Members ─────────────────────────────────────────────────────
  const fetchMembers = useCallback(async () => {
    try {
      const res = await membersApi.getAllMembers();
      const membersData = res?.data?.content ?? res?.data?.data?.content ?? res?.data ?? [];
      setMembers(Array.isArray(membersData) ? membersData : []);
    } catch (err) {
      console.error("Failed to fetch members", err);
      setMembers([]);
    }
  }, []);

  // ── Fetch Products ────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    try {
      const res = await loanProductApi.listProducts({});
      const productsData = res?.data?.content ?? res?.data ?? res ?? [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      console.error("Failed to fetch loan products", err);
      setProducts([]);
    }
  }, []);

  // ── Fetch loans from API ─────────────────────────────────────────────
  const loadLoans = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // GET /api/v1/loans?status=&page=&size=
      const params: ListLoansParams = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page,
        size,
      };
      
      const response = await loanApi.listLoans(params);
      
      // Handle different response structures
      const loanData = response?.data?.content ?? response?.data ?? response?.content ?? response ?? [];
      setLoans(Array.isArray(loanData) ? loanData : []);
      
      // Set pagination if available
      if (response?.totalPages !== undefined) {
        setTotalPages(response.totalPages);
      } else if (response?.page?.totalPages !== undefined) {
        setTotalPages(response.page.totalPages);
      } else if (response?.data?.totalPages !== undefined) {
        setTotalPages(response.data.totalPages);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch loans');
      console.error('Error fetching loans:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page, size]);

  // Load all data on mount
  useEffect(() => {
    fetchMembers();
    fetchProducts();
  }, [fetchMembers, fetchProducts]);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  // ── Filter loans locally (as backup) ─────────────────────────────────
  const filteredLoans = loans.filter(l => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q ||
      (l.loanCode ?? '').toLowerCase().includes(q) ||
      (l.loanNumber ?? '').toLowerCase().includes(q) ||
      (l.memberNumber ?? '').toLowerCase().includes(q) ||
      (l.memberId ?? '').toLowerCase().includes(q);
    return matchSearch;
  });

  const totalOutstanding = filteredLoans.reduce(
    (s, l) => s + (l.balancePrincipal ?? 0) + (l.balanceInterest ?? 0), 
    0
  );

  // ── Get loan status color ────────────────────────────────────────────
  const getStatusActions = (loan: Loan) => {
    const status = loan.status?.toUpperCase() || '';
    const isActive = ['ACTIVE', 'APPROVED', 'DISBURSED', 'RUNNING'].includes(status);
    const isPending = ['PENDING', 'SUBMITTED', 'UNDER_REVIEW', 'PROCESSING'].includes(status);
    const isClosed = ['CLOSED', 'COMPLETED', 'SETTLED', 'PAID_OFF'].includes(status);
    const isDefaulted = ['DEFAULTED', 'WRITTEN_OFF', 'NON_PERFORMING'].includes(status);
    const isDeferred = status === 'DEFERRED';
    
    return { isActive, isPending, isClosed, isDefaulted, isDeferred };
  };

  return (
    <div className="space-y-6">
      {/* Modals */}
      {viewLoan && (
        <LoanDetail loan={viewLoan} onClose={() => setViewLoan(null)} />
      )}
      
      <ApplyLoanModal
        isOpen={showApplyModal}
        members={members}
        products={products}
        onClose={() => setShowApplyModal(false)}
        onSuccess={loadLoans}
      />
      
      {deferLoanCode && (
        <DeferLoanModal
          isOpen={!!deferLoanCode}
          loanCode={deferLoanCode}
          onClose={() => setDeferLoanCode(null)}
          onSuccess={loadLoans}
        />
      )}
      
      {repayModal && (
        <RepayLoanModal
          isOpen={!!repayModal}
          loanCode={repayModal.code}
          currentBalance={repayModal.balance}
          onClose={() => setRepayModal(null)}
          onSuccess={loadLoans}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard size={24} className="text-green-600" /> Loans
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {filteredLoans.length} loan{filteredLoans.length !== 1 ? 's' : ''} · Outstanding: {fmt(totalOutstanding)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowApplyModal(true)} 
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Plus size={16} /> Apply for Loan
          </Button>
          <Button variant="ghost" size="sm" onClick={loadLoans} className="flex items-center gap-1">
            <RefreshCw size={14} /> Refresh
          </Button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
          <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by loan code or member…"
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm" 
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="DISBURSED">Disbursed</option>
              <option value="CLOSED">Closed</option>
              <option value="DEFAULTED">Defaulted</option>
              <option value="WRITTEN_OFF">Written Off</option>
              <option value="DEFERRED">Deferred</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Loans Table */}
      <Card padding="sm">
        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : filteredLoans.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <CreditCard size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No loans found</p>
            <p className="text-sm">Click "Apply for Loan" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Loan Code', 'Member', 'Principal', 'Balance', 'Rate', 'Status', 'Next Due', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-sm font-medium text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => {
                  // const { isActive, isPending, isClosed, isDefaulted } = getStatusActions(loan);
                  const { isActive, isPending, isClosed, isDefaulted, isDeferred } = getStatusActions(loan);
                  const totalBalance = (loan.balancePrincipal ?? 0) + (loan.balanceInterest ?? 0);
                  
                  return (
                    <tr key={loan.id || loan.loanCode} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900 text-sm">
                          {loan.loanCode || loan.loanNumber || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">{loan.productCode || ''}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {loan.memberNumber || loan.memberId || '—'}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {fmt(loan.principalAmount ?? loan.amount ?? 0)}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-900">P: {fmt(loan.balancePrincipal ?? 0)}</p>
                        <p className="text-xs text-gray-500">I: {fmt(loan.balanceInterest ?? 0)}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{loan.interestRate ?? 0}%</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={loan.status || 'UNKNOWN'} variant="loan" />
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* View Details */}
                          <button 
                            onClick={() => setViewLoan(loan)}
                            className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium transition-colors"
                            title="View loan details"
                          >
                            <Eye size={13} /> View
                          </button>
                          
                          {/* Repay Button - for active loans with balance */}
                          {isActive && totalBalance > 0 && (
                            <button 
                              onClick={() => setRepayModal({ code: loan.loanCode || loan.loanNumber || '', balance: totalBalance })}
                              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                              title="Make repayment"
                            >
                              <DollarSign size={13} /> Repay
                            </button>
                          )}
                          
                          {/* Defer Button - only for active loans */}
                          {isActive && (
                            <button 
                              onClick={() => setDeferLoanCode(loan.loanCode || loan.loanNumber || '')}
                              className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 font-medium transition-colors"
                              title="Defer loan repayment"
                            >
                              <Calendar size={13} /> Defer
                            </button>
                          )}
                          
                          {/* Pending Approval Badge */}
                          {isPending && (
                            <span className="text-xs text-yellow-600 flex items-center gap-1">
                              <AlertCircle size={12} /> Awaiting Approval
                            </span>
                          )}
                          
                          {/* Closed/Completed Badge */}
                          {isClosed && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <CheckCircle size={12} /> Completed
                            </span>
                          )}
                          
                          {/* Defaulted Badge */}
                          {isDefaulted && (
                            <span className="text-xs text-red-600 flex items-center gap-1">
                              <XCircle size={12} /> Defaulted
                            </span>
                          )}
                          
                          {/* Deferred Badge */}
                          {isDeferred && (
                            <span className="text-xs text-orange-500 flex items-center gap-1">
                              <Calendar size={12} /> Deferred
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Page {page + 1} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};