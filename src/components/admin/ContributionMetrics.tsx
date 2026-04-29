// import React, { useState, useEffect } from 'react';
// import { contributionMetricApi } from '../../services/api'; // api service
// import type { 
//   AddContributionMetricPayload, 
//   UpdateContributionMetricPayload 
// } from '../../services/api'; // api service

// // ── TypeScript Interfaces ──────────────────────────────────────────────────
// interface ContributionMetric {
//   id?: number;
//   periodEnum: 'MONTHLY' | 'WEEKLY' | 'YEARLY';
//   dueDayOfMonth: number;
//   contributionAmount: number;
//   penaltyPercentage: number;
//   metricStatus?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }

// // ── ContributionMetrics Component ──────────────────────────────────────────
// const ContributionMetrics: React.FC = () => {
//   // State for metrics list
//   const [metrics, setMetrics] = useState<ContributionMetric[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   // State for form modal
//   const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [currentMetricId, setCurrentMetricId] = useState<number | null>(null);

//   // Form state
//   const [formData, setFormData] = useState<AddContributionMetricPayload>({
//     periodEnum: 'MONTHLY',
//     dueDayOfMonth: 5,
//     contributionAmount: 5000.00,
//     penaltyPercentage: 2,
//   });

//   // State for delete confirmation
//   const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

//   // ── Fetch Metrics on Component Mount ────────────────────────────────────
//   useEffect(() => {
//     fetchMetrics();
//   }, []);

// //   // ── API Calls ───────────────────────────────────────────────────────────
// //   const fetchMetrics = async () => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const data = await contributionMetricApi.listAllMetrics();
// //         console.log("METRICS FROM API:", data);
// //       // Handle different response structures
// //       setMetrics(data?.data || data?.content || data || []);
// //     } catch (err: any) {
// //       setError(err.message || 'Failed to fetch contribution metrics');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// const fetchMetrics = async () => {
//   setLoading(true);
//   setError(null);

//   try {
//     const response = await contributionMetricApi.listAllMetrics();

//     console.log("METRICS FROM API:", response);

//     const raw =
//       response?.data ??
//       response?.content ??
//       response;

//     // normalize nested arrays
//     const normalized = Array.isArray(raw?.[0])
//       ? raw[0]        
//       : raw;

//     setMetrics(Array.isArray(normalized) ? normalized : []);
//   } catch (err: any) {
//     setError(err.message || 'Failed to fetch contribution metrics');
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleAddMetric = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       await contributionMetricApi.addMetric(formData);
//       setSuccessMessage('Metric added successfully!');
//       setIsFormOpen(false);
//       resetForm();
//       fetchMetrics(); // Refresh list

//     } catch (err: any) {
//       setError(err.message || 'Failed to add metric');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateMetric = async () => {
//     if (!currentMetricId) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const updatePayload: UpdateContributionMetricPayload = {
//         dueDayOfMonth: formData.dueDayOfMonth,
//         contributionAmount: formData.contributionAmount,
//         penaltyPercentage: formData.penaltyPercentage,
//         metricStatus: true, // Default to active when updating
//       };
//       await contributionMetricApi.updateMetric(currentMetricId, updatePayload);
//       setSuccessMessage('Metric updated successfully!');
//       setIsFormOpen(false);
//       setIsEditing(false);
//       resetForm();
//       fetchMetrics(); // Refresh list
//     } catch (err: any) {
//       setError(err.message || 'Failed to update metric');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteMetric = async (id: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       await contributionMetricApi.deleteMetric(id);
//       setSuccessMessage('Metric deleted successfully!');
//       setDeleteConfirmId(null);
//       fetchMetrics(); // Refresh list
//     } catch (err: any) {
//       setError(err.message || 'Failed to delete metric');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Form Handlers ───────────────────────────────────────────────────────
//   const resetForm = () => {
//     setFormData({
//       periodEnum: 'MONTHLY',
//       dueDayOfMonth: 5,
//       contributionAmount: 5000.00,
//       penaltyPercentage: 2,
//     });
//     setCurrentMetricId(null);
//   };

//   const openAddForm = () => {
//     resetForm();
//     setIsEditing(false);
//     setIsFormOpen(true);
//   };

//   const openEditForm = (metric: ContributionMetric) => {
//     setFormData({
//       periodEnum: metric.periodEnum,
//       dueDayOfMonth: metric.dueDayOfMonth,
//       contributionAmount: metric.contributionAmount,
//       penaltyPercentage: metric.penaltyPercentage,
//     });
//     setCurrentMetricId(metric.id || null);
//     setIsEditing(true);
//     setIsFormOpen(true);
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type } = e.target;
//     setFormData ((prev: any) => ({
//       ...prev,
//       [name]: type === 'number' ? parseFloat(value) || 0 : value,
//     }));
//   };

//   // ── Clear messages after timeout ────────────────────────────────────────
//   useEffect(() => {
//     if (successMessage || error) {
//       const timer = setTimeout(() => {
//         setSuccessMessage(null);
//         setError(null);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [successMessage, error]);

//   // ── Format currency ────────────────────────────────────────────────────
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-KE', {
//       style: 'currency',
//       currency: 'KES',
//     }).format(amount);
//   };

//   // ── Render ──────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header Section */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-black-800">
//               Contribution Metrics
//             </h1>
//             <p className="mt-1 text-sm text-black-600">
//               Manage contribution periods, amounts, and penalty settings
//             </p>
//           </div>
//           <button
//             onClick={openAddForm}
//             className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 border border-transparent 
//                      text-sm font-medium rounded-lg shadow-sm text-white bg-green-700 
//                      hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 
//                      focus:ring-green-500 transition-colors duration-200"
//           >
//             <svg
//               className="w-5 h-5 mr-2"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 4v16m8-8H4"
//               />
//             </svg>
//             Add New Metric
//           </button>
//         </div>

//         {/* Alert Messages */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {successMessage && (
//           <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-black-700">{successMessage}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Metrics Table */}
//         <div className="bg-white shadow-md rounded-lg overflow-hidden border border-green-100">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-green-200">
//               <thead className="bg-green-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
//                     ID
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
//                     Period
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
//                     Due Day
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
//                     Amount (KES)
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
//                     Penalty %
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black-700 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-black-700 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-green-100">
//                 {loading && metrics.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-12 text-center">
//                       <div className="flex justify-center items-center">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
//                         <span className="ml-3 text-black-600">Loading metrics...</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : metrics.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-12 text-center">
//                       <div className="text-center">
//                         <svg className="mx-auto h-12 w-12 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                         </svg>
//                         <h3 className="mt-2 text-sm font-medium text-black-800">No metrics found</h3>
//                         <p className="mt-1 text-sm text-black-600">Get started by adding a new contribution metric.</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   metrics.map((metric) => (
//                     <tr key={metric.id} className="hover:bg-green-50 transition-colors duration-150">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black-800">
//                         #{metric.id}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-black-800">
//                           {metric.periodEnum}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-black-700">
//                         Day {metric.dueDayOfMonth}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-black-800">
//                         {formatCurrency(metric.contributionAmount)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
//                         {metric.penaltyPercentage}%
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
//                             metric.metricStatus !== false
//                               ? 'bg-green-100 text-black-800'
//                               : 'bg-gray-100 text-gray-500'
//                           }`}
//                         >
//                           {metric.metricStatus !== false ? 'Active' : 'Inactive'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button
//                           onClick={() => openEditForm(metric)}
//                           className="text-black-700 hover:text-green-900 mr-4 transition-colors duration-150"
//                           title="Edit metric"
//                         >
//                           <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                           </svg>
//                         </button>
//                         <button
//                           onClick={() => setDeleteConfirmId(metric.id || null)}
//                           className="text-red-600 hover:text-red-900 transition-colors duration-150"
//                           title="Delete metric"
//                         >
//                           <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Add/Edit Form Modal */}
//       {isFormOpen && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
//             {/* Overlay */}
//             <div 
//               className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
//               onClick={() => {
//                 setIsFormOpen(false);
//                 setIsEditing(false);
//                 resetForm();
//               }}
//             ></div>

//             {/* Modal Content */}
//             <div className="relative inline-block bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
//               <div>
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-2xl font-semibold text-black-800">
//                     {isEditing ? 'Edit Contribution Metric' : 'Add New Contribution Metric'}
//                   </h3>
//                   <button
//                     onClick={() => {
//                       setIsFormOpen(false);
//                       setIsEditing(false);
//                       resetForm();
//                     }}
//                     className="text-green-400 hover:text-black-600 transition-colors duration-150"
//                   >
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={(e) => {
//                   e.preventDefault();
//                   isEditing ? handleUpdateMetric() : handleAddMetric();
//                 }} className="space-y-5">
//                   {/* Period Enum */}
//                   <div>
//                     <label htmlFor="periodEnum" className="block text-sm font-medium text-black-700 mb-2">
//                       Contribution Period *
//                     </label>
//                     <select
//                       id="periodEnum"
//                       name="periodEnum"
//                       value={formData.periodEnum}
//                       onChange={handleInputChange}
//                       className="block w-full px-4 py-3 rounded-lg border border-green-300 shadow-sm 
//                                focus:ring-2 focus:ring-green-500 focus:border-green-500 
//                                text-gray-700 bg-white transition-colors duration-150"
//                       required
//                     >
//                       <option value="MONTHLY">Monthly</option>
//                       <option value="WEEKLY">Weekly</option>
//                       <option value="YEARLY">Yearly</option>
//                     </select>
//                     </div>

//                   {/* Due Day of Month */}
//                   <div>
//                     <label htmlFor="dueDayOfMonth" className="block text-sm font-medium text-black-700 mb-2">
//                       Due Day of Month *
//                     </label>
//                     <input
//                       type="number"
//                       id="dueDayOfMonth"
//                       name="dueDayOfMonth"
//                       value={formData.dueDayOfMonth}
//                       onChange={handleInputChange}
//                       min="1"
//                       max="31"
//                       className="block w-full px-4 py-3 rounded-lg border border-green-300 shadow-sm 
//                                focus:ring-2 focus:ring-green-500 focus:border-green-500 
//                                text-gray-700 placeholder-green-400 transition-colors duration-150"
//                       placeholder="e.g., 5"
//                       required
//                     />
//                     <p className="mt-1 text-xs text-black-600">Day of the month when contributions are due</p>
//                   </div>

//                   {/* Contribution Amount */}
//                   <div>
//                     <label htmlFor="contributionAmount" className="block text-sm font-medium text-black-700 mb-2">
//                       Contribution Amount (KES) *
//                     </label>
//                     <div className="relative rounded-lg shadow-sm">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <span className="text-green-500 sm:text-sm font-medium">KES</span>
//                       </div>
//                       <input
//                         type="number"
//                         id="contributionAmount"
//                         name="contributionAmount"
//                         value={formData.contributionAmount}
//                         onChange={handleInputChange}
//                         min="1"
//                         step="0.01"
//                         className="block w-full pl-12 pr-4 py-3 rounded-lg border border-green-300 
//                                  focus:ring-2 focus:ring-green-500 focus:border-green-500 
//                                  text-gray-700 placeholder-green-400 transition-colors duration-150"
//                         placeholder="5000.00"
//                         required
//                       />
//                     </div>
//                   </div>

//                   {/* Penalty Percentage */}
//                   <div>
//                     <label htmlFor="penaltyPercentage" className="block text-sm font-medium text-black-700 mb-2">
//                       Penalty Percentage (%) *
//                     </label>
//                     <div className="relative rounded-lg shadow-sm">
//                       <input
//                         type="number"
//                         id="penaltyPercentage"
//                         name="penaltyPercentage"
//                         value={formData.penaltyPercentage}
//                         onChange={handleInputChange}
//                         min="0"
//                         max="100"
//                         step="0.1"
//                         className="block w-full pr-12 px-4 py-3 rounded-lg border border-green-300 
//                                  focus:ring-2 focus:ring-green-500 focus:border-green-500 
//                                  text-gray-700 placeholder-green-400 transition-colors duration-150"
//                         placeholder="2"
//                         required
//                       />
//                       <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                         <span className="text-green-500 sm:text-sm font-medium">%</span>
//                       </div>
//                     </div>
//                     <p className="mt-1 text-xs text-black-600">Penalty applied for late contributions</p>
//                   </div>

//                   {/* Form Actions */}
//                   <div className="flex justify-end space-x-4 pt-4 border-t border-green-100">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setIsFormOpen(false);
//                         setIsEditing(false);
//                         resetForm();
//                       }}
//                       className="inline-flex items-center px-5 py-2.5 border border-green-300 text-sm 
//                                font-medium rounded-lg text-black-700 bg-white hover:bg-green-50 
//                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
//                                transition-colors duration-150"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="inline-flex items-center px-5 py-2.5 border border-transparent 
//                                text-sm font-medium rounded-lg text-white bg-green-700 
//                                hover:bg-green-800 focus:outline-none focus:ring-2 
//                                focus:ring-offset-2 focus:ring-green-500 
//                                disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
//                     >
//                       {loading ? (
//                         <>
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                           {isEditing ? 'Updating...' : 'Adding...'}
//                         </>
//                       ) : (
//                         isEditing ? 'Update Metric' : 'Add Metric'
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteConfirmId && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
//             {/* Overlay */}
//             <div 
//               className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
//               onClick={() => setDeleteConfirmId(null)}
//             ></div>

//             {/* Modal Content */}
//             <div className="relative inline-block bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-md sm:w-full sm:p-6">
//               <div>
//                 <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
//                   <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                   </svg>
//                 </div>
//                 <div className="mt-4 text-center sm:mt-5">
//                   <h3 className="text-lg leading-6 font-medium text-gray-900">
//                     Delete Contribution Metric
//                   </h3>
//                   <div className="mt-2">
//                     <p className="text-sm text-gray-500">
//                       Are you sure you want to delete metric #{deleteConfirmId}? 
//                       This action cannot be undone.
//                     </p>
//                   </div>
//                 </div>
//                 <div className="mt-6 flex justify-end space-x-4">
//                   <button
//                     type="button"
//                     onClick={() => setDeleteConfirmId(null)}
//                     className="inline-flex items-center px-5 py-2.5 border border-green-300 text-sm 
//                              font-medium rounded-lg text-black-700 bg-white hover:bg-green-50 
//                              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
//                              transition-colors duration-150"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => handleDeleteMetric(deleteConfirmId)}
//                     disabled={loading}
//                     className="inline-flex items-center px-5 py-2.5 border border-transparent 
//                              text-sm font-medium rounded-lg text-white bg-red-600 
//                              hover:bg-red-700 focus:outline-none focus:ring-2 
//                              focus:ring-offset-2 focus:ring-red-500 
//                              disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
//                   >
//                     {loading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Deleting...
//                       </>
//                     ) : (
//                       'Delete'
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ContributionMetrics;





import React, { useState, useEffect } from 'react';
import { contributionMetricApi } from '../../services/api';
import type {
  AddContributionMetricPayload,
  UpdateContributionMetricPayload,
} from '../../services/api';

interface ContributionMetric {
  id?: number;
  periodEnum: 'MONTHLY' | 'WEEKLY' | 'YEARLY';
  dueDayOfMonth: number;
  contributionAmount: number;
  penaltyPercentage: number;
  metricStatus?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// FIX: All numeric fields kept as strings in state to avoid the
// "HTML inputs always return strings" bug. Parsed to numbers only on submit.
interface FormState {
  periodEnum: 'MONTHLY' | 'WEEKLY' | 'YEARLY';
  dueDayOfMonth: string;
  contributionAmount: string;
  penaltyPercentage: string;
}

const EMPTY_FORM: FormState = {
  periodEnum: 'MONTHLY',
  dueDayOfMonth: '',
  contributionAmount: '',
  penaltyPercentage: '',
};

function extractMetrics(res: any): ContributionMetric[] {
  if (!res) return [];
  const raw = res?.data ?? res?.content ?? res;
  const list = Array.isArray(raw?.[0]) ? raw[0] : raw;
  return Array.isArray(list) ? list : [];
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(n);
}

// FIX: Show actual day number with ordinal suffix e.g. "5th of month"
function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const ContributionMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<ContributionMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMetricId, setCurrentMetricId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormState>({ ...EMPTY_FORM });
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await contributionMetricApi.listAllMetrics();
      console.log('[ContributionMetrics] raw response:', response);
      setMetrics(extractMetrics(response));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch contribution metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMetrics(); }, []);

  useEffect(() => {
    if (!successMessage && !error) return;
    const t = setTimeout(() => { setSuccessMessage(null); setError(null); }, 5000);
    return () => clearTimeout(t);
  }, [successMessage, error]);

  const resetForm = () => { setFormData({ ...EMPTY_FORM }); setCurrentMetricId(null); };

  const openAddForm = () => { resetForm(); setIsEditing(false); setIsFormOpen(true); };

  const openEditForm = (metric: ContributionMetric) => {
    setFormData({
      periodEnum: metric.periodEnum,
      dueDayOfMonth: String(metric.dueDayOfMonth),
      contributionAmount: String(metric.contributionAmount),
      penaltyPercentage: String(metric.penaltyPercentage),
    });
    setCurrentMetricId(metric.id ?? null);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const closeForm = () => { setIsFormOpen(false); setIsEditing(false); resetForm(); };

  // FIX: store ALL fields as strings; only parse to numbers on submit
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const buildAddPayload = (): AddContributionMetricPayload | null => {
    const dueDayOfMonth = parseInt(formData.dueDayOfMonth, 10);
    const contributionAmount = parseFloat(formData.contributionAmount);
    const penaltyPercentage = parseFloat(formData.penaltyPercentage);
    if (isNaN(dueDayOfMonth) || dueDayOfMonth < 1 || dueDayOfMonth > 31) {
      setError('Due day must be between 1 and 31'); return null;
    }
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      setError('Contribution amount must be greater than 0'); return null;
    }
    if (isNaN(penaltyPercentage) || penaltyPercentage < 0) {
      setError('Penalty percentage must be 0 or more'); return null;
    }
    return { periodEnum: formData.periodEnum, dueDayOfMonth, contributionAmount, penaltyPercentage };
  };

  const buildUpdatePayload = (): UpdateContributionMetricPayload | null => {
    const dueDayOfMonth = parseInt(formData.dueDayOfMonth, 10);
    const contributionAmount = parseFloat(formData.contributionAmount);
    const penaltyPercentage = parseFloat(formData.penaltyPercentage);
    if (isNaN(dueDayOfMonth) || dueDayOfMonth < 1 || dueDayOfMonth > 31) {
      setError('Due day must be between 1 and 31'); return null;
    }
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      setError('Contribution amount must be greater than 0'); return null;
    }
    if (isNaN(penaltyPercentage) || penaltyPercentage < 0) {
      setError('Penalty percentage must be 0 or more'); return null;
    }
    return { dueDayOfMonth, contributionAmount, penaltyPercentage, metricStatus: true };
  };

  const handleAddMetric = async () => {
    const payload = buildAddPayload(); if (!payload) return;
    setLoading(true); setError(null);
    console.log('[ContributionMetrics] Adding metric:', payload);
    try {
      await contributionMetricApi.addMetric(payload);
      setSuccessMessage(`Metric added — due on the ${ordinal(payload.dueDayOfMonth)} of each ${payload.periodEnum.toLowerCase()}`);
      closeForm(); fetchMetrics();
    } catch (err: any) { setError(err.message || 'Failed to add metric'); }
    finally { setLoading(false); }
  };

  const handleUpdateMetric = async () => {
    if (!currentMetricId) return;
    const payload = buildUpdatePayload(); if (!payload) return;
    setLoading(true); setError(null);
    try {
      await contributionMetricApi.updateMetric(currentMetricId, payload);
      setSuccessMessage('Metric updated successfully!');
      closeForm(); fetchMetrics();
    } catch (err: any) { setError(err.message || 'Failed to update metric'); }
    finally { setLoading(false); }
  };

  const handleDeleteMetric = async (id: number) => {
    setDeleting(true); setError(null);
    try {
      await contributionMetricApi.deleteMetric(id);
      setSuccessMessage('Metric deleted successfully!');
      setDeleteConfirmId(null); fetchMetrics();
    } catch (err: any) { setError(err.message || 'Failed to delete metric'); }
    finally { setDeleting(false); }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    isEditing ? handleUpdateMetric() : handleAddMetric();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contribution Metrics</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage contribution periods, amounts, and penalty settings.{' '}
              <span className="text-amber-600 font-medium">
                An active metric must exist before members can submit contributions.
              </span>
            </p>
          </div>
          <button onClick={openAddForm}
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 border border-transparent
                     text-sm font-medium rounded-lg shadow-sm text-white bg-green-700
                     hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2
                     focus:ring-green-500 transition-colors duration-200">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Metric
          </button>
        </div>

        {/* No-metric warning — explains the "no metric found" contribution error */}
        {!loading && metrics.length === 0 && (
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-md">
            <p className="text-sm text-amber-800 font-medium">
              ⚠️ No contribution metrics configured. Members will receive a "no metric found" error when trying to make contributions. Please add a metric first.
            </p>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex">
            <svg className="h-5 w-5 text-red-400 shrink-0 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex">
            <svg className="h-5 w-5 text-green-400 shrink-0 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-green-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-green-200">
              <thead className="bg-green-50">
                <tr>
                  {['ID', 'Period', 'Due Day', 'Amount (KES)', 'Penalty %', 'Status', 'Actions'].map(h => (
                    <th key={h} scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-100">
                {loading && metrics.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
                        <span className="ml-3 text-gray-600">Loading metrics…</span>
                      </div>
                    </td>
                  </tr>
                ) : metrics.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p className="text-sm font-medium text-gray-800">No metrics found</p>
                      <p className="mt-1 text-sm text-gray-600">Add a metric to enable member contributions.</p>
                    </td>
                  </tr>
                ) : (
                  metrics.map(metric => (
                    <tr key={metric.id} className="hover:bg-green-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">#{metric.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {metric.periodEnum}
                        </span>
                      </td>
                      {/* FIX: Display actual day number with ordinal suffix */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                        {ordinal(metric.dueDayOfMonth)} of month
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                        {formatCurrency(metric.contributionAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        {metric.penaltyPercentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                          metric.metricStatus !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {metric.metricStatus !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => openEditForm(metric)}
                          className="text-gray-700 hover:text-green-900 mr-4 transition-colors" title="Edit metric">
                          <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteConfirmId(metric.id ?? null)}
                          className="text-red-600 hover:text-red-900 transition-colors" title="Delete metric">
                          <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeForm} />
            <div className="relative inline-block bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {isEditing ? 'Edit Contribution Metric' : 'Add New Contribution Metric'}
                </h3>
                <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Period */}
                <div>
                  <label htmlFor="periodEnum" className="block text-sm font-medium text-gray-700 mb-2">
                    Contribution Period *
                  </label>
                  <select id="periodEnum" name="periodEnum" value={formData.periodEnum} onChange={handleInputChange}
                    className="block w-full px-4 py-3 rounded-lg border border-green-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700 bg-white transition-colors"
                    required>
                    <option value="MONTHLY">Monthly</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>

                {/* Due Day — FIX: string state, parseInt on submit */}
                <div>
                  <label htmlFor="dueDayOfMonth" className="block text-sm font-medium text-gray-700 mb-2">
                    Due Day of Month * (1–31)
                  </label>
                  <input type="number" id="dueDayOfMonth" name="dueDayOfMonth"
                    value={formData.dueDayOfMonth} onChange={handleInputChange}
                    min="1" max="31" step="1"
                    className="block w-full px-4 py-3 rounded-lg border border-green-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700 placeholder-gray-400 transition-colors"
                    placeholder="e.g. 5" required />
                  {formData.dueDayOfMonth && !isNaN(parseInt(formData.dueDayOfMonth, 10)) && parseInt(formData.dueDayOfMonth, 10) >= 1 && (
                    <p className="mt-1 text-xs text-green-700 font-medium">
                      Due on the {ordinal(parseInt(formData.dueDayOfMonth, 10))} of each month
                    </p>
                  )}
                </div>

                {/* Amount — FIX: string state, parseFloat on submit */}
                <div>
                  <label htmlFor="contributionAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Contribution Amount (KES) *
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-green-500 sm:text-sm font-medium">KES</span>
                    </div>
                    <input type="number" id="contributionAmount" name="contributionAmount"
                      value={formData.contributionAmount} onChange={handleInputChange}
                      min="1" step="0.01"
                      className="block w-full pl-12 pr-4 py-3 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700 placeholder-gray-400 transition-colors"
                      placeholder="5000.00" required />
                  </div>
                  {formData.contributionAmount && !isNaN(parseFloat(formData.contributionAmount)) && (
                    <p className="mt-1 text-xs text-green-700 font-medium">
                      {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(parseFloat(formData.contributionAmount))}
                    </p>
                  )}
                </div>

                {/* Penalty — FIX: string state, parseFloat on submit */}
                <div>
                  <label htmlFor="penaltyPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                    Penalty Percentage (%) *
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <input type="number" id="penaltyPercentage" name="penaltyPercentage"
                      value={formData.penaltyPercentage} onChange={handleInputChange}
                      min="0" max="100" step="0.1"
                      className="block w-full pr-12 px-4 py-3 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700 placeholder-gray-400 transition-colors"
                      placeholder="2" required />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-green-500 sm:text-sm font-medium">%</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">Penalty applied for late contributions</p>
                </div>

                {/* Payload preview */}
                {formData.dueDayOfMonth && formData.contributionAmount && formData.penaltyPercentage && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      POST /tujipange/api/v1/contributions_management/metrics
                    </p>
                    <pre className="text-xs font-mono text-gray-700">
{JSON.stringify({
  periodEnum: formData.periodEnum,
  dueDayOfMonth: parseInt(formData.dueDayOfMonth, 10) || '',
  contributionAmount: parseFloat(formData.contributionAmount) || '',
  penaltyPercentage: parseFloat(formData.penaltyPercentage) || '',
}, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-4 border-t border-green-100">
                  <button type="button" onClick={closeForm}
                    className="inline-flex items-center px-5 py-2.5 border border-green-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {loading ? (
                      <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />{isEditing ? 'Updating…' : 'Adding…'}</>
                    ) : (isEditing ? 'Update Metric' : 'Add Metric')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setDeleteConfirmId(null)} />
            <div className="relative inline-block bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl sm:my-8 sm:max-w-md sm:w-full sm:p-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Contribution Metric</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete metric #{deleteConfirmId}? This cannot be undone and may prevent contributions from being processed.
                </p>
                <div className="flex justify-center gap-4">
                  <button type="button" onClick={() => setDeleteConfirmId(null)}
                    className="inline-flex items-center px-5 py-2.5 border border-green-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors">
                    Cancel
                  </button>
                  <button type="button" onClick={() => handleDeleteMetric(deleteConfirmId!)} disabled={deleting}
                    className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {deleting ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Deleting…</> : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributionMetrics;
