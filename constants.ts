
import { KpiId, KpiData, KpiCategory } from './types';
import { formatCurrency, formatNumber, formatPercentage } from './utils/formatters';

export const STRICT_SCHEMA = [
    { key: 'date', type: 'string', required: true, description: 'Transaction date (YYYY-MM-DD)' },
    { key: 'branch', type: 'string', required: true, description: 'Branch name' },
    { key: 'distributor_id', type: 'string', required: true, description: 'Unique distributor ID' },
    { key: 'distributor_name', type: 'string', required: true, description: 'Distributor name' },
    { key: 'distributor_limit', type: 'number', required: true, description: 'Sales limit for the distributor' },
    { key: 'principal_company', type: 'string', required: true, description: 'Pharmaceutical company name' },
    { key: 'product_id', type: 'string', required: true, description: 'Unique product ID' },
    { key: 'product_name', type: 'string', required: true, description: 'Product name' },
    { key: 'transaction_type', type: 'string', required: true, description: 'Type: sale, return, purchase, purchase_return' },
    { key: 'invoice_id', type: 'string', required: true, description: 'Unique invoice ID' },
    { key: 'units', type: 'number', required: true, description: 'Number of units in transaction' },
    { key: 'unit_price', type: 'number', required: true, description: 'Price per unit' },
    { key: 'total_value', type: 'number', required: true, description: 'Total transaction value (units * unit_price)' },
    { key: 'discount_claimable', type: 'number', required: true, description: 'Claimable discount value' },
    { key: 'discount_non_claimable', type: 'number', required: true, description: 'Non-claimable discount value' },
    { key: 'bonus_units', type: 'number', required: true, description: 'Number of bonus units' },
    { key: 'cash_in_hand', type: 'number', required: true, description: 'Branch cash in hand at EOD' },
    { key: 'petty_cash', type: 'number', required: true, description: 'Branch petty cash at EOD' },
    { key: 'bank_balance', type: 'number', required: true, description: 'Branch bank balance at EOD' },
    { key: 'inventory_value', type: 'number', required: true, description: 'Branch inventory value at EOD' },
    { key: 'deliveryman_name', type: 'string', required: true, description: 'Name of the deliveryman responsible for the transaction' },
    { key: 'dss_collection_value', type: 'number', required: true, description: 'DSS (Daily Sales Summary) collection amount for the transaction' }
];

export const KPI_CATEGORIES: KpiCategory[] = [
  'Sales Reporting',
  'Risk & Compliance',
  'Financials',
  'Invoices & Returns',
  'Purchases',
  'Discounts & Bonuses',
];

type KpiConfig = {
  [key in KpiId]: {
    title: string;
    category: KpiCategory;
    description: string;
    value: (data: KpiData) => string;
    valueType?: 'currency' | 'number' | 'percentage';
    valueLabel?: string;
  };
};

export const KPI_CONFIG: KpiConfig = {
  dailyBusinessPosition: {
    title: 'Daily Company Wise Sales Position',
    category: 'Sales Reporting',
    description: 'Total sales value for the most recent day in the dataset.',
    value: (data) => formatCurrency(data.dailyBusinessPosition),
    valueType: 'currency',
  },
  totalSalesAllPrincipals: {
    title: 'Sales of All Principals',
    category: 'Sales Reporting',
    description: 'Total sales value across all pharmaceutical companies.',
    value: (data) => formatCurrency(data.totalSalesAllPrincipals),
    valueType: 'currency',
  },
  salesByValueCompanyWise: {
    title: 'Top Brand Sales by Value',
    category: 'Sales Reporting',
    description: 'Total sales value across all principal companies (brands). Click for brand-wise breakdown.',
    value: (data) => formatCurrency(data.totalSalesAllPrincipals),
    valueType: 'currency',
  },
  salesByVolumeCompanyWise: {
    title: 'Top Brand Sales by Volume',
    category: 'Sales Reporting',
    description: 'Total sales volume in units across all principal companies (brands). Click for brand-wise breakdown.',
    value: (data) => {
        const totalVolume = data.salesByVolumeCompanyWise.reduce((sum, company) => sum + company.value, 0);
        return formatNumber(totalVolume);
    },
    valueType: 'number',
    valueLabel: 'Units',
  },
  dailyUCC: {
    title: 'Daily UCC',
    category: 'Sales Reporting',
    description: 'Unique Customer Count for the most recent day.',
    value: (data) => formatNumber(data.dailyUCC),
    valueType: 'number',
    valueLabel: 'Customers',
  },
  tillDateUCC: {
    title: 'Till-Date UCC',
    category: 'Sales Reporting',
    description: 'Total Unique Customer Count across the entire dataset.',
    value: (data) => formatNumber(data.tillDateUCC),
    valueType: 'number',
    valueLabel: 'Customers',
  },
  highDiscountsToday: {
    title: 'High-Discount Sales Today',
    category: 'Risk & Compliance',
    description: 'Number of sales transactions on the latest day with total discounts exceeding 10% of the sale value.',
    value: (data) => formatNumber(data.highDiscountsToday),
    valueType: 'number',
    valueLabel: 'Transactions',
  },
  branchWiseBankBalance: {
    title: 'Cash at Bank',
    category: 'Financials',
    description: 'Total bank balance across all branches for the latest day. Click to see branch-wise breakdown.',
    value: (data) => formatCurrency(data.branchWiseBankBalance.reduce((sum, branch) => sum + branch.value, 0)),
    valueType: 'currency',
  },
  totalCashInHand: {
    title: 'Total Cash in Hand',
    category: 'Financials',
    description: 'Sum of all cash in hand across all branches for the latest day.',
    value: (data) => formatCurrency(data.totalCashInHand),
    valueType: 'currency',
  },
  dailyDssCollection: {
    title: 'Daily DSS Collection Value',
    category: 'Financials',
    description: 'Total value from Daily Sales Summary (DSS) collections for the most recent day.',
    value: (data) => formatCurrency(data.dailyDssCollection),
    valueType: 'currency',
  },
  dailyCashDepositedAtBank: {
    title: 'Daily Cash Deposited at Bank',
    category: 'Financials',
    description: 'Total cash collected from sales and deposited at the bank by deliverymen for the latest day.',
    value: (data) => formatCurrency(data.dailyCashDepositedAtBank),
    valueType: 'currency',
  },
  totalPettyCash: {
    title: 'Total Petty Cash',
    category: 'Financials',
    description: 'Sum of all petty cash balances across all branches for the latest day.',
    value: (data) => formatCurrency(data.totalPettyCash),
    valueType: 'currency',
  },
  totalInventoryInHand: {
    title: 'Total Inventory Value',
    category: 'Financials',
    description: 'Total value of inventory across all branches for the latest day.',
    value: (data) => formatCurrency(data.totalInventoryInHand),
    valueType: 'currency',
  },
  totalSalesInvoices: {
    title: 'Total Sales Invoices',
    category: 'Invoices & Returns',
    description: 'Total count of unique sales invoices.',
    value: (data) => formatNumber(data.totalSalesInvoices),
    valueType: 'number',
    valueLabel: 'Invoices',
  },
  totalSalesReturns: {
    title: 'Total Sales Returns',
    category: 'Invoices & Returns',
    description: 'Total count of unique sales return invoices.',
    value: (data) => formatNumber(data.totalSalesReturns),
    valueType: 'number',
    valueLabel: 'Returns',
  },
  dailySalesValue: {
    title: 'Daily Sales Value',
    category: 'Invoices & Returns',
    description: 'Total sales value for the most recent day.',
    value: (data) => formatCurrency(data.dailySalesValue),
    valueType: 'currency',
  },
  dailySalesReturnValue: {
    title: 'Daily Sales Return Value',
    category: 'Invoices & Returns',
    description: 'Total value of sales returns for the most recent day.',
    value: (data) => formatCurrency(data.dailySalesReturnValue),
    valueType: 'currency',
  },
  dailyOpenReturnsValue: {
    title: 'Daily Open Returns Value',
    category: 'Invoices & Returns',
    description: 'Total value of open returns for the most recent day. (Not implemented)',
    value: (data) => formatCurrency(data.dailyOpenReturnsValue),
    valueType: 'currency',
  },
  totalPurchasesCompanyWise: {
    title: 'Total Purchases',
    category: 'Purchases',
    description: 'Total value of all purchases from principal companies.',
    value: (data) => formatCurrency(data.totalPurchasesValue),
    valueType: 'currency',
  },
  totalPurchaseReturnsCompanyWise: {
    title: 'Total Purchase Returns',
    category: 'Purchases',
    description: 'Total value of all purchase returns to principal companies.',
    value: (data) => formatCurrency(data.totalPurchaseReturnsValue),
    valueType: 'currency',
  },
  totalPurchasesValue: {
    title: 'Total Purchases Value',
    category: 'Purchases',
    description: 'Total value of all purchases from principal companies.',
    value: (data) => formatCurrency(data.totalPurchasesValue),
    valueType: 'currency',
  },
  totalPurchaseReturnsValue: {
    title: 'Total Purchase Returns Value',
    category: 'Purchases',
    description: 'Total value of all purchase returns to principal companies.',
    value: (data) => formatCurrency(data.totalPurchaseReturnsValue),
    valueType: 'currency',
  },
  recordCounts: {
    title: 'Record Counts',
    category: 'Sales Reporting',
    description: 'Internal helper for tracking record counts per KPI.',
    value: () => '',
  },
  totalClaimableDiscount: {
    title: 'Total Claimable Discount',
    category: 'Discounts & Bonuses',
    description: 'Total claimable discount from all sales transactions.',
    value: (data) => formatCurrency(data.totalClaimableDiscount),
    valueType: 'currency',
  },
  totalNonClaimableDiscount: {
    title: 'Total Non-Claimable Discount',
    category: 'Discounts & Bonuses',
    description: 'Total non-claimable discount from all sales transactions.',
    value: (data) => formatCurrency(data.totalNonClaimableDiscount),
    valueType: 'currency',
  },
  dailyBonusUnits: {
    title: 'Daily Bonus Units Given',
    category: 'Discounts & Bonuses',
    description: 'Total bonus units given for sales on the most recent day.',
    value: (data) => formatNumber(data.dailyBonusUnits),
    valueType: 'number',
    valueLabel: 'Units',
  },
  customerWiseMarketCredit: {
    title: 'Accounts Receivable (Market)',
    category: 'Financials',
    description: 'Total net sales (Sales - Returns) across the entire dataset, representing the market credit extended.',
    value: (data) => formatCurrency(data.customerWiseMarketCredit),
    valueType: 'currency',
  },
  companyWiseClaimableDiscount: {
    title: 'Company Wise Claimable Discount',
    category: 'Discounts & Bonuses',
    description: 'Total claimable discounts aggregated by principal company.',
    value: (data) => formatCurrency(data.companyWiseClaimableDiscount.reduce((sum, item) => sum + item.value, 0)),
    valueType: 'currency',
  },
  companyWiseNonClaimableDiscount: {
    title: 'Company Wise Non-Claimable Discount',
    category: 'Discounts & Bonuses',
    description: 'Total non-claimable discounts aggregated by principal company.',
    value: (data) => formatCurrency(data.companyWiseNonClaimableDiscount.reduce((sum, item) => sum + item.value, 0)),
    valueType: 'currency',
  },
  companyWiseLedgerBalances: {
    title: 'Company Wise Ledger Balances',
    category: 'Purchases',
    description: 'Net purchase value (purchases - returns) from each principal company.',
    value: (data) => formatCurrency(data.companyWiseLedgerBalances.reduce((sum, item) => sum + item.value, 0)),
    valueType: 'currency',
  },
  top20SkusBySales: {
    title: 'Top 20 SKUs by Sales',
    category: 'Sales Reporting',
    description: 'Top 20 products (SKUs) ranked by total sales value.',
    value: (data) => `${data.top20SkusBySales.length} SKUs`,
    valueType: 'number',
    valueLabel: 'SKUs',
  },
  topSkusByProductiveCustomers: {
    title: 'Top SKUs by Customer Reach',
    category: 'Sales Reporting',
    description: 'Top products (SKUs) ranked by the number of unique customers who purchased them.',
    value: (data) => `${data.topSkusByProductiveCustomers.length} SKUs`,
    valueType: 'number',
    valueLabel: 'SKUs',
  },
};
