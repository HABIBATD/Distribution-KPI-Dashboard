
import { AppData, RawDataRow, KpiData, KpiId, HighDiscountDetail } from '../types';

const getLatestDate = (data: RawDataRow[]): string => {
    if (data.length === 0) return '';
    return data.reduce((max, row) => (row.date > max ? row.date : max), data[0].date);
};

const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);


export const calculateKpis = (data: RawDataRow[]): KpiData => {
    const latestDate = getLatestDate(data);
    const salesData = data.filter(row => row.transaction_type === 'sale');
    const returnData = data.filter(row => row.transaction_type === 'return');
    const purchaseData = data.filter(row => row.transaction_type === 'purchase');
    const purchaseReturnData = data.filter(row => row.transaction_type === 'purchase_return');
    
    const latestDateData = data.filter(row => row.date === latestDate);
    const latestDateSales = salesData.filter(row => row.date === latestDate);

    const dailyBusinessPosition = latestDateSales.reduce((sum, row) => sum + row.total_value, 0);
    const totalSalesAllPrincipals = salesData.reduce((sum, row) => sum + row.total_value, 0);

    const salesByCompany = groupBy(salesData, item => item.principal_company);
    const salesByValueCompanyWise = Object.entries(salesByCompany).map(([name, rows]) => ({
        name,
        value: rows.reduce((sum, r) => sum + r.total_value, 0)
    })).sort((a,b) => b.value - a.value);

    const salesByVolumeCompanyWise = Object.entries(salesByCompany).map(([name, rows]) => ({
        name,
        value: rows.reduce((sum, r) => sum + r.units, 0)
    })).sort((a,b) => b.value - a.value);

    const dailyUCC = new Set(latestDateSales.map(r => r.distributor_id)).size;
    const tillDateUCC = new Set(salesData.map(r => r.distributor_id)).size;

    const highDiscountsToday = latestDateSales.filter(row => {
        const totalDiscount = row.discount_claimable + row.discount_non_claimable;
        return row.total_value > 0 && (totalDiscount / row.total_value) > 0.1;
    }).length;
    
    const latestDayDataByBranch = groupBy(latestDateData, r => r.branch);
    const latestFinancialsByBranch: { [branch: string]: { cash: number, petty: number, bank: number, inventory: number }} = {};

    Object.keys(latestDayDataByBranch).forEach(branch => {
        const branchRows = latestDayDataByBranch[branch];
        // Assuming financial data is consistent for a branch on a given day
        if (branchRows.length > 0) {
             latestFinancialsByBranch[branch] = {
                cash: branchRows[0].cash_in_hand,
                petty: branchRows[0].petty_cash,
                bank: branchRows[0].bank_balance,
                inventory: branchRows[0].inventory_value,
            };
        }
    });

    const branchWiseBankBalance = Object.entries(latestFinancialsByBranch).map(([name, values]) => ({ name, value: values.bank }));
    const totalCashInHand = Object.values(latestFinancialsByBranch).reduce((sum, v) => sum + v.cash, 0);
    const totalPettyCash = Object.values(latestFinancialsByBranch).reduce((sum, v) => sum + v.petty, 0);
    const totalInventoryInHand = Object.values(latestFinancialsByBranch).reduce((sum, v) => sum + v.inventory, 0);

    const totalSalesInvoices = new Set(salesData.map(r => r.invoice_id)).size;
    const totalSalesReturns = new Set(returnData.map(r => r.invoice_id)).size;

    const dailySalesValue = dailyBusinessPosition;
    const dailySalesReturnValue = returnData.filter(r => r.date === latestDate).reduce((sum, r) => sum + r.total_value, 0);
    const dailyOpenReturnsValue = 0; // Placeholder as logic is not defined

    const purchasesByCompany = groupBy(purchaseData, item => item.principal_company);
    const totalPurchasesCompanyWise = Object.entries(purchasesByCompany).map(([name, rows]) => ({
        name,
        value: rows.reduce((sum, r) => sum + r.total_value, 0)
    })).sort((a,b) => b.value - a.value);
    
    const totalPurchasesValue = purchaseData.reduce((sum, row) => sum + row.total_value, 0);

    const purchaseReturnsByCompany = groupBy(purchaseReturnData, item => item.principal_company);
    const totalPurchaseReturnsCompanyWise = Object.entries(purchaseReturnsByCompany).map(([name, rows]) => ({
        name,
        value: rows.reduce((sum, r) => sum + r.total_value, 0)
    })).sort((a,b) => b.value - a.value);
    
    // FIX: Changed r.total_value to row.total_value to match the parameter name in the callback.
    const totalPurchaseReturnsValue = purchaseReturnData.reduce((sum, row) => sum + row.total_value, 0);


    const totalClaimableDiscount = salesData.reduce((sum, r) => sum + r.discount_claimable, 0);
    const totalNonClaimableDiscount = salesData.reduce((sum, r) => sum + r.discount_non_claimable, 0);
    const dailyBonusUnits = latestDateSales.reduce((sum, r) => sum + r.bonus_units, 0);

    const dailyDssCollection = latestDateData.reduce((sum, row) => sum + row.dss_collection_value, 0);
    const dailyCashDepositedAtBank = dailyDssCollection;

    const recordCounts: Partial<Record<KpiId, number>> = {
        totalSalesInvoices: salesData.length,
        totalSalesReturns: returnData.length,
        dailyUCC: latestDateSales.length,
        tillDateUCC: salesData.length,
        dailyBonusUnits: latestDateSales.length,
    };
    
    const totalReturnsValue = returnData.reduce((sum, r) => sum + r.total_value, 0);
    const customerWiseMarketCredit = totalSalesAllPrincipals - totalReturnsValue;

    const companyWiseClaimableDiscount = Object.entries(groupBy(salesData, item => item.principal_company))
        .map(([name, rows]) => ({
            name,
            value: rows.reduce((sum, r) => sum + r.discount_claimable, 0)
        })).sort((a,b) => b.value - a.value);

    const companyWiseNonClaimableDiscount = Object.entries(groupBy(salesData, item => item.principal_company))
        .map(([name, rows]) => ({
            name,
            value: rows.reduce((sum, r) => sum + r.discount_non_claimable, 0)
        })).sort((a,b) => b.value - a.value);

    const allCompanies = new Set([...purchaseData.map(r => r.principal_company), ...purchaseReturnData.map(r => r.principal_company)]);
    const companyWiseLedgerBalances = Array.from(allCompanies).map(company => {
        const totalPurchases = purchaseData.filter(r => r.principal_company === company).reduce((sum, r) => sum + r.total_value, 0);
        const totalPurchaseReturns = purchaseReturnData.filter(r => r.principal_company === company).reduce((sum, r) => sum + r.total_value, 0);
        return { name: company, value: totalPurchases - totalPurchaseReturns };
    }).sort((a, b) => b.value - a.value);

    const top20SkusBySales = Object.entries(groupBy(salesData, item => item.product_name))
        .map(([name, rows]) => ({
            name,
            value: rows.reduce((sum, r) => sum + r.total_value, 0)
        })).sort((a, b) => b.value - a.value).slice(0, 20);

    const topSkusByProductiveCustomers = Object.entries(groupBy(salesData, item => item.product_name))
        .map(([name, rows]) => ({
            name,
            value: new Set(rows.map(r => r.distributor_id)).size
        })).sort((a, b) => b.value - a.value);

    return {
        dailyBusinessPosition, totalSalesAllPrincipals, salesByValueCompanyWise,
        salesByVolumeCompanyWise, dailyUCC, tillDateUCC,
        highDiscountsToday, branchWiseBankBalance,
        totalCashInHand, totalPettyCash, totalInventoryInHand,
        totalSalesInvoices, totalSalesReturns, dailySalesValue,
        dailySalesReturnValue, dailyOpenReturnsValue, totalPurchasesCompanyWise,
        totalPurchaseReturnsCompanyWise, totalPurchasesValue, totalPurchaseReturnsValue,
        totalClaimableDiscount, totalNonClaimableDiscount,
        dailyBonusUnits, dailyDssCollection, dailyCashDepositedAtBank,
        recordCounts,
        // New KPIs
        customerWiseMarketCredit,
        companyWiseClaimableDiscount,
        companyWiseNonClaimableDiscount,
        companyWiseLedgerBalances,
        top20SkusBySales,
        topSkusByProductiveCustomers
    };
};


export const calculateDailyTrends = (data: RawDataRow[]) => {
    const salesByDate = groupBy(data.filter(r => r.transaction_type === 'sale'), r => r.date);
    const returnsByDate = groupBy(data.filter(r => r.transaction_type === 'return'), r => r.date);

    const allDates = [...new Set([...Object.keys(salesByDate), ...Object.keys(returnsByDate)])].sort();

    return allDates.map(date => {
        const sales = (salesByDate[date] || []).reduce((sum, r) => sum + r.total_value, 0);
        const returns = (returnsByDate[date] || []).reduce((sum, r) => sum + r.total_value, 0);
        return { date, sales, returns };
    });
}

export const calculateDistributorPerformance = (data: RawDataRow[]) => {
    const latestDate = getLatestDate(data);
    const latestDateSales = data.filter(r => r.date === latestDate && r.transaction_type === 'sale');

    const salesByDistributor = groupBy(latestDateSales, r => r.distributor_id);

    return Object.entries(salesByDistributor).map(([id, rows]) => {
        const name = rows[0].distributor_name;
        const limit = rows[0].distributor_limit;
        const sales = rows.reduce((sum, r) => sum + r.total_value, 0);
        return {
            id,
            name,
            sales,
            limit,
            exceedsLimit: sales > limit
        };
    }).sort((a,b) => b.sales - a.sales);
}

export const calculateHighDiscountDetails = (data: RawDataRow[]): HighDiscountDetail[] => {
    const latestDate = getLatestDate(data);
    const latestDateSales = data.filter(r => r.date === latestDate && r.transaction_type === 'sale');

    const highDiscountTransactions = latestDateSales
        .map(row => {
            const total_discount = row.discount_claimable + row.discount_non_claimable;
            const discount_percent = row.total_value > 0 ? total_discount / row.total_value : 0;
            return { ...row, total_discount, discount_percent };
        })
        .filter(row => row.discount_percent > 0.1)
        .map(row => ({
            distributor_name: row.distributor_name,
            product_name: row.product_name,
            total_value: row.total_value,
            total_discount: row.total_discount,
            discount_percent: row.discount_percent,
            invoice_id: row.invoice_id,
        }))
        .sort((a, b) => b.discount_percent - a.discount_percent);

    return highDiscountTransactions;
};

export const calculateDssPerformance = (data: RawDataRow[]): AppData['dssPerformance'] => {
    const latestDate = getLatestDate(data);
    const latestDateData = data.filter(r => r.date === latestDate);

    const collectionsByDeliveryman = groupBy(latestDateData, r => r.deliveryman_name);

    return Object.entries(collectionsByDeliveryman)
        .filter(([name]) => name.toLowerCase() !== 'n/a' && name.trim() !== '')
        .map(([name, rows]) => {
            const value = rows.reduce((sum, r) => sum + r.dss_collection_value, 0);
            return { name, value };
        }).sort((a,b) => b.value - a.value);
};

export const calculateBranchCompanySales = (data: RawDataRow[]): AppData['branchCompanySales'] => {
    const latestDate = getLatestDate(data);
    const latestDateSales = data.filter(r => r.date === latestDate && r.transaction_type === 'sale');

    const salesByBranch = groupBy(latestDateSales, r => r.branch);
    
    const result: AppData['branchCompanySales'] = {};

    for (const branch in salesByBranch) {
        const branchSales = salesByBranch[branch];
        const salesByCompany = groupBy(branchSales, r => r.principal_company);

        const byValue = Object.entries(salesByCompany).map(([name, rows]) => ({
            name,
            value: rows.reduce((sum, r) => sum + r.total_value, 0)
        })).sort((a,b) => b.value - a.value);

        const byVolume = Object.entries(salesByCompany).map(([name, rows]) => ({
            name,
            value: rows.reduce((sum, r) => sum + r.units, 0)
        })).sort((a,b) => b.value - a.value);

        result[branch] = { byValue, byVolume };
    }

    return result;
};

export const calculateBranchCompanyNetPurchases = (data: RawDataRow[]): AppData['branchCompanyNetPurchases'] => {
    const purchaseData = data.filter(r => r.transaction_type === 'purchase');
    const purchaseReturnData = data.filter(r => r.transaction_type === 'purchase_return');

    const result: AppData['branchCompanyNetPurchases'] = {};

    const branches = [...new Set(data.map(r => r.branch))];

    for (const branch of branches) {
        const branchPurchases = purchaseData.filter(r => r.branch === branch);
        const branchPurchaseReturns = purchaseReturnData.filter(r => r.branch === branch);

        const allCompaniesInBranch = new Set([
            ...branchPurchases.map(r => r.principal_company),
            ...branchPurchaseReturns.map(r => r.principal_company)
        ]);

        const companyBalances = Array.from(allCompaniesInBranch).map(company => {
            const totalPurchases = branchPurchases
                .filter(r => r.principal_company === company)
                .reduce((sum, r) => sum + r.total_value, 0);
            
            const totalPurchaseReturns = branchPurchaseReturns
                .filter(r => r.principal_company === company)
                .reduce((sum, r) => sum + r.total_value, 0);

            return { name: company, value: totalPurchases - totalPurchaseReturns };
        }).filter(item => item.value !== 0).sort((a, b) => b.value - a.value);

        if(companyBalances.length > 0) {
            result[branch] = companyBalances;
        }
    }

    return result;
};

export const calculateBranchWiseKpis = (data: RawDataRow[]): AppData['branchWiseKpiData'] => {
    const latestDate = getLatestDate(data);
    const result: AppData['branchWiseKpiData'] = {};

    const processByBranch = (
        filteredData: RawDataRow[],
        valueExtractor: (rows: RawDataRow[]) => number
    ) => {
        const grouped = groupBy(filteredData, r => r.branch);
        return Object.entries(grouped).map(([name, rows]) => ({
            name,
            value: valueExtractor(rows)
        })).sort((a, b) => b.value - a.value);
    };

    const salesData = data.filter(r => r.transaction_type === 'sale');
    const latestDateData = data.filter(r => r.date === latestDate);
    const latestDateSales = salesData.filter(r => r.date === latestDate);
    
    result.dailyBusinessPosition = processByBranch(latestDateSales, rows => rows.reduce((s, r) => s + r.total_value, 0));
    result.totalSalesAllPrincipals = processByBranch(salesData, rows => rows.reduce((s, r) => s + r.total_value, 0));
    result.dailySalesValue = result.dailyBusinessPosition;
    
    const returnData = data.filter(r => r.transaction_type === 'return');
    result.dailySalesReturnValue = processByBranch(returnData.filter(r => r.date === latestDate), rows => rows.reduce((s, r) => s + r.total_value, 0));

    result.totalClaimableDiscount = processByBranch(salesData, rows => rows.reduce((s, r) => s + r.discount_claimable, 0));
    result.totalNonClaimableDiscount = processByBranch(salesData, rows => rows.reduce((s, r) => s + r.discount_non_claimable, 0));
    
    result.dailyUCC = processByBranch(latestDateSales, rows => new Set(rows.map(r => r.distributor_id)).size);
    result.tillDateUCC = processByBranch(salesData, rows => new Set(rows.map(r => r.distributor_id)).size);
    result.totalSalesInvoices = processByBranch(salesData, rows => new Set(rows.map(r => r.invoice_id)).size);
    result.totalSalesReturns = processByBranch(returnData, rows => new Set(rows.map(r => r.invoice_id)).size);
    result.dailyBonusUnits = processByBranch(latestDateSales, rows => rows.reduce((s, r) => s + r.bonus_units, 0));
    
    result.dailyDssCollection = processByBranch(latestDateData, rows => rows.reduce((s, r) => s + r.dss_collection_value, 0));
    result.dailyCashDepositedAtBank = result.dailyDssCollection;
    
    const latestDayDataByBranch = groupBy(latestDateData, r => r.branch);
    
    const financialExtractor = (key: 'cash_in_hand' | 'petty_cash' | 'inventory_value' | 'bank_balance') => {
        return Object.entries(latestDayDataByBranch).map(([name, rows]) => ({
            name,
            value: rows.length > 0 ? rows[0][key] : 0
        })).sort((a,b) => b.value - a.value);
    };
    result.totalCashInHand = financialExtractor('cash_in_hand');
    result.totalPettyCash = financialExtractor('petty_cash');
    result.totalInventoryInHand = financialExtractor('inventory_value');
    result.branchWiseBankBalance = financialExtractor('bank_balance');

    result.highDiscountsToday = processByBranch(latestDateSales, rows => 
        rows.filter(row => {
            const totalDiscount = row.discount_claimable + row.discount_non_claimable;
            return row.total_value > 0 && (totalDiscount / row.total_value) > 0.1;
        }).length
    );

    const purchaseData = data.filter(r => r.transaction_type === 'purchase');
    result.totalPurchasesCompanyWise = processByBranch(purchaseData, rows => rows.reduce((s, r) => s + r.total_value, 0));

    const purchaseReturnData = data.filter(r => r.transaction_type === 'purchase_return');
    result.totalPurchaseReturnsCompanyWise = processByBranch(purchaseReturnData, rows => rows.reduce((s, r) => s + r.total_value, 0));


    return result;
};

export const calculateDailyBonusByProduct = (data: RawDataRow[]): AppData['dailyBonusByProduct'] => {
    const latestDate = getLatestDate(data);
    const latestDateSales = data.filter(r => r.date === latestDate && r.transaction_type === 'sale');

    const bonusTransactions = latestDateSales.filter(row => row.bonus_units > 0);
    
    if (bonusTransactions.length === 0) {
        return [];
    }

    const groupedBonuses = groupBy(bonusTransactions, r => `${r.product_name}|${r.branch}`);

    const result = Object.values(groupedBonuses).map(rows => {
        const firstRow = rows[0];
        const totalUnits = rows.reduce((sum, r) => sum + r.bonus_units, 0);
        return {
            productName: firstRow.product_name,
            branch: firstRow.branch,
            units: totalUnits
        };
    }).sort((a, b) => b.units - a.units);

    return result;
}
