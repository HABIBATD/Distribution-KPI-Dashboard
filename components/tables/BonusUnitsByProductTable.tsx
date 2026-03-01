
import React from 'react';
import { formatNumber } from '../../utils/formatters';

interface BonusUnitsByProductTableProps {
  data: {
    productName: string;
    branch: string;
    units: number;
  }[];
}

const BonusUnitsByProductTable: React.FC<BonusUnitsByProductTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center py-10 bg-slate-100 dark:bg-slate-800/50 rounded-lg text-slate-500 dark:text-slate-400">No bonus units were issued on the latest day.</p>;
  }
  
  const totalUnits = data.reduce((sum, item) => sum + item.units, 0);

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white/90 p-4 bg-slate-100 dark:bg-white/5 rounded-t-lg">Daily Bonus Units by Product</h3>
        <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                <thead className="text-xs text-slate-700 dark:text-slate-400 uppercase bg-slate-200 dark:bg-white/5 sticky top-0">
                <tr>
                    <th scope="col" className="py-3 px-6">Product Name</th>
                    <th scope="col" className="py-3 px-6">Branch</th>
                    <th scope="col" className="py-3 px-6 text-right">Bonus Units</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={`${item.productName}-${item.branch}-${index}`} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/10">
                    <th scope="row" className="py-4 px-6 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {item.productName}
                    </th>
                    <td className="py-4 px-6">{item.branch}</td>
                    <td className="py-4 px-6 text-right font-semibold">{formatNumber(item.units)}</td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                    <tr className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-white/10 border-t-2 border-slate-300 dark:border-slate-600">
                        <th scope="row" colSpan={2} className="py-3 px-6 text-base text-left">Total Bonus Units</th>
                        <td className="py-3 px-6 text-right text-base">{formatNumber(totalUnits)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
  );
};

export default BonusUnitsByProductTable;