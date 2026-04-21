// ─── src/components/contributions/ContributionsPage.tsx ──────────────────────

import React, { useState } from 'react';
import { DollarSign, List, TrendingUp } from 'lucide-react';
import { MakeContribution }  from './MakeContribution';
import { ContributionsList } from './ContributionsList';
import { MemberStatement }   from './MemberStatement';

type Tab = 'make' | 'list' | 'statement';

const TABS: { id: Tab; label: string; icon: React.ElementType; endpoint: string }[] = [
  { id: 'make',      label: 'Make Contribution', icon: DollarSign, endpoint: 'POST /api/v1/contributions'                     },
  { id: 'list',      label: 'All Contributions',  icon: List,       endpoint: 'GET  /api/v1/contributions'                     },
  { id: 'statement', label: 'Member Statement',   icon: TrendingUp, endpoint: 'GET  /api/v1/contributionsStatement/:memberNumber'},
];

const ContributionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('make');
  // const activeTabData = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign size={26} className="text-green-600" />
            Contributions
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Record and track member welfare contributions
          </p>
        </div>
        <div className="text-right hidden sm:block">
          {/* <p className="text-xs text-gray-400">Active endpoint</p> */}
          {/* <p className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded mt-0.5">
            {activeTabData.endpoint}
          </p> */}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-200">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === id
                ? 'border-green-600 text-green-700 bg-green-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'make'      && <MakeContribution />}
        {activeTab === 'list'      && <ContributionsList />}
        {activeTab === 'statement' && <MemberStatement />}
      </div>
    </div>
  );
};

export default ContributionsPage;
