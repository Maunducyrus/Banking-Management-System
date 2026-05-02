import React, { useState, useEffect } from 'react';
import { contributionMetricApi } from '../../services/api';
import type {
  AddContributionMetricPayload,
  UpdateContributionMetricPayload,
} from '../../services/api';

interface ContributionMetric {
  id?: number | string;
  periodEnum: 'MONTHLY' | 'WEEKLY' | 'YEARLY';
  dueDayOfMonth: number; // Keep this for the form, calculate from nextDueDate
  nextDueDate: string;
  contributionAmount: number;
  penaltyPercentage: number;
  metricStatus?: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

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

// Helper: Extract day of month from date string
function getDayFromDate(dateString: string): number {
  if (!dateString) return 0;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? 0 : date.getDate();
}

// FIXED: Transform backend data to include dueDayOfMonth
function extractMetrics(res: any): ContributionMetric[] {
  if (!res) return [];
  const raw = res?.data ?? res?.content ?? res;
  const list = Array.isArray(raw?.[0]) ? raw[0] : raw;
  
  if (!Array.isArray(list)) return [];
  
  // Map backend response to include dueDayOfMonth
  return list.map((item: any) => ({
    ...item,
    // Calculate dueDayOfMonth from nextDueDate if not provided by backend
    dueDayOfMonth: item.dueDayOfMonth ?? getDayFromDate(item.nextDueDate),
    // Ensure numeric fields are numbers
    contributionAmount: Number(item.contributionAmount),
    penaltyPercentage: Number(item.penaltyPercentage),
  }));
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(n);
}

function ordinal(n: number): string {
  if (!n || n === 0) return '';
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
      const transformed = extractMetrics(response);
      console.log('[ContributionMetrics] transformed metrics:', transformed);
      setMetrics(transformed);
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
    setCurrentMetricId(typeof metric.id === 'string' ? parseInt(metric.id) : (metric.id ?? null));
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const closeForm = () => { setIsFormOpen(false); setIsEditing(false); resetForm(); };

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
    console.log('[ContributionMetrics] Adding metric - payload:', payload);
    try {
      await contributionMetricApi.addMetric(payload);
      setSuccessMessage(`Metric added — due on the ${ordinal(payload.dueDayOfMonth)} of each month`);
      closeForm(); fetchMetrics();
    } catch (err: any) { setError(err.message || 'Failed to add metric'); }
    finally { setLoading(false); }
  };

  const handleUpdateMetric = async () => {
    if (!currentMetricId) return;
    const payload = buildUpdatePayload(); if (!payload) return;
    setLoading(true); setError(null);
    console.log('[ContributionMetrics] Updating metric:', currentMetricId, payload);
    try {
      await contributionMetricApi.updateMetric(currentMetricId, payload);
      setSuccessMessage('Metric updated successfully!');
      closeForm(); fetchMetrics();
    } catch (err: any) { setError(err.message || 'Failed to update metric'); }
    finally { setLoading(false); }
  };

  const handleDeleteMetric = async (id: number | string) => {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    setDeleting(true); setError(null);
    try {
      await contributionMetricApi.deleteMetric(numericId);
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

        {/* No-metric warning */}
        {!loading && metrics.length === 0 && (
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-md">
            <p className="text-sm text-amber-800 font-medium">
              No contribution metrics configured. Members will receive a "no metric found" error when trying to make contributions. Please add a metric first.
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
                  {['ID', 'Period', 'Due Day', 'Amount (KES)', 'Penalty', 'Status', 'Actions'].map(h => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                        {metric.dueDayOfMonth ? `${ordinal(metric.dueDayOfMonth)} of month` : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                        {formatCurrency(metric.contributionAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        {metric.penaltyPercentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                          metric.metricStatus === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-500'
                        }`}>
                          {metric.metricStatus === 'ACTIVE' ? 'Active' : 'Inactive'}
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
                        <button onClick={() => setDeleteConfirmId(typeof metric.id === 'string' ? parseInt(metric.id) : (metric.id ?? null))}
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

                {/* Due Day */}
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

                {/* Amount */}
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
                      {formatCurrency(parseFloat(formData.contributionAmount))}
                    </p>
                  )}
                </div>

                {/* Penalty */}
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

                {/* Payload preview matching backend format */}
                {formData.dueDayOfMonth && formData.contributionAmount && formData.penaltyPercentage && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Request Body (matches backend schema)
                    </p>
                    <pre className="text-xs font-mono text-gray-700 bg-white p-2 rounded border">
{JSON.stringify({
  periodEnum: formData.periodEnum,
  dueDayOfMonth: parseInt(formData.dueDayOfMonth, 10),
  contributionAmount: parseFloat(formData.contributionAmount),
  penaltyPercentage: parseFloat(formData.penaltyPercentage),
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