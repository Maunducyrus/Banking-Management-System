import React from 'react';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { Clock } from 'lucide-react';

export const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: '1',
      type: 'loan_application',
      description: 'New loan application from John Doe',
      amount: 'Ksh 50,000',
      status: 'submitted',
      timestamp: '2 minutes ago'
    },
    {
      id: '2',
      type: 'loan_approval',
      description: 'Loan approved for Sarah Wilson',
      amount: 'Ksh 25,000',
      status: 'approved',
      timestamp: '15 minutes ago'
    },
    {
      id: '3',
      type: 'payment',
      description: 'Payment received from Mike Johnson',
      amount: 'Ksh 2,450',
      status: 'completed',
      timestamp: '1 hour ago'
    },
    {
      id: '4',
      type: 'kyc_verification',
      description: 'KYC verified for Emma Davis',
      amount: '',
      status: 'verified',
      timestamp: '2 hours ago'
    },
    {
      id: '5',
      type: 'loan_disbursement',
      description: 'Loan disbursed to Robert Brown',
      amount: 'Ksh 75,000',
      status: 'disbursed',
      timestamp: '3 hours ago'
    }
  ];

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {activity.description}
              </p>
              {activity.amount && (
                <p className="text-sm font-semibold text-blue-600 mt-1">
                  {activity.amount}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {activity.timestamp}
              </p>
            </div>
            <div className="ml-4">
              <StatusBadge status={activity.status} variant="application" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Activities
        </button>
      </div>
    </Card>
  );
};