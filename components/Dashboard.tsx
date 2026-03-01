
import React from 'react';
import { Kpi, KpiId, KpiCategory } from '../types';
import KpiCard from './KpiCard';
import HeroKpiCard from './HeroKpiCard';
import { KPI_CATEGORIES } from '../constants';
import {
  TrendingUp, Landmark, Building, Package, Users, UserPlus, ShieldAlert,
  University, Wallet, Coins, Warehouse, Receipt, Undo2, CircleDollarSign,
  TrendingDown, FileClock, Truck, PackageX, PercentCircle, Tag, Gift, HandCoins,
  CreditCard, BadgePercent, BadgeMinus, BookUser, Crown, Star, Banknote
} from 'lucide-react';

interface DashboardProps {
  kpis: Kpi[];
  onKpiSelect: (kpiId: KpiId) => void;
}

const kpiIcons: { [key in KpiId]?: React.ElementType } = {
  dailyBusinessPosition: TrendingUp,
  totalSalesAllPrincipals: Landmark,
  salesByValueCompanyWise: Building,
  salesByVolumeCompanyWise: Package,
  dailyUCC: Users,
  tillDateUCC: UserPlus,
  highDiscountsToday: BadgePercent,
  branchWiseBankBalance: University,
  totalCashInHand: Wallet,
  totalPettyCash: Coins,
  dailyDssCollection: HandCoins,
  dailyCashDepositedAtBank: Banknote,
  totalInventoryInHand: Warehouse,
  totalSalesInvoices: Receipt,
  totalSalesReturns: Undo2,
  dailySalesValue: CircleDollarSign,
  dailySalesReturnValue: TrendingDown,
  dailyOpenReturnsValue: FileClock,
  totalPurchasesCompanyWise: Truck,
  totalPurchaseReturnsCompanyWise: PackageX,
  totalClaimableDiscount: PercentCircle,
  totalNonClaimableDiscount: Tag,
  dailyBonusUnits: Gift,
  // New Icons
  customerWiseMarketCredit: CreditCard,
  companyWiseClaimableDiscount: PercentCircle,
  companyWiseNonClaimableDiscount: BadgeMinus,
  companyWiseLedgerBalances: BookUser,
  top20SkusBySales: Crown,
  topSkusByProductiveCustomers: Star,
};

const heroKpiIds: KpiId[] = ['dailyBusinessPosition', 'totalSalesAllPrincipals', 'highDiscountsToday', 'totalInventoryInHand'];

const Dashboard: React.FC<DashboardProps> = ({ kpis, onKpiSelect }) => {
    const heroKpis = kpis.filter(kpi => heroKpiIds.includes(kpi.id));
    const otherKpis = kpis.filter(kpi => !heroKpiIds.includes(kpi.id));

    const kpisByCategory = KPI_CATEGORIES.map(category => ({
        category,
        kpis: otherKpis.filter(kpi => kpi.category === category),
    })).filter(group => group.kpis.length > 0);

  const categoryTitleClasses = "text-slate-900 dark:text-white/90 border-slate-300 dark:border-white/20";

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {heroKpis.map((kpi) => {
           const Icon = kpiIcons[kpi.id] || CircleDollarSign;
           return <HeroKpiCard key={kpi.id} kpi={kpi} onSelect={onKpiSelect} Icon={Icon} />
        })}
      </div>

      {/* Categorized Sections */}
      {kpisByCategory.map(({ category, kpis: groupKpis }) => (
        <div key={category}>
          <h2 className={`text-2xl font-bold mb-4 pb-2 border-b-2 ${categoryTitleClasses}`}>{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groupKpis.map((kpi) => {
              const Icon = kpiIcons[kpi.id] || CircleDollarSign;
              return <KpiCard key={kpi.id} kpi={kpi} onSelect={onKpiSelect} Icon={Icon} />;
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
