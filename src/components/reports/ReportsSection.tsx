import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Users, 
  CreditCard, 
  DollarSign 
} from 'lucide-react';

export const ReportsSection: React.FC = () => {
  const reports = [
    {
      title: 'Member Reports',
      description: 'Total members, new registrations, KYC status',
      icon: Users,
      color: 'blue',
      stats: [
        { label: 'Total Members', value: '2,547' },
        { label: 'New This Month', value: '234' },
        { label: 'KYC Verified', value: '2,103' }
      ]
    },
    {
      title: 'Loan Performance',
      description: 'Active loans, disbursements, collection rates',
      icon: CreditCard,
      color: 'green',
      stats: [
        { label: 'Active Loans', value: '1,234' },
        { label: 'Total Portfolio', value: '$12.4M' },
        { label: 'Collection Rate', value: '94.2%' }
      ]
    },
    {
      title: 'Disbursement Reports',
      description: 'Loan disbursements by product and period',
      icon: DollarSign,
      color: 'amber',
      stats: [
        { label: 'This Month', value: '$2.4M' },
        { label: 'Last Month', value: '$2.1M' },
        { label: 'Growth', value: '+14.3%' }
      ]
    },
    {
      title: 'Financial Overview',
      description: 'Revenue, interest earned, operational metrics',
      icon: TrendingUp,
      color: 'teal',
      stats: [
        { label: 'Revenue MTD', value: '$456K' },
        { label: 'Interest Earned', value: '$324K' },
        { label: 'Operating Margin', value: '23.4%' }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      amber: 'bg-amber-100 text-amber-600',
      teal: 'bg-teal-100 text-teal-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">View detailed reports and performance metrics</p>
        </div>
        <Button className="flex items-center gap-2">
          <Download size={16} />
          Export All Reports
        </Button>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reports.map((report, index) => {
          const Icon = report.icon;
          return (
            <Card key={index} hover className="relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(report.color)}`}>
                  <Icon size={24} />
                </div>
                <Button variant="ghost" size="sm">
                  <BarChart3 size={16} />
                </Button>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              
              <div className="space-y-2">
                {report.stats.map((stat, statIndex) => (
                  <div key={statIndex} className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">{stat.label}</span>
                    <span className="text-sm font-medium text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Portfolio Chart */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Loan Portfolio by Product</h3>
            <Button variant="ghost" size="sm">
              <Download size={16} />
            </Button>
          </div>
          
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Chart visualization will be here</p>
              <p className="text-sm text-gray-500">Integration with charting library needed</p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-blue-600">45%</p>
              <p className="text-sm text-gray-600">M-Loan</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-green-600">35%</p>
              <p className="text-sm text-gray-600">Q-Loan</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-amber-600">20%</p>
              <p className="text-sm text-gray-600">Y-Loan</p>
            </div>
          </div>
        </Card>

        {/* Collection Rates */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Collection Rates</h3>
            <Button variant="ghost" size="sm">
              <Download size={16} />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Month</span>
              <span className="text-lg font-semibold text-green-600">94.2%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '94.2%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Month</span>
              <span className="text-lg font-semibold text-blue-600">92.8%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92.8%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">3 Months Ago</span>
              <span className="text-lg font-semibold text-amber-600">89.5%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-amber-600 h-2 rounded-full" style={{ width: '89.5%' }}></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="ghost" className="flex items-center gap-2 justify-center py-3">
            <Download size={16} />
            Export to PDF
          </Button>
          <Button variant="ghost" className="flex items-center gap-2 justify-center py-3">
            <Download size={16} />
            Export to Excel
          </Button>
          <Button variant="ghost" className="flex items-center gap-2 justify-center py-3">
            <Download size={16} />
            Export to CSV
          </Button>
        </div>
      </Card>
    </div>
  );
};