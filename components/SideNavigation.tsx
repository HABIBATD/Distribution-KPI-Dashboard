
import React from 'react';
import { LayoutGrid, Building } from 'lucide-react';

interface SideNavigationProps {
    branches: string[];
    selectedBranch: string;
    onSelectBranch: (branch: string) => void;
}

const SideNavigation: React.FC<SideNavigationProps> = ({ branches, selectedBranch, onSelectBranch }) => {
    
    const asideClasses = 'bg-slate-100 dark:bg-black/10';
    const titleClasses = 'text-slate-900 dark:text-white/90';
    
    const getButtonClasses = (branchName: string) => {
        const isSelected = selectedBranch === branchName;
        return isSelected 
            ? 'bg-slate-200 dark:bg-white/20 text-slate-800 dark:text-white' 
            : 'text-slate-600 dark:text-white/70 hover:bg-slate-200/60 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white';
    };
    
    return (
        <aside className={`w-64 dark:backdrop-blur-lg p-4 flex-shrink-0 hidden md:block ${asideClasses}`} style={{ height: 'calc(100vh - 73px)'}}>
            <h2 className={`text-lg font-bold mb-4 px-2 ${titleClasses}`}>Branches</h2>
            <nav className="flex flex-col gap-1">
                <button
                    onClick={() => onSelectBranch('All Branches')}
                    className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${getButtonClasses('All Branches')}`}
                >
                    <LayoutGrid className="h-5 w-5 mr-3" />
                    All Branches
                </button>
                {branches.map(branch => (
                    <button
                        key={branch}
                        onClick={() => onSelectBranch(branch)}
                        className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${getButtonClasses(branch)}`}
                    >
                        <Building className="h-5 w-5 mr-3" />
                        {branch}
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default SideNavigation;