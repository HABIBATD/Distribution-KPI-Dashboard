
import React, { useState } from 'react';
import { AppData } from '../../types';
import BranchCompanySalesTable from '../tables/BranchCompanySalesTable';

interface DailyBranchCompanySalesProps {
    data: AppData['branchCompanySales'];
}

const DailyBranchCompanySales: React.FC<DailyBranchCompanySalesProps> = ({ data }) => {
    const branches = Object.keys(data);

    if (branches.length === 0) {
        return <p className="text-slate-500 dark:text-slate-400">No company-wise sales data available for any branch.</p>;
    }

    const [activeBranch, setActiveBranch] = useState<string>(branches[0]);
    
    const activeBranchData = data[activeBranch];

    return (
        <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white/90 mb-4">Daily Company-Wise Sales by Branch</h3>
            <div className="border-b border-slate-300 dark:border-slate-700">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {branches.map((branch) => (
                        <button
                            key={branch}
                            onClick={() => setActiveBranch(branch)}
                            className={`
                                ${activeBranch === branch
                                ? 'border-brand-accent text-brand-accent'
                                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500'}
                                whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
                            `}
                        >
                            {branch}
                        </button>
                    ))}
                </nav>
            </div>

            {activeBranchData && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                   <BranchCompanySalesTable 
                        title="By Value"
                        data={activeBranchData.byValue}
                        valueType="currency"
                   />
                   <BranchCompanySalesTable 
                        title="By Volume"
                        data={activeBranchData.byVolume}
                        valueType="number"
                   />
                </div>
            )}
        </div>
    );
};

export default DailyBranchCompanySales;