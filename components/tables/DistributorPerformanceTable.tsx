
import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { AlertCircle } from 'lucide-react';

interface DistributorPerformanceTableProps {
  data: {
    id: string;
    name: string;
    sales: number;
    limit: number;
    exceedsLimit: boolean;
  }[];
}

const DistributorPerformanceTable: React.FC<DistributorPerformanceTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700/50">
          <tr>
            <th scope="col" className="py-3 px-6">Distributor Name</th>
            <th scope="col" className="py-3 px-6">Sales</th>
            <th scope="col" className="py-3 px-6">Limit</th>
            <th scope="col" className="py-3 px-6">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((distributor) => (
            <tr key={distributor.id} className={`border-b border-slate-200 dark:border-slate-700 ${distributor.exceedsLimit ? 'bg-red-50 dark:bg-red-900/20' : 'bg-transparent'} hover:bg-slate-50 dark:hover:bg-slate-700/50`}>
              <th scope="row" className="py-4 px-6 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                {distributor.name}
              </th>
              <td className="py-4 px-6">{formatCurrency(distributor.sales)}</td>
              <td className="py-4 px-6">{formatCurrency(distributor.limit)}</td>
              <td className="py-4 px-6">
                {distributor.exceedsLimit ? (
                  <span className="inline-flex items-center bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                    <AlertCircle className="w-4 h-4 mr-1"/>
                    Exceeds Limit
                  </span>
                ) : (
                  <span className="inline-flex items-center bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                    Within Limit
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DistributorPerformanceTable;