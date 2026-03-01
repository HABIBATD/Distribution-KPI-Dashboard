
import React from 'react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface BranchCompanySalesTableProps {
  title: string;
  data: { name: string; value: number }[];
  valueType: 'currency' | 'number';
}

const BranchCompanySalesTable: React.FC<BranchCompanySalesTableProps> = ({ title, data, valueType }) => {
  const formatValue = (value: number) => {
    return valueType === 'currency' ? formatCurrency(value) : formatNumber(value);
  };

  const headerLabel = valueType === 'currency' ? 'Value' : 'Volume';

  return (
    <div>
      <h4 className="text-lg font-semibold text-slate-700 dark:text-white/80 mb-2">{title}</h4>
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <div className="max-h-60 overflow-y-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
              <thead className="text-xs text-slate-700 dark:text-slate-400 uppercase bg-slate-100 dark:bg-white/10 sticky top-0">
              <tr>
                  <th scope="col" className="py-2 px-4">Company Name</th>
                  <th scope="col" className="py-2 px-4 text-right">{headerLabel}</th>
              </tr>
              </thead>
              <tbody>
              {data.map((item) => (
                  <tr key={item.name} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/10">
                  <th scope="row" className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {item.name}
                  </th>
                  <td className="py-3 px-4 text-right font-semibold">{formatValue(item.value)}</td>
                  </tr>
              ))}
              </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BranchCompanySalesTable;