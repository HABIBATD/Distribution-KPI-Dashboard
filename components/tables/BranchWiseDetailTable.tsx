
import React from 'react';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';

interface BranchWiseDetailTableProps {
  title: string;
  data: { name: string; value: number }[];
  valueType?: 'currency' | 'number' | 'percentage';
  valueLabel?: string;
}

const BranchWiseDetailTable: React.FC<BranchWiseDetailTableProps> = ({ title, data, valueType, valueLabel }) => {
  const formatValue = (value: number) => {
    switch (valueType) {
      case 'currency':
        return formatCurrency(value);
      case 'number':
        return formatNumber(value);
      case 'percentage':
        return formatPercentage(value);
      default:
        return value.toString();
    }
  };

  const headerLabel = valueLabel || 'Value';

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white/90 p-4 bg-slate-100 dark:bg-white/5 rounded-t-lg">{title} by Branch</h3>
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-xs text-slate-700 dark:text-slate-400 uppercase bg-slate-200 dark:bg-white/5 sticky top-0">
            <tr>
                <th scope="col" className="py-3 px-6">Branch Name</th>
                <th scope="col" className="py-3 px-6 text-right">{headerLabel}</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item) => (
                <tr key={item.name} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/10">
                <th scope="row" className="py-4 px-6 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    {item.name}
                </th>
                <td className="py-4 px-6 text-right font-semibold">{formatValue(item.value)}</td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default BranchWiseDetailTable;