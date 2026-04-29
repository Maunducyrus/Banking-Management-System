// import React, { useState, useEffect } from 'react';
// import { Card } from '../ui/Card';
// import { Button } from '../ui/Button';
// import { StatusBadge } from '../ui/StatusBadge';
// import { Search, Filter, Eye, CheckCircle, XCircle, Plus } from 'lucide-react';
// import type { LoanApplication } from '../../types';
// import { getStorageData, updateApplication } from '../../utils/LocalStorage';
// import toast from 'react-hot-toast';
// import { membersApi } from '../../services/api';

// export const ApplicationsList: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [showAddApplication, setShowAddApplication] = useState(false);
//   const [applications, setApplications] = useState<LoanApplication[]>([]);
//   const [newApplication, setNewApplication] = useState({
//     memberId: '',
//     productId: '',
//     amountRequested: '',
//     term: '',
//     purpose: ''
//   });

//   // Load data from localStorage
//   React.useEffect(() => {
//     const data = getStorageData();
//     setApplications(data.applications);
//   }, []);

//   // const members = getStorageData().users;

//   //getting member from backend
//   const [members, setMembers] = useState<any[]>([]);

// useEffect(() => {
//   const fetchMembers = async () => {
//     try {
//       const res = await membersApi.getAllMembers();

//       console.log("MEMBERS:", res.data);

//       const membersData =
//         res?.data?.content ??
//         res?.data?.data?.content ??
//         [];

//       setMembers(Array.isArray(membersData) ? membersData : []);
//     } catch (error) {
//       console.error("Failed to fetch members", error);
//       setMembers([]);
//     }
//   };

//   fetchMembers();
// }, []);
//   const products = getStorageData().products;

//   const filteredApplications = applications.filter(app => {
//     const matchesSearch = 
//       app.id.includes(searchTerm) ||
//       app.memberId.includes(searchTerm) ||
//       app.purpose.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   const handleAddApplication = () => {
//     if (!newApplication.memberId || !newApplication.productId || !newApplication.amountRequested || !newApplication.term || !newApplication.purpose) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     const application = {
//       ...newApplication,
//       amountRequested: parseFloat(newApplication.amountRequested),
//       term: parseInt(newApplication.term),
//       status: 'submitted',
//       creditScore: Math.floor(Math.random() * 200) + 600,
//       applicationData: {},
//       submittedBy: 'admin'
//     };

//     const data = getStorageData();
//     const updatedApplications = [
//   ...(data.applications || []),
//   {
//     ...application,
//     id: Date.now().toString(),
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   }
// ];
//     // const updatedApplications = [...data.applications, {
//     //   ...application,
//     //   id: Date.now().toString(),
//     //   createdAt: new Date().toISOString(),
//     //   updatedAt: new Date().toISOString()
//     // }];
    
//     data.applications = updatedApplications;
//     localStorage.setItem('p2p_loan_data', JSON.stringify(data));
//     setApplications(updatedApplications);
    
//     setNewApplication({
//       memberId: '',
//       productId: '',
//       amountRequested: '',
//       term: '',
//       purpose: ''
//     });
//     setShowAddApplication(false);
//     toast.success('Loan application created successfully!');
//   };

//   const handleStatusChange = (applicationId: string, newStatus: string) => {
//     updateApplication(applicationId, { status: newStatus });
//     const data = getStorageData();
//     setApplications(data.applications);
//     toast.success(`Application ${newStatus} successfully!`);
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-KE', {
//       style: 'currency',
//       currency: 'KSH'
//     }).format(amount);
//   };

//   const getCreditScoreColor = (score: number | undefined) => {
//     if (!score) return 'text-gray-500';
//     if (score >= 750) return 'text-green-600';
//     if (score >= 700) return 'text-blue-600';
//     if (score >= 650) return 'text-yellow-600';
//     return 'text-red-600';
//   };

  
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Loan Applications</h2>
//           <p className="text-gray-600">Review and process loan applications - {filteredApplications.length} applications found</p>
//         </div>
//         <Button 
//           onClick={() => setShowAddApplication(true)}
//           className="flex items-center gap-2"
//         >
//           <Plus size={16} />
//           Add Application
//         </Button>
//       </div>

//       {/* Add Application Form */}
//       {showAddApplication && (
//         <Card>
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Loan Application</h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Member *
//               </label>
//               <select
//                 value={newApplication.memberId}
//                 onChange={(e) => setNewApplication(prev => ({ ...prev, memberId: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select Member</option>
//                 {/* {members.map(member => (
//                   <option key={member.id} value={member.id}>
//                     {member.firstName} {member.lastName} - {member.email}
//                   </option>
//                 ))} */}
//                 {members?.map((member: any) => {
//                   const id = member.memberNumber ?? member.id;
//                   const firstName = member.firstName ?? member.first_name ?? '';
//                   const lastName = member.lastName ?? member.last_name ?? '';
//                   const email = member.email ?? '';

//                   return (
//                     <option key={id} value={id}>
//                       {firstName} {lastName} - {email}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Loan Product *
//               </label>
//               <select
//                 value={newApplication.productId}
//                 onChange={(e) => setNewApplication(prev => ({ ...prev, productId: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select Product</option>
//                 {products.map(product => (
//                   <option key={product.id} value={product.id}>
//                     {product.name} - {product.interestRate}%
//                   </option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Amount Requested *
//               </label>
//               <input
//                 type="number"
//                 value={newApplication.amountRequested}
//                 onChange={(e) => setNewApplication(prev => ({ ...prev, amountRequested: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter amount"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Term (months) *
//               </label>
//               <input
//                 type="number"
//                 value={newApplication.term}
//                 onChange={(e) => setNewApplication(prev => ({ ...prev, term: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter term"
//               />
//             </div>
            
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Purpose *
//               </label>
//               <textarea
//                 value={newApplication.purpose}
//                 onChange={(e) => setNewApplication(prev => ({ ...prev, purpose: e.target.value }))}
//                 rows={3}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Describe the purpose of this loan"
//               />
//             </div>
//           </div>
          
//           <div className="flex justify-end gap-4 mt-6">
//             <Button variant="ghost" onClick={() => setShowAddApplication(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleAddApplication}>
//               Create Application
//             </Button>
//           </div>
//         </Card>
//       )}

//       {/* Filters */}
//       <Card>
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//               <input
//                 type="text"
//                 placeholder="Search applications..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Filter size={16} className="text-gray-400" />
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="all">All Status</option>
//               <option value="draft">Draft</option>
//               <option value="submitted">Submitted</option>
//               <option value="under_review">Under Review</option>
//               <option value="approved">Approved</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>
//         </div>
//       </Card>

//       {/* Applications Table */}
//       <Card padding="sm">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">Application</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">Member</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">Purpose</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">Credit Score</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
//                 <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredApplications.map((application) => (
//                 <tr key={application.id} className="border-b border-gray-100 hover:bg-gray-50">
//                   <td className="py-3 px-4">
//                     <div>
//                       <p className="font-medium text-gray-900">#{application.id}</p>
//                       <p className="text-sm text-gray-600">{application.term} months</p>
//                     </div>
//                   </td>
//                   {/* <td className="py-3 px-4">
//                     <p className="text-sm text-gray-900">ID: {application.memberId}</p>
//                   </td> */}
//                   <td className="py-3 px-4">
//                     <p className="text-sm text-gray-900">
//                       {(() => {
//                         const member = members.find(
//                           m =>
//                             m.id === application.memberId ||
//                             m.memberNumber === application.memberId
//                         );

//                         return member
//                           ? `${member.firstName} ${member.lastName} (${member.memberNumber})`
//                           : `ID: ${application.memberId}`;
//                       })()}
//                     </p>
//                   </td>                
//                   <td className="py-3 px-4">
//                     <p className="font-medium text-gray-900">
//                       {formatCurrency(application.amountRequested)}
//                     </p>
//                   </td>
//                   <td className="py-3 px-4">
//                     <p className="text-sm text-gray-900">{application.purpose}</p>
//                   </td>
//                   <td className="py-3 px-4">
//                     <p className={`font-medium ${getCreditScoreColor(application.creditScore)}`}>
//                       {application.creditScore || 'N/A'}
//                     </p>
//                   </td>
//                   <td className="py-3 px-4">
//                     <StatusBadge status={application.status} variant="application" />
//                   </td>
//                   <td className="py-3 px-4">
//                     <p className="text-sm text-gray-900">
//                       {new Date(application.createdAt).toLocaleDateString()}
//                     </p>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="flex items-center gap-1">
//                       <Button variant="ghost" size="sm" className="flex items-center gap-1">
//                         <Eye size={14} />
//                         View
//                       </Button>
//                       {application.status === 'under_review' && (
//                         <>
//                           <Button 
//                             variant="ghost" 
//                             size="sm" 
//                             className="flex items-center gap-1 text-green-600 hover:text-green-700"
//                             onClick={() => handleStatusChange(application.id, 'approved')}
//                           >
//                             <CheckCircle size={14} />
//                             Approve
//                           </Button>
//                           <Button 
//                             variant="ghost" 
//                             size="sm" 
//                             className="flex items-center gap-1 text-red-600 hover:text-red-700"
//                             onClick={() => handleStatusChange(application.id, 'rejected')}
//                           >
//                             <XCircle size={14} />
//                             Reject
//                           </Button>
//                         </>
//                         // <>
//                         //   <Button variant="ghost" size="sm" className="flex items-center gap-1 text-green-600 hover:text-green-700">
//                         //     onClick={() => handleStatusChange(application.id, 'approved')}
//                         //     <CheckCircle size={14} />
//                         //     Approve
//                         //   </Button>
//                         //   <Button variant="ghost" size="sm" className="flex items-center gap-1 text-red-600 hover:text-red-700">
//                         //     onClick={() => handleStatusChange(application.id, 'rejected')}
//                         //     <XCircle size={14} />
//                         //     Reject
//                         //   </Button>
//                         // </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {filteredApplications.length === 0 && (
//           <div className="text-center py-8">
//             <p className="text-gray-500">No applications found matching your criteria.</p>
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
// import { Search, Filter, Eye, CheckCircle, XCircle, Plus, RefreshCw, AlertCircle, X } from 'lucide-react';
// import { loanApi, membersApi, loanProductApi } from '../../services/api'; // Adjust path
// import type { ApplyLoanPayload } from '../../services/api'; // Adjust path
// import toast from 'react-hot-toast';

// // ── Types ──────────────────────────────────────────────────────────────
// interface LoanApplication {
//   id?: number | string;
//   applicationId?: string;
//   loanCode?: string;
//   memberNumber?: string;
//   memberId?: string;
//   productCode?: string;
//   productId?: string;

//   principalAmount?: number;
//   loanStatus?: string;
//   dateBorrowed?: string;
//   amountRequested?: number;
//   amount?: number;
//   term?: number;
//   purpose?: string;
//   status?: string;
//   creditScore?: number;
//   interestRate?: number;
//   createdAt?: string;
//   updatedAt?: string;
//   submittedBy?: string;
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

// // ── Application Detail Modal ───────────────────────────────────────────
// interface ApplicationDetailModalProps {
//   application: LoanApplication;
//   members: Member[];
//   products: LoanProduct[];
//   onClose: () => void;
// }

// const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({ 
//   application, members, products, onClose 
// }) => {
//   const member = members.find(m => 
//     m.memberNumber === application.memberNumber || 
//     m.id?.toString() === application.memberId
//   );
  
//   const product = products.find(p => 
//     p.productCode === application.productCode || 
//     p.id?.toString() === application.productId
//   );

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-KE', {
//       style: 'currency',
//       currency: 'KES'
//     }).format(amount);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
//           <h3 className="text-lg font-bold text-gray-900">
//             Application Details — {application.applicationId || application.loanCode || `#${application.id}`}
//           </h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
//             <X size={20} />
//           </button>
//         </div>
//         <div className="p-6 space-y-6">
//           {/* Status Banner */}
//           <div className={`p-4 rounded-lg ${
//             application.status === 'APPROVED' ? 'bg-green-50 border border-green-200' :
//             application.status === 'REJECTED' ? 'bg-red-50 border border-red-200' :
//             application.status === 'UNDER_REVIEW' ? 'bg-yellow-50 border border-yellow-200' :
//             'bg-blue-50 border border-blue-200'
//           }`}>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-semibold text-gray-900">Status: {application.status}</p>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Applied: {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}
//                 </p>
//               </div>
//               {/* <StatusBadge status={application.status || 'UNKNOWN'} variant="application" /> */}
//               <StatusBadge status={application.loanStatus || 'SUBMITTED'} />
//             </div>
//           </div>

//           {/* Member Information */}
//           <div>
//             <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Member Information</h4>
//             <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
//               <div>
//                 <p className="text-xs text-gray-500">Name</p>
//                 <p className="text-sm font-medium text-gray-900">
//                   {member ? `${member.firstName || member.first_name} ${member.lastName || member.last_name}` : 'N/A'}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Member Number</p>
//                 <p className="text-sm font-medium text-gray-900">{application.memberNumber || application.memberId || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Email</p>
//                 <p className="text-sm font-medium text-gray-900">{member?.email || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Phone</p>
//                 <p className="text-sm font-medium text-gray-900">{member?.phone || 'N/A'}</p>
//               </div>
//             </div>
//           </div>

//           {/* Loan Details */}
//           <div>
//             <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Loan Details</h4>
//             <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
//               <div>
//                 <p className="text-xs text-gray-500">Product</p>
//                 <p className="text-sm font-medium text-gray-900">
//                   {product ? (product.loanProductName || product.name) : (application.productCode || 'N/A')}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Amount Requested</p>
//                 <p className="text-sm font-semibold text-gray-900">
//                   {/* {formatCurrency(application.amountRequested || application.amount || 0)} */}
//                   { formatCurrency(
//                   application.principalAmount ??
//                   application.amountRequested ??
//                   application.amount ??
//                   0
//                 ) }
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Term</p>
//                 <p className="text-sm font-medium text-gray-900">{application.term || 'N/A'} months</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Interest Rate</p>
//                 <p className="text-sm font-medium text-gray-900">
//                   {application.interestRate || product?.percentage || product?.interestRate || 'N/A'}%
//                 </p>
//               </div>
//               {application.purpose && (
//                 <div className="col-span-2">
//                   <p className="text-xs text-gray-500">Purpose</p>
//                   <p className="text-sm font-medium text-gray-900">{application.purpose}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="p-6 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white">
//           <Button variant="ghost" onClick={onClose}>Close</Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── Apply Loan Modal ───────────────────────────────────────────────────
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
//   const [purpose, setPurpose] = useState('');

//   const handleMemberChange = (memberNumber: string) => {
//     setFormData(prev => ({ ...prev, memberNumber }));
//   };

//   const handleProductChange = (productCode: string) => {
//     setFormData(prev => ({ ...prev, productCode }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Validation
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
//     //Debug
//   console.log('APPLY PAYLOAD:', formData);

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
//       setPurpose('');
//     } catch (err: any) {
//       const errorMessage = err.message || 'Failed to submit application';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   // Filter only active products
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
          
//           {/* Member Selection */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Member *
//             </label>
//             <select
//               value={formData.memberNumber}
//               onChange={(e) => handleMemberChange(e.target.value)}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               required
//             >
//               <option value="">Select Member</option>
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
          
//           {/* Product Selection */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Loan Product *
//             </label>
//             <select
//               value={formData.productCode}
//               onChange={(e) => handleProductChange(e.target.value)}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               required
//             >
//               <option value="">Select Product</option>
//               {activeProducts.map((product) => {
//                 const productCode = product.productCode || product.id?.toString() || '';
//                 const productName = product.loanProductName || product.name || '';
//                 const interestRate = product.percentage || product.interestRate || 0;
                
//                 return (
//                   <option key={productCode} value={productCode}>
//                     {productName} — {interestRate}% interest
//                   </option>
//                 );
//               })}
//             </select>
//           </div>
          
//           {/* Amount */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Amount (KES) *
//             </label>
//             <input
//               type="number"
//               value={formData.amount || ''}
//               onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               placeholder="50000.00"
//               min="1"
//               step="0.01"
//               required
//             />
//           </div>
          
//           {/* Purpose (Additional field not in API, can be stored locally if needed) */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Purpose (Optional)
//             </label>
//             <textarea
//               value={purpose}
//               onChange={(e) => setPurpose(e.target.value)}
//               rows={3}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               placeholder="Describe the purpose of this loan"
//             />
//           </div>
          
//           {/* Form Actions */}
//           <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//             <Button variant="ghost" type="button" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button 
//               type="submit" 
//               disabled={loading}
//               className="bg-green-600 hover:bg-green-700 text-white"
//             >
//               {loading ? (
//                 <span className="flex items-center gap-2">
//                   <LoadingSpinner size="sm" /> Submitting...
//                 </span>
//               ) : (
//                 'Submit Application'
//               )}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // ── Main ApplicationsList Component ────────────────────────────────────
// export const ApplicationsList: React.FC = () => {
//   // State
//   const [applications, setApplications] = useState<LoanApplication[]>([]);
//   const [members, setMembers] = useState<Member[]>([]);
//   const [products, setProducts] = useState<LoanProduct[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   // Filters
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
  
//   // Modals
//   const [showApplyModal, setShowApplyModal] = useState(false);
//   const [viewApplication, setViewApplication] = useState<LoanApplication | null>(null);

//   // ── Fetch Data ───────────────────────────────────────────────────────
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

//   const fetchProducts = useCallback(async () => {
//     try {
//       // GET /api/v1/loan-products - using the loan product API
//       const res = await loanProductApi.listProducts({});
//       const productsData = res?.data?.content ?? res?.data ?? res ?? [];
//       setProducts(Array.isArray(productsData) ? productsData : []);
//     } catch (err) {
//       console.error("Failed to fetch loan products", err);
//       // Fallback: try localStorage if API fails
//       try {
//         const storedData = localStorage.getItem('p2p_loan_data');
//         if (storedData) {
//           const data = JSON.parse(storedData);
//           setProducts(data.products || []);
//         }
//       } catch (e) {
//         setProducts([]);
//       }
//     }
//   }, []);

//   const fetchApplications = useCallback(async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       // GET /api/v1/loans — List all loans as applications
//       // Using the loans endpoint as the applications list
//       const params = {
//         status: statusFilter !== 'all' ? statusFilter : undefined,
//         // page and size can be added for pagination
//       };
      
//       const res = await loanApi.listLoans({
//         status: statusFilter !== 'all' ? statusFilter : undefined,
//       });

//       //Debugging
//   console.log('FULL RESPONSE:', res);
//   console.log('LEVEL 1:', res?.data);
//   console.log('LEVEL 2:', res?.data?.data);
//   console.log('LEVEL 3:', res?.data?.data?.content);
//   console.log('LEVEL ALT:', res?.data?.content);
      
//       // const applicationsData = res?.data?.content ?? res?.data ?? res ?? [];
//       const applicationsData =
//       res?.data?.data?.content ??
//       res?.data?.content ??
//       [];
//       setApplications(Array.isArray(applicationsData) ? applicationsData : []);
//     } catch (err: any) {
//       console.error("Failed to fetch applications", err);
//       setError(err.message || 'Failed to load applications');
      
//       // Fallback: try localStorage if API fails
//       try {
//         const storedData = localStorage.getItem('p2p_loan_data');
//         if (storedData) {
//           const data = JSON.parse(storedData);
//           setApplications(data.applications || []);
//         }
//       } catch (e) {
//         setApplications([]);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [statusFilter]);

//   // Load all data on mount
//   useEffect(() => {
//     fetchMembers();
//     fetchProducts();
//   }, [fetchMembers, fetchProducts]);

//   useEffect(() => {
//     fetchApplications();
//   }, [fetchApplications]);

//   // ── Handlers ─────────────────────────────────────────────────────────
//   const handleStatusChange = async (applicationId: string, newStatus: string) => {
//     // Postman collection, there's no direct status change endpoint
    
//     setApplications(prev => 
//       prev.map(app => 
//         (app.id?.toString() === applicationId || app.loanCode === applicationId) 
//           ? { ...app, status: newStatus, updatedAt: new Date().toISOString() }
//           : app
//       )
//     );
    
//     toast.success(`Application ${newStatus.toLowerCase()} successfully!`);
    
//   };

//   const handleRefresh = () => {
//     fetchApplications();
//     toast.success('Refreshed applications');
//   };

//   // ── Filter Logic ─────────────────────────────────────────────────────
//   const filteredApplications = applications.filter(app => {
//     const searchStr = searchTerm.toLowerCase();
//     const memberNumber = (app.memberNumber || app.memberId || '').toLowerCase();
//     const loanCode = (app.loanCode || app.applicationId || app.id?.toString() || '').toLowerCase();
//     const purpose = (app.purpose || '').toLowerCase();
    
//     const matchesSearch = !searchStr || 
//       memberNumber.includes(searchStr) ||
//       loanCode.includes(searchStr) ||
//       purpose.includes(searchStr);
    
//     const matchesStatus = statusFilter === 'all' || 
//       app.status?.toLowerCase() === statusFilter.toLowerCase();
    
//     return matchesSearch && matchesStatus;
//   });

//   // ── Helpers ──────────────────────────────────────────────────────────
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-KE', {
//       style: 'currency',
//       currency: 'KES'
//     }).format(amount);
//   };

//   const getStatusColor = (status: string | undefined) => {
//     switch (status?.toUpperCase()) {
//       case 'APPROVED':
//       case 'ACTIVE':
//         return 'bg-green-100 text-green-800';
//       case 'REJECTED':
//       case 'DEFAULTED':
//         return 'bg-red-100 text-red-800';
//       case 'UNDER_REVIEW':
//       case 'PENDING':
//       case 'SUBMITTED':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'DRAFT':
//         return 'bg-gray-100 text-gray-800';
//       default:
//         return 'bg-blue-100 text-blue-800';
//     }
//   };

//   // ── Render ───────────────────────────────────────────────────────────
//   return (
//     <div className="space-y-6">
//       {/* Modals */}
//       {viewApplication && (
//         <ApplicationDetailModal
//           application={viewApplication}
//           members={members}
//           products={products}
//           onClose={() => setViewApplication(null)}
//         />
//       )}
      
//       <ApplyLoanModal
//         isOpen={showApplyModal}
//         members={members}
//         products={products}
//         onClose={() => setShowApplyModal(false)}
//         onSuccess={() => {
//           fetchApplications();
//         }}
//       />

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <FileText size={24} className="text-green-600" /> Loan Applications
//           </h2>
//           <p className="text-gray-600 text-sm mt-1">
//             {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             onClick={handleRefresh} 
//             className="flex items-center gap-1"
//           >
//             <RefreshCw size={14} /> Refresh
//           </Button>
//           <Button 
//             onClick={() => setShowApplyModal(true)}
//             className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
//           >
//             <Plus size={16} />
//             Apply for Loan
//           </Button>
//         </div>
//       </div>

//       {/* Error Banner */}
//       {error && (
//         <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
//           <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
//           <div>
//             <p className="text-red-700 text-sm font-medium">Error loading applications</p>
//             <p className="text-red-600 text-xs mt-0.5">{error}</p>
//           </div>
//         </div>
//       )}

//       {/* Filters */}
//       <Card>
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//             <input
//               type="text"
//               placeholder="Search by member, loan code, or purpose..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <Filter size={16} className="text-gray-400" />
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
//             >
//               <option value="all">All Status</option>
//               <option value="DRAFT">Draft</option>
//               <option value="SUBMITTED">Submitted</option>
//               <option value="PENDING">Pending</option>
//               <option value="UNDER_REVIEW">Under Review</option>
//               <option value="APPROVED">Approved</option>
//               <option value="ACTIVE">Active</option>
//               <option value="REJECTED">Rejected</option>
//               <option value="CLOSED">Closed</option>
//               <option value="DEFAULTED">Defaulted</option>
//             </select>
//           </div>
//         </div>
//       </Card>

//       {/* Applications Table */}
//       <Card padding="sm">
//         {loading ? (
//           <div className="flex justify-center py-16">
//             <LoadingSpinner size="lg" />
//           </div>
//         ) : filteredApplications.length === 0 ? (
//           <div className="text-center py-16 text-gray-400">
//             <FileText size={40} className="mx-auto mb-3 text-gray-300" />
//             <p className="font-medium">No applications found</p>
//             <p className="text-sm">
//               {applications.length === 0 
//                 ? 'Click "Apply for Loan" to create your first application.'
//                 : 'Try adjusting your search or filter criteria.'}
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase">Application</th>
//                   <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase">Member</th>
//                   <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase">Amount</th>
//                   <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase">Purpose</th>
//                   <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase">Status</th>
//                   <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase">Date</th>
//                   <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredApplications.map((application) => {
//                   const member = members.find(m => 
//                     m.memberNumber === application.memberNumber || 
//                     m.id?.toString() === application.memberId
//                   );
                  
//                   return (
//                     <tr key={application.id || application.loanCode} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                       <td className="py-3 px-4">
//                         <p className="font-medium text-gray-900 text-sm">
//                           {application.loanCode || application.applicationId || `#${application.id}`}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           {application.productCode || 'N/A'}
//                         </p>
//                       </td>
//                       <td className="py-3 px-4">
//                         <p className="text-sm text-gray-900 font-medium">
//                           {member 
//                             ? `${member.firstName || member.first_name} ${member.lastName || member.last_name}`
//                             : 'Unknown'
//                           }
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           {application.memberNumber || application.memberId || 'N/A'}
//                         </p>
//                       </td>
//                       <td className="py-3 px-4">
//                         <p className="font-semibold text-gray-900 text-sm">
//                           {/* {formatCurrency(application.amountRequested || application.amount || 0)} */}
//                         { formatCurrency(
//                         application.principalAmount ??
//                         application.amountRequested ??
//                         application.amount ??
//                         0
//                       ) }
//                         </p>
//                       </td>
//                       <td className="py-3 px-4">
//                         <p className="text-sm text-gray-700 max-w-xs truncate">
//                           {application.purpose || '—'}
//                         </p>
//                       </td>
//                       <td className="py-3 px-4">
//                         {/* <StatusBadge status={application.status || 'UNKNOWN'} variant="application" /> */}
//                         <StatusBadge status={application.status || 'SUBMITTED'} />
//                       </td>
//                       <td className="py-3 px-4">
//                         <p className="text-sm text-gray-600">
//                           {application.createdAt 
//                             ? new Date(application.createdAt).toLocaleDateString() 
//                             : 'N/A'
//                           }
//                         </p>
//                       </td>
//                       <td className="py-3 px-4">
//                         <div className="flex items-center gap-1">
//                           <Button 
//                             variant="ghost" 
//                             size="sm" 
//                             className="flex items-center gap-1 text-green-600 hover:text-green-800"
//                             onClick={() => setViewApplication(application)}
//                           >
//                             <Eye size={14} /> View
//                           </Button>
                          
//                           {/* Approve/Reject for pending applications */}
//                           {(application.status?.toUpperCase() === 'PENDING' || 
//                             application.status?.toUpperCase() === 'UNDER_REVIEW' ||
//                             application.status?.toUpperCase() === 'SUBMITTED') && (
//                             <>
//                               <Button 
//                                 variant="ghost" 
//                                 size="sm" 
//                                 className="flex items-center gap-1 text-green-600 hover:text-green-800"
//                                 onClick={() => handleStatusChange(
//                                   (application.id?.toString() || application.loanCode || ''), 
//                                   'APPROVED'
//                                 )}
//                               >
//                                 <CheckCircle size={14} /> Approve
//                               </Button>
//                               <Button 
//                                 variant="ghost" 
//                                 size="sm" 
//                                 className="flex items-center gap-1 text-red-600 hover:text-red-800"
//                                 onClick={() => handleStatusChange(
//                                   (application.id?.toString() || application.loanCode || ''), 
//                                   'REJECTED'
//                                 )}
//                               >
//                                 <XCircle size={14} /> Reject
//                               </Button>
//                             </>
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
//       </Card>
//     </div>
//   );
// };

// import { FileText } from 'lucide-react';


import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Search, Filter, Eye, CheckCircle, XCircle, Plus, RefreshCw, AlertCircle, X, FileText } from 'lucide-react';
import { loanApi, membersApi, loanProductApi } from '../../services/api';
import type { ApplyLoanPayload } from '../../services/api';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────────────────
interface LoanApplication {
  id?: number | string;
  applicationId?: string;
  loanCode?: string;
  memberNumber?: string;
  memberId?: string;
  productCode?: string;
  productId?: string;
  principalAmount?: number;
  loanStatus?: string;
  dateBorrowed?: string;
  amountRequested?: number;
  amount?: number;
  term?: number;
  purpose?: string;
  status?: string;
  creditScore?: number;
  interestRate?: number;
  createdAt?: string;
  updatedAt?: string;
  submittedBy?: string;
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

// ── Application Detail Modal ───────────────────────────────────────────
interface ApplicationDetailModalProps {
  application: LoanApplication;
  members: Member[];
  products: LoanProduct[];
  onClose: () => void;
}

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({ 
  application, members, products, onClose 
}) => {
  const member = members.find(m => 
    m.memberNumber === application.memberNumber || 
    m.id?.toString() === application.memberId
  );
  
  const product = products.find(p => 
    p.productCode === application.productCode || 
    p.id?.toString() === application.productId
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-lg font-bold text-gray-900">
            Application Details — {application.applicationId || application.loanCode || `#${application.id}`}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded-lg ${
            application.status === 'APPROVED' ? 'bg-green-50 border border-green-200' :
            application.status === 'REJECTED' ? 'bg-red-50 border border-red-200' :
            application.status === 'UNDER_REVIEW' ? 'bg-yellow-50 border border-yellow-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Status: {application.status}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Applied: {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <StatusBadge status={application.loanStatus || 'SUBMITTED'} />
            </div>
          </div>

          {/* Member Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Member Information</h4>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {member ? `${member.firstName || member.first_name} ${member.lastName || member.last_name}` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Member Number</p>
                <p className="text-sm font-medium text-gray-900">{application.memberNumber || application.memberId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{member?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-900">{member?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Loan Details</h4>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-xs text-gray-500">Product</p>
                <p className="text-sm font-medium text-gray-900">
                  {product ? (product.loanProductName || product.name) : (application.productCode || 'N/A')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount Requested</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(
                    application.principalAmount ??
                    application.amountRequested ??
                    application.amount ??
                    0
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Term</p>
                <p className="text-sm font-medium text-gray-900">{application.term || 'N/A'} months</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Interest Rate</p>
                <p className="text-sm font-medium text-gray-900">
                  {application.interestRate || product?.percentage || product?.interestRate || 'N/A'}%
                </p>
              </div>
              {application.purpose && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Purpose</p>
                  <p className="text-sm font-medium text-gray-900">{application.purpose}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white">
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

// ── Apply Loan Modal ───────────────────────────────────────────────────
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
  const [purpose, setPurpose] = useState('');
  const [selectedProductDetails, setSelectedProductDetails] = useState<LoanProduct | null>(null);

  const handleMemberChange = (memberNumber: string) => {
    setFormData(prev => ({ ...prev, memberNumber }));
  };

  const handleProductChange = (productCode: string) => {
    const selectedProduct = products.find(p => p.productCode === productCode);
    setSelectedProductDetails(selectedProduct || null);
    setFormData(prev => ({ ...prev, productCode }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
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

    console.log('APPLY PAYLOAD:', formData);

    setLoading(true);
    setError(null);
    
    try {
      await loanApi.applyForLoan(formData);
      toast.success('Loan application submitted successfully!');
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({ memberNumber: '', productCode: '', amount: 0 });
      setPurpose('');
      setSelectedProductDetails(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to submit application';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Filter only active products
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
                const phone = member.phone || '';
                
                return (
                  <option key={memberNumber} value={memberNumber}>
                    {firstName} {lastName} — {memberNumber} {email ? `(${email})` : phone ? `(${phone})` : ''}
                  </option>
                );
              })}
            </select>
            <p className="mt-1 text-xs text-gray-500">Select the member applying for the loan</p>
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
                    {productName} — {interestRate}% interest, {loanPeriod} months term
                  </option>
                );
              })}
            </select>
            <p className="mt-1 text-xs text-gray-500">Select the loan product type</p>
          </div>
          
          {/* Show Product Details when selected */}
          {selectedProductDetails && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-800 mb-1">Product Details</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Interest Rate:</span>
                  <span className="font-medium ml-1">{selectedProductDetails.percentage || selectedProductDetails.interestRate || 0}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Loan Period:</span>
                  <span className="font-medium ml-1">{selectedProductDetails.loanPeriod || 0} months</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Product Code:</span>
                  <span className="font-mono text-xs ml-1">{selectedProductDetails.productCode}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (KES) *
            </label>
            <input
              type="number"
              value={formData.amount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 50000"
              min="1000"
              step="1000"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Enter the loan amount in Kenyan Shillings (minimum KES 1,000)</p>
          </div>
          
          {/* Purpose Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose of Loan (Optional)
            </label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe the purpose of this loan (e.g., School fees, Home improvement, Business capital)"
            />
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" /> Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main ApplicationsList Component ────────────────────────────────────
export const ApplicationsList: React.FC = () => {
  // State
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modals
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [viewApplication, setViewApplication] = useState<LoanApplication | null>(null);

  // ── Fetch Data ───────────────────────────────────────────────────────
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

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await loanApi.listLoans({
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });

      console.log('FULL RESPONSE:', res);
      
      const applicationsData =
        res?.data?.data?.content ??
        res?.data?.content ??
        [];
      setApplications(Array.isArray(applicationsData) ? applicationsData : []);
    } catch (err: any) {
      console.error("Failed to fetch applications", err);
      setError(err.message || 'Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // Load all data on mount
  useEffect(() => {
    fetchMembers();
    fetchProducts();
  }, [fetchMembers, fetchProducts]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // ── Handlers ─────────────────────────────────────────────────────────
  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    setApplications(prev => 
      prev.map(app => 
        (app.id?.toString() === applicationId || app.loanCode === applicationId) 
          ? { ...app, status: newStatus, updatedAt: new Date().toISOString() }
          : app
      )
    );
    toast.success(`Application ${newStatus.toLowerCase()} successfully!`);
  };

  const handleRefresh = () => {
    fetchApplications();
    toast.success('Refreshed applications');
  };

  // ── Filter Logic ─────────────────────────────────────────────────────
  const filteredApplications = applications.filter(app => {
    const searchStr = searchTerm.toLowerCase();
    const memberNumber = (app.memberNumber || app.memberId || '').toLowerCase();
    const loanCode = (app.loanCode || app.applicationId || app.id?.toString() || '').toLowerCase();
    const purpose = (app.purpose || '').toLowerCase();
    
    const matchesSearch = !searchStr || 
      memberNumber.includes(searchStr) ||
      loanCode.includes(searchStr) ||
      purpose.includes(searchStr);
    
    const matchesStatus = statusFilter === 'all' || 
      app.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // ── Helpers ──────────────────────────────────────────────────────────
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Modals */}
      {viewApplication && (
        <ApplicationDetailModal
          application={viewApplication}
          members={members}
          products={products}
          onClose={() => setViewApplication(null)}
        />
      )}
      
      <ApplyLoanModal
        isOpen={showApplyModal}
        members={members}
        products={products}
        onClose={() => setShowApplyModal(false)}
        onSuccess={() => {
          fetchApplications();
        }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText size={24} className="text-green-600" /> Loan Applications
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh} 
            className="flex items-center gap-1"
          >
            <RefreshCw size={14} /> Refresh
          </Button>
          <Button 
            onClick={() => setShowApplyModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus size={16} />
            Apply for Loan
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
          <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-red-700 text-sm font-medium">Error loading applications</p>
            <p className="text-red-600 text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by member, loan code, or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="ACTIVE">Active</option>
              <option value="REJECTED">Rejected</option>
              <option value="CLOSED">Closed</option>
              <option value="DEFAULTED">Defaulted</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Applications Table */}
      <Card padding="sm">
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileText size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No applications found</p>
            <p className="text-sm">
              {applications.length === 0 
                ? 'Click "Apply for Loan" to create your first application.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase">Application</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase">Member</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase">Purpose</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => {
                  const member = members.find(m => 
                    m.memberNumber === application.memberNumber || 
                    m.id?.toString() === application.memberId
                  );
                  
                  return (
                    <tr key={application.id || application.loanCode} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900 text-sm">
                          {application.loanCode || application.applicationId || `#${application.id}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {application.productCode || 'N/A'}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-900 font-medium">
                          {member 
                            ? `${member.firstName || member.first_name} ${member.lastName || member.last_name}`
                            : 'Unknown'
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          {application.memberNumber || application.memberId || 'N/A'}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-gray-900 text-sm">
                          {formatCurrency(
                            application.principalAmount ??
                            application.amountRequested ??
                            application.amount ??
                            0
                          )}
                        </p>
                       </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-700 max-w-xs truncate">
                          {application.purpose || '—'}
                        </p>
                       </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={application.status || 'SUBMITTED'} />
                       </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600">
                          {application.createdAt 
                            ? new Date(application.createdAt).toLocaleDateString() 
                            : 'N/A'
                          }
                        </p>
                       </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1 text-green-600 hover:text-green-800"
                            onClick={() => setViewApplication(application)}
                          >
                            <Eye size={14} /> View
                          </Button>
                          
                          {/* Approve/Reject for pending applications */}
                          {(application.status?.toUpperCase() === 'PENDING' || 
                            application.status?.toUpperCase() === 'UNDER_REVIEW' ||
                            application.status?.toUpperCase() === 'SUBMITTED') && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-1 text-green-600 hover:text-green-800"
                                onClick={() => handleStatusChange(
                                  (application.id?.toString() || application.loanCode || ''), 
                                  'APPROVED'
                                )}
                              >
                                <CheckCircle size={14} /> Approve
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-1 text-red-600 hover:text-red-800"
                                onClick={() => handleStatusChange(
                                  (application.id?.toString() || application.loanCode || ''), 
                                  'REJECTED'
                                )}
                              >
                                <XCircle size={14} /> Reject
                              </Button>
                            </>
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
      </Card>
    </div>
  );
};