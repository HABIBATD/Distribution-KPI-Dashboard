
import React, { useState, useEffect } from 'react';
// FIX: Import RawDataRow to use for explicit type annotation.
import { Kpi, AppData, RawDataRow, HighDiscountDetail } from '../types';
import { ArrowLeft, Download, Save } from 'lucide-react';
import SalesTrendChart from './charts/SalesTrendChart';
import CompanySalesChart from './charts/CompanySalesChart';
import BranchWiseDetailTable from './tables/BranchWiseDetailTable';
import DssCollectionTable from './tables/DssCollectionTable';
import DailyBranchCompanySales from './analysis/DailyBranchCompanySales';
import { CSVLink } from 'react-csv';
import BonusUnitsByProductTable from './tables/BonusUnitsByProductTable';
import BranchWiseBarChart from './charts/BranchWiseBarChart';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';

// Component defined in-file to adhere to file constraints
const DistributorNetSalesTable: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
    return (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white/90 p-4 bg-slate-100 dark:bg-white/5 rounded-t-lg">Net Sales by Distributor</h3>
            <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                    <thead className="text-xs text-slate-700 dark:text-slate-400 uppercase bg-slate-200 dark:bg-white/5 sticky top-0">
                        <tr>
                            <th scope="col" className="py-3 px-6">Distributor Name</th>
                            <th scope="col" className="py-3 px-6 text-right">Net Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.name} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/10">
                                <th scope="row" className="py-4 px-6 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                                    {item.name}
                                </th>
                                <td className="py-4 px-6 text-right font-semibold">{formatCurrency(item.value)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Component defined in-file to adhere to file constraints
const BranchWiseCompanyInventory: React.FC<{ data: AppData['branchCompanyNetPurchases'] }> = ({ data }) => {
    const branches = Object.keys(data);
    
    if (branches.length === 0) {
        return (
             <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white/90 p-4 bg-slate-100 dark:bg-white/5 rounded-t-lg">Total Inventory Value By Company</h3>
                <div className="p-4 text-center text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5">
                    No company-wise inventory data available.
                </div>
            </div>
        )
    }
    
    const [activeBranch, setActiveBranch] = useState<string>(branches[0]);
    const activeBranchData = data[activeBranch];

    return (
        <div className="shadow-md sm:rounded-lg">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white/90 p-4 bg-slate-100 dark:bg-white/5 rounded-t-lg">Total Inventory Value By Company</h3>
            <div className="bg-slate-100 dark:bg-white/5 p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Note: The source data provides total inventory value per branch, not per company. This table shows Net Purchases (Purchases - Returns) which serves as a proxy for inventory contribution from each company within the selected branch.
                </p>
                <div className="border-b border-slate-300 dark:border-slate-700 mt-4">
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
            </div>

            {activeBranchData && (
                <div className="overflow-x-auto relative">
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                            <thead className="text-xs text-slate-700 dark:text-slate-400 uppercase bg-slate-200 dark:bg-white/5 sticky top-0">
                                <tr>
                                    <th scope="col" className="py-3 px-6">Company Name</th>
                                    <th scope="col" className="py-3 px-6 text-right">Net Purchase Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeBranchData.map((item) => (
                                    <tr key={item.name} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/10">
                                        <th scope="row" className="py-4 px-6 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                                            {item.name}
                                        </th>
                                        <td className="py-4 px-6 text-right font-semibold">{formatCurrency(item.value)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};


// Component defined in-file to adhere to file constraints
interface SkuPerformanceTableProps {
  title: string;
  data: { name: string; value: number }[];
  valueLabel: string;
  valueFormatter: (value: number) => string;
}

const SkuPerformanceTable: React.FC<SkuPerformanceTableProps> = ({ title, data, valueLabel, valueFormatter }) => {
  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white/90 p-4 bg-slate-100 dark:bg-white/5 rounded-t-lg">{title}</h3>
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
          <thead className="text-xs text-slate-700 dark:text-slate-400 uppercase bg-slate-200 dark:bg-white/5 sticky top-0">
            <tr>
              <th scope="col" className="py-3 px-6">SKU (Product Name)</th>
              <th scope="col" className="py-3 px-6 text-right">{valueLabel}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.name} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/10">
                <th scope="row" className="py-4 px-6 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                  {item.name}
                </th>
                <td className="py-4 px-6 text-right font-semibold">{valueFormatter(item.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const HighDiscountsTable: React.FC<{ data: HighDiscountDetail[] }> = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-center py-10 bg-slate-100 dark:bg-slate-800/50 rounded-lg text-slate-500 dark:text-slate-400">No transactions with discounts over 10% on the latest day.</p>;
    }

    return (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white/90 p-4 bg-slate-100 dark:bg-white/5 rounded-t-lg">High Discounts (&gt;10%) on Latest Day</h3>
            <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                    <thead className="text-xs text-slate-700 dark:text-slate-400 uppercase bg-slate-200 dark:bg-white/5 sticky top-0">
                        <tr>
                            <th scope="col" className="py-3 px-6">Distributor</th>
                            <th scope="col" className="py-3 px-6">Product (SKU)</th>
                            <th scope="col" className="py-3 px-6 text-right">Sale Value</th>
                            <th scope="col" className="py-3 px-6 text-right">Discount Value</th>
                            <th scope="col" className="py-3 px-6 text-right">Discount %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={`${item.invoice_id}-${index}`} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/10">
                                <td className="py-4 px-6 font-medium text-slate-900 dark:text-slate-100">{item.distributor_name}</td>
                                <td className="py-4 px-6">{item.product_name}</td>
                                <td className="py-4 px-6 text-right font-semibold">{formatCurrency(item.total_value)}</td>
                                <td className="py-4 px-6 text-right font-semibold">{formatCurrency(item.total_discount)}</td>
                                <td className="py-4 px-6 text-right font-semibold text-red-600 dark:text-red-400">{formatPercentage(item.discount_percent)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


interface DetailViewProps {
  kpi: Kpi;
  appData: AppData;
  onBack: () => void;
  selectedBranch: string;
  isExporting?: boolean;
  theme: 'light' | 'dark';
}

const DetailView: React.FC<DetailViewProps> = ({ kpi, appData, onBack, selectedBranch, isExporting = false, theme }) => {
    
    const [notes, setNotes] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const notesKey = `kpi-notes-${selectedBranch}-${kpi.id}`;

    useEffect(() => {
        const savedNotes = localStorage.getItem(notesKey);
        if (savedNotes) {
            setNotes(savedNotes);
        } else {
            setNotes('');
        }
    }, [notesKey]);

    const handleSaveNotes = () => {
        localStorage.setItem(notesKey, notes);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
    };
    
    const branchData = appData.branchWiseKpiData?.[kpi.id];
    const recordCount = appData.kpiData.recordCounts?.[kpi.id];
    
    const titleClasses = 'text-slate-900 dark:text-white/90';
    const descriptionClasses = 'text-slate-600 dark:text-white/70';
    const recordCountClasses = 'text-slate-500 dark:text-white/60';
    const sectionTitleClasses = 'text-slate-900 dark:text-white/90 border-slate-300 dark:border-white/20';
    const noDataClasses = 'bg-slate-100 dark:bg-black/10 text-slate-500 dark:text-white/70';
    const exportButtonClasses = 'bg-white dark:bg-white/10 dark:backdrop-blur-lg text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/20 border-slate-300 dark:border-white/20';
    const notesTextareaClasses = 'border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/50 focus:ring-brand-accent focus:border-brand-accent';
    
    // FIX: Add explicit types to callback parameters to resolve TypeScript inference issues.
    // This ensures that properties like 'distributor_name' and 'total_value' are correctly typed.
    const getNetSalesByDistributor = () => {
        const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
            list.reduce((previous, currentItem) => {
                const group = getKey(currentItem);
                if (!previous[group]) previous[group] = [];
                previous[group].push(currentItem);
                return previous;
            }, {} as Record<K, T[]>);
        
        const salesByDistributor = groupBy(appData.rawData.filter(r => r.transaction_type === 'sale'), (r: RawDataRow) => r.distributor_name);
        const returnsByDistributor = groupBy(appData.rawData.filter(r => r.transaction_type === 'return'), (r: RawDataRow) => r.distributor_name);
        const allDistributors = [...new Set([...Object.keys(salesByDistributor), ...Object.keys(returnsByDistributor)])];
        
        const netSalesByDistributor = allDistributors.map(distributor => {
            const totalSales = (salesByDistributor[distributor] || []).reduce((sum, r: RawDataRow) => sum + r.total_value, 0);
            const totalReturns = (returnsByDistributor[distributor] || []).reduce((sum, r: RawDataRow) => sum + r.total_value, 0);
            return { name: distributor, value: totalSales - totalReturns };
        }).sort((a,b) => b.value - a.value);

        return netSalesByDistributor;
    }

    const renderAdditionalContent = () => {
        const isAnimationActive = !isExporting;

        switch (kpi.id) {
            case 'dailyBusinessPosition':
                 return (
                    <>
                        <SalesTrendChart data={appData.dailyTrends} isAnimationActive={isAnimationActive} theme={theme} />
                        <div className="mt-8">
                            <DailyBranchCompanySales data={appData.branchCompanySales} />
                        </div>
                    </>
                );
            case 'totalSalesAllPrincipals':
            case 'dailySalesValue':
                return <SalesTrendChart data={appData.dailyTrends} isAnimationActive={isAnimationActive} theme={theme} />;
            case 'salesByValueCompanyWise':
                return <CompanySalesChart data={appData.kpiData.salesByValueCompanyWise} dataKey="value" title="Sales by Value" isAnimationActive={isAnimationActive} theme={theme} />;
             case 'salesByVolumeCompanyWise':
                return <CompanySalesChart data={appData.kpiData.salesByVolumeCompanyWise} dataKey="value" title="Sales by Volume" isAnimationActive={isAnimationActive} theme={theme} />;
            case 'highDiscountsToday': {
                const data = appData.highDiscountDetails;
                if (!data || data.length === 0) {
                    return <HighDiscountsTable data={data} />;
                }
                const totalTransactions = data.length;
                const totalSalesValue = data.reduce((sum, item) => sum + item.total_value, 0);
                const totalDiscountValue = data.reduce((sum, item) => sum + item.total_discount, 0);
                const averageDiscountPercent = totalSalesValue > 0 ? totalDiscountValue / totalSalesValue : 0;
                return (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-lg shadow-md">
                                <p className="text-sm text-slate-600 dark:text-slate-400">High-Discount Transactions</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatNumber(totalTransactions)}</p>
                            </div>
                            <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-lg shadow-md">
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Value of These Sales</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalSalesValue)}</p>
                            </div>
                            <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-lg shadow-md">
                                <p className="text-sm text-slate-600 dark:text-slate-400">Avg. Discount Percentage</p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatPercentage(averageDiscountPercent)}</p>
                            </div>
                        </div>
                        <HighDiscountsTable data={data} />
                    </div>
                );
            }
            case 'dailyCashDepositedAtBank':
            case 'dailyDssCollection':
                return <DssCollectionTable data={appData.dssPerformance} />;
            case 'dailyBonusUnits':
                return <BonusUnitsByProductTable data={appData.dailyBonusByProduct} />;
            case 'branchWiseBankBalance':
                if (branchData && branchData.length > 0) {
                    return <BranchWiseBarChart data={branchData} isAnimationActive={isAnimationActive} theme={theme} />;
                }
                return null;
            case 'totalPurchasesCompanyWise':
                return <CompanySalesChart data={appData.kpiData.totalPurchasesCompanyWise} dataKey="value" title="Purchases by Company" isAnimationActive={isAnimationActive} theme={theme} />;
            case 'totalPurchaseReturnsCompanyWise':
                return <CompanySalesChart data={appData.kpiData.totalPurchaseReturnsCompanyWise} dataKey="value" title="Purchase Returns by Company" isAnimationActive={isAnimationActive} theme={theme} />;
            case 'customerWiseMarketCredit':
                return <DistributorNetSalesTable data={getNetSalesByDistributor()} />;
            case 'companyWiseClaimableDiscount':
                return <CompanySalesChart data={appData.kpiData.companyWiseClaimableDiscount} dataKey="value" title="Claimable Discount by Company" isAnimationActive={isAnimationActive} theme={theme} />;
            case 'companyWiseNonClaimableDiscount':
                return <CompanySalesChart data={appData.kpiData.companyWiseNonClaimableDiscount} dataKey="value" title="Non-Claimable Discount by Company" isAnimationActive={isAnimationActive} theme={theme} />;
            case 'companyWiseLedgerBalances':
                return <CompanySalesChart data={appData.kpiData.companyWiseLedgerBalances} dataKey="value" title="Ledger Balance by Company" isAnimationActive={isAnimationActive} theme={theme} />;
            case 'top20SkusBySales':
                return <SkuPerformanceTable title="Top 20 SKUs by Sales Value" data={appData.kpiData.top20SkusBySales} valueLabel="Total Sales" valueFormatter={formatCurrency} />;
            case 'topSkusByProductiveCustomers':
                return <SkuPerformanceTable title="Top SKUs by Customer Reach" data={appData.kpiData.topSkusByProductiveCustomers} valueLabel="Unique Customers" valueFormatter={formatNumber} />;
            case 'totalInventoryInHand':
                return <BranchWiseCompanyInventory data={appData.branchCompanyNetPurchases} />;
            default:
                return null;
        }
    }
    
    const hasAdditionalContent = () => {
       const additionalContent = renderAdditionalContent();
       return additionalContent !== null;
    }

    const getCsvData = () => {
        if (branchData && !hasAdditionalContent()) {
            return branchData;
        }
        switch (kpi.id) {
            case 'dailyBusinessPosition':
            case 'totalSalesAllPrincipals':
            case 'dailySalesValue':
                return appData.dailyTrends;
            case 'salesByValueCompanyWise':
                return appData.kpiData.salesByValueCompanyWise;
            case 'salesByVolumeCompanyWise':
                return appData.kpiData.salesByVolumeCompanyWise;
            case 'highDiscountsToday':
                return appData.highDiscountDetails;
            case 'dailyCashDepositedAtBank':
            case 'dailyDssCollection':
                return appData.dssPerformance;
            case 'dailyBonusUnits':
                return appData.dailyBonusByProduct;
            case 'branchWiseBankBalance':
                return branchData;
            case 'totalPurchasesCompanyWise':
                return appData.kpiData.totalPurchasesCompanyWise;
            case 'totalPurchaseReturnsCompanyWise':
                return appData.kpiData.totalPurchaseReturnsCompanyWise;
            case 'customerWiseMarketCredit':
                 return getNetSalesByDistributor().map(d => ({ distributor_name: d.name, net_sales: d.value }));
            case 'companyWiseClaimableDiscount':
                return appData.kpiData.companyWiseClaimableDiscount;
            case 'companyWiseNonClaimableDiscount':
                return appData.kpiData.companyWiseNonClaimableDiscount;
            case 'companyWiseLedgerBalances':
                return appData.kpiData.companyWiseLedgerBalances;
            case 'top20SkusBySales':
                return appData.kpiData.top20SkusBySales;
            case 'topSkusByProductiveCustomers':
                return appData.kpiData.topSkusByProductiveCustomers;
            case 'totalInventoryInHand':
                const branchInventory = branchData ? branchData.map(item => ({
                    type: 'Total Inventory by Branch',
                    branch_name: item.name,
                    company_name: '',
                    value: item.value
                })) : [];

                const companyInventory = Object.entries(appData.branchCompanyNetPurchases).flatMap(([branch, companies]) =>
                    // FIX: Property 'map' does not exist on type 'unknown'. Object.entries can infer values as `unknown`, so we cast `companies` to its expected type.
                    (companies as { name: string; value: number }[]).map(company => ({
                        type: 'Inventory by Company (Proxy)',
                        branch_name: branch,
                        company_name: company.name,
                        value: company.value
                    }))
                );
                const csvData = [...branchInventory, ...companyInventory];
                return csvData.length > 0 ? csvData : [ { "message": "No data available for export for this KPI." }];
            default:
                return branchData || [ { "message": "No data available for export for this KPI." }];
        }
    }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center bg-brand-accent text-white font-bold py-2 px-4 rounded-md hover:bg-blue-400 transition-colors duration-200 mb-4 shadow-lg"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-baseline gap-x-3">
            <h2 className={`text-3xl font-bold ${titleClasses}`}>{kpi.title}</h2>
            {recordCount !== undefined && (
              <span className={`text-base font-normal ${recordCountClasses}`}>
                ({new Intl.NumberFormat().format(recordCount)} records)
              </span>
            )}
          </div>
          <p className={`mt-1 ${descriptionClasses}`}>{kpi.description}</p>
        </div>
        <div className="flex-shrink-0 self-start sm:self-center">
          <CSVLink
            data={getCsvData()}
            filename={`${kpi.id}_details.csv`}
            className={`inline-flex items-center justify-center font-semibold py-2 px-4 rounded-md transition-colors duration-200 border ${exportButtonClasses}`}
          >
            <Download className="h-5 w-5 mr-2" />
            Export to CSV
          </CSVLink>
        </div>
      </div>

      <div className="mt-8">
        {branchData && branchData.length > 0 ? (
          <BranchWiseDetailTable
            title={kpi.title}
            data={branchData}
            valueType={kpi.valueType}
            valueLabel={kpi.valueLabel}
          />
        ) : (
          !hasAdditionalContent() && (
            <div className={`text-center py-10 rounded-lg ${noDataClasses}`}>
                <p>No branch-wise data available for this KPI.</p>
            </div>
          )
        )}
      </div>

      {hasAdditionalContent() && (
        <div className={kpi.id === 'totalInventoryInHand' ? 'mt-8' : 'mt-12'}>
            {kpi.id !== 'totalInventoryInHand' && <h3 className={`text-2xl font-bold mb-4 border-b pb-2 ${sectionTitleClasses}`}>Further Analysis</h3>}
            {renderAdditionalContent()}
        </div>
      )}

      <div className="mt-12">
        <h3 className={`text-2xl font-bold mb-4 border-b pb-2 ${sectionTitleClasses}`}>Notes & Comments</h3>
        <textarea
            className={`w-full p-3 border rounded-md focus:ring-2 transition ${notesTextareaClasses}`}
            rows={5}
            placeholder={`Add your notes for ${kpi.title} (${selectedBranch})...`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
        />
        <div className="flex items-center justify-end mt-4">
            {isSaved && <span className="text-green-500 dark:text-green-400 text-sm mr-4 transition-opacity duration-300 opacity-100">Notes saved successfully!</span>}
            <button
                onClick={handleSaveNotes}
                className="inline-flex items-center justify-center bg-brand-accent text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-400 transition-colors duration-200"
            >
                <Save className="h-4 w-4 mr-2" />
                Save Notes
            </button>
        </div>
    </div>
    </div>
  );
};

export default DetailView;
