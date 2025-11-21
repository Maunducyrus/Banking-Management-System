import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'kyc' | 'loan' | 'application';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'default' }) => {
  const getStatusClasses = () => {
    const statusLower = status.toLowerCase();
    
    if (variant === 'kyc') {
      switch (statusLower) {
        case 'verified':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'rejected':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
    
    if (variant === 'loan') {
      switch (statusLower) {
        case 'active':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'closed':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'defaulted':
          return 'bg-red-100 text-red-800 border-red-200';
        case 'written_off':
          return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
    
    if (variant === 'application') {
      switch (statusLower) {
        case 'approved':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'under_review':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'rejected':
          return 'bg-red-100 text-red-800 border-red-200';
        case 'submitted':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'draft':
          return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
    
    // Default status colors
    switch (statusLower) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${getStatusClasses()}
    `}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  );
};