
import React from 'react';
import { Kpi, KpiId } from '../types';
import { ArrowRight } from 'lucide-react';

interface KpiCardProps {
  kpi: Kpi;
  onSelect: (kpiId: KpiId) => void;
  Icon: React.ElementType;
}

const KpiCard: React.FC<KpiCardProps> = ({ kpi, onSelect, Icon }) => {
  
  const valueLength = kpi.value.length;
  let valueFontSize = 'text-3xl';
  if (valueLength > 8) {
    valueFontSize = 'text-2xl';
  }
  if (valueLength > 12) {
    valueFontSize = 'text-xl';
  }
  
  const cardClasses = 'bg-white dark:bg-white/10 dark:backdrop-blur-lg border border-slate-200 dark:border-white/20 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/20 shadow-md hover:shadow-lg';
  const titleClasses = 'text-slate-600 dark:text-white/80';
  const detailsTextClasses = 'text-slate-500 dark:text-white/60 group-hover:text-slate-700 dark:group-hover:text-white';
  const arrowClasses = 'text-slate-500 dark:text-white/60';

  return (
    <div
      onClick={() => onSelect(kpi.id)}
      className={`rounded-2xl p-4 flex flex-col justify-between cursor-pointer group transition-all duration-300 hover:-translate-y-1 ${cardClasses}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className={`text-base font-semibold ${titleClasses}`}>{kpi.title}</p>
          <p className={`${valueFontSize} font-bold mt-2 break-words`}>{kpi.value}</p>
        </div>
        <Icon className="h-8 w-8 text-brand-accent opacity-80" />
      </div>
      
      <div className="flex justify-end items-center mt-4">
        <p className={`text-xs transition-colors ${detailsTextClasses}`}>View Details</p>
        <ArrowRight className={`h-4 w-4 ml-1 transform -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${arrowClasses}`} />
      </div>
    </div>
  );
};

export default KpiCard;