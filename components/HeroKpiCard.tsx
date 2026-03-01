
import React from 'react';
import { Kpi, KpiId } from '../types';
import { ArrowRight } from 'lucide-react';

interface HeroKpiCardProps {
  kpi: Kpi;
  onSelect: (kpiId: KpiId) => void;
  Icon: React.ElementType;
}

const HeroKpiCard: React.FC<HeroKpiCardProps> = ({ kpi, onSelect, Icon }) => {
  const valueLength = kpi.value.length;
  let valueFontSize = 'text-5xl';
  if (valueLength > 8) {
    valueFontSize = 'text-4xl';
  }
  if (valueLength > 12) {
    valueFontSize = 'text-3xl';
  }

  const cardClasses = 'bg-white dark:bg-white/10 dark:backdrop-blur-lg border border-slate-200 dark:border-white/20 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/20 shadow-lg hover:shadow-xl';
  const titleClasses = 'text-slate-600 dark:text-white/80';
  const detailsTextClasses = 'text-slate-500 dark:text-white/60 group-hover:text-slate-700 dark:group-hover:text-white';
  const arrowClasses = 'text-slate-500 dark:text-white/60';
  const iconBgClasses = 'text-slate-100/80 dark:text-white/5';

  return (
    <div
      onClick={() => onSelect(kpi.id)}
      className={`rounded-2xl dark:shadow-2xl p-6 flex flex-col justify-between cursor-pointer group transition-all duration-300 hover:-translate-y-1 relative overflow-hidden min-h-[180px] ${cardClasses}`}
    >
        <Icon className={`absolute -right-6 -bottom-6 ${iconBgClasses}`} size={140} strokeWidth={1} />

        <div className="z-10">
            <p className={`text-lg font-semibold ${titleClasses}`}>{kpi.title}</p>
            <p className={`${valueFontSize} font-bold mt-2 break-words`}>{kpi.value}</p>
        </div>
        
        <div className="z-10 flex justify-end items-center mt-4">
            <p className={`text-sm transition-colors ${detailsTextClasses}`}>View Details</p>
            <ArrowRight className={`h-4 w-4 ml-1 transform -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${arrowClasses}`} />
        </div>
    </div>
  );
};

export default HeroKpiCard;