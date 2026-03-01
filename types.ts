
export type Theme = 'light' | 'dark' | 'sunset' | 'ocean' | 'forest' | 'cosmic' | 'blush' | 'system';

export interface RawDataRow {
  date: string;
  branch: string;
  distributor_id: string;
  distributor_name: string;
  distributor_limit: number;
  principal_company: string;
  product_id: string;
  product_name: string;
  transaction_type: 'sale' | 'return' | 'purchase' | 'purchase_return';
  invoice_id: string;
  units: number;
  unit_price: number;
  total_value: number;
  discount_claimable: number;
  discount_non_claimable: number;
  bonus_units: number;
  cash_in_hand: number;
  petty_cash: number;
  bank_balance: number;
  inventory_value: number;
  deliveryman_name: string;
  dss_collection_value: number;
}

export interface HighDiscountDetail {
  distributor_name: string;
  product_name: string;
  total_value: number;
  total_discount: number;
  discount_percent: number;
  invoice_id: string;
}

export interface KpiData {
  dailyBusinessPosition: number;
  totalSalesAllPrincipals: number;
  salesByValueCompanyWise: { name: string; value: number }[];
  salesByVolumeCompanyWise: { name: string; value: number }[];
  dailyUCC: number;
  tillDateUCC: number;
  highDiscountsToday: number;
  branchWiseBankBalance: { name: string; value: number }[];
  totalCashInHand: number;
  totalPettyCash: number;
  totalInventoryInHand: number;
  totalSalesInvoices: number;
  totalSalesReturns: number;
  dailySalesValue: number;
  dailySalesReturnValue: number;
  dailyOpenReturnsValue: number;
  totalPurchasesCompanyWise: { name: string; value: number }[];
  totalPurchaseReturnsCompanyWise: { name: string; value: number }[];
  totalPurchasesValue: number;
  totalPurchaseReturnsValue: number;
  totalClaimableDiscount: number;
  totalNonClaimableDiscount: number;
  dailyBonusUnits: number;
  dailyDssCollection: number;
  dailyCashDepositedAtBank: number;
  recordCounts: Partial<Record<KpiId, number>>;
  // New KPIs
  customerWiseMarketCredit: number;
  companyWiseClaimableDiscount: { name: string; value: number }[];
  companyWiseNonClaimableDiscount: { name: string; value: number }[];
  companyWiseLedgerBalances: { name: string; value: number }[];
  top20SkusBySales: { name: string; value: number }[];
  topSkusByProductiveCustomers: { name: string; value: number }[];
}

export type KpiId = keyof KpiData;

export type KpiCategory =
  | 'Sales Reporting'
  | 'Risk & Compliance'
  | 'Financials'
  | 'Invoices & Returns'
  | 'Purchases'
  | 'Discounts & Bonuses';

export interface Kpi {
  id: KpiId;
  title: string;
  category: KpiCategory;
  value: string;
  description: string;
  valueType?: 'currency' | 'number' | 'percentage';
  valueLabel?: string;
}

export interface AppData {
  kpiData: KpiData;
  rawData: RawDataRow[];
  dailyTrends: { date: string; sales: number; returns: number }[];
  distributorPerformance: {
    id: string;
    name: string;
    sales: number;
    limit: number;
    exceedsLimit: boolean;
  }[];
  highDiscountDetails: HighDiscountDetail[];
  branchWiseKpiData: {
    [key in KpiId]?: { name: string; value: number }[];
  };
  dssPerformance: {
    name: string;
    value: number;
  }[];
  dailyBonusByProduct: { productName: string; branch: string; units: number }[];
  branchCompanySales: {
    [branch: string]: {
      byValue: { name: string; value: number }[];
      byVolume: { name: string; value: number }[];
    };
  };
  branchCompanyNetPurchases: {
    [branch: string]: {
      name: string;
      value: number;
    }[];
  };
  uniqueBranches: string[];
}
