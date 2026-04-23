// ─── src/components/contributions/MakeContribution.tsx ───────────────────────
// Endpoint: POST /api/v1/contributions

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { DollarSign, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { contributionsApi, membersApi } from '../../services/api';
import toast from 'react-hot-toast';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-KE', {
    style: 'currency', currency: 'KES', maximumFractionDigits: 0,
  }).format(n);

export const MakeContribution: React.FC = () => {
  const [members,        setMembers]        = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [memberNumber,   setMemberNumber]   = useState('');
  const [amount,         setAmount]         = useState('');
  const [submitting,     setSubmitting]     = useState(false);
  const [lastSuccess,    setLastSuccess]    = useState<any>(null);
  const [fieldError,     setFieldError]     = useState('');
  
  // Fetch live members for dropdown

  useEffect(() => {
  const fetchMembers = async () => {
    try {
      const res = await membersApi.getAllMembers();

      console.log("MEMBERS RESPONSE:", res);

      const membersList =
        res?.content ??       
        res?.data?.content ??
        res?.data ??
        [];

      setMembers(Array.isArray(membersList) ? membersList : []);
    } catch (err) {
      console.error("Failed to fetch members", err);
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  fetchMembers();
}, []);

  const validate = (): boolean => {
    if (!memberNumber.trim()) { setFieldError('Member number is required.'); return false; }
    if (!amount || Number(amount) <= 0) { setFieldError('Enter a valid amount greater than 0.'); return false; }
    setFieldError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setLastSuccess(null);
    try {
      const res = await contributionsApi.makeContribution({
        memberNumber: memberNumber.trim(),
        contributedAmount: parseFloat(amount),
      });
      setLastSuccess(res);
      toast.success(`Contribution of ${fmt(parseFloat(amount))} recorded!`);
      setMemberNumber('');
      setAmount('');
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to record contribution');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <DollarSign size={20} className="text-green-600" />
          Record a Contribution
        </h3>
        
        {/* <p className="text-xs text-gray-400 mt-0.5 font-mono">
          POST /api/v1/contributions
        </p> */}
              {/* <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-xs text-blue-600 mt-2"
          >
            Toggle Debug
          </button> */}
      </div>

      {/* Success result */}
      {lastSuccess && (
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 text-sm">Contribution recorded successfully!</p>
            <div className="mt-1.5 space-y-0.5 text-xs text-green-700 font-mono">
              {lastSuccess.memberNumber && <p>Member: {lastSuccess.memberNumber}</p>}
              {(lastSuccess.contributedAmount ?? lastSuccess.amount) != null && (
                <p>Amount: {fmt(lastSuccess.contributedAmount ?? lastSuccess.amount)}</p>
              )}
              {lastSuccess.id && <p>ID: {lastSuccess.id}</p>}
              {(lastSuccess.contributionDate ?? lastSuccess.createdAt) && (
                <p>Date: {new Date(lastSuccess.contributionDate ?? lastSuccess.createdAt).toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Member picker */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Member Number <span className="text-red-500">*</span>
          </label>

          {loadingMembers ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
              <LoadingSpinner /> Loading members…
            </div>
          ) : (
            <div className="space-y-2">
              {/* Dropdown populated from live API */}
              <div className="relative">
                <select
                  value={memberNumber}
                  onChange={e => { setMemberNumber(e.target.value); setFieldError(''); setLastSuccess(null); }}
                  className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  <option value="">— Select a member —</option>
                  {members.map((m: any) => (
                    <option key={m.memberNumber ?? m.id} value={m.memberNumber ?? m.id}>
                      {m.firstName} {m.lastName} &nbsp;({m.memberNumber ?? m.id})
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Manual override */}
              <input
                type="text"
                value={memberNumber}
                onChange={e => { setMemberNumber(e.target.value); setFieldError(''); setLastSuccess(null); }}
                placeholder="Or type member number e.g. WM-30023456-1"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono placeholder:font-sans"
              />
            </div>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Contribution Amount (Ksh) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">Ksh</span>
            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={e => { setAmount(e.target.value); setFieldError(''); }}
              placeholder="5000.00"
              className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {amount && Number(amount) > 0 && (
            <p className="text-xs text-green-600 font-semibold mt-1">{fmt(Number(amount))}</p>
          )}
        </div>

        {/* Validation error */}
        {fieldError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
            <AlertCircle size={15} className="text-red-600 shrink-0" />
            <p className="text-red-700 text-sm">{fieldError}</p>
          </div>
        )}

        {/* Payload preview */}
        {/* {memberNumber && amount && Number(amount) > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <p className="text-xs text-gray-500 font-medium mb-1">Request body:</p>
            <pre className="text-xs text-gray-700 font-mono">
{JSON.stringify({ memberNumber: memberNumber.trim(), contributedAmount: parseFloat(amount) }, null, 2)}
            </pre>
          </div>
        )} */}

        <Button
          type="submit"
          loading={submitting}
          className="w-full py-3 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <DollarSign size={16} />
          {submitting ? 'Recording…' : 'Record Contribution'}
        </Button>
      </form>
    </Card>
  );
  
};
