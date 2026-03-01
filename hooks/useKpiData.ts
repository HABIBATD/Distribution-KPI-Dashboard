
import { useState } from 'react';
import { RawDataRow, AppData, KpiData } from '../types';
import { processAndValidateCsv } from '../services/csvProcessor';
import {
  calculateKpis,
  calculateDailyTrends,
  calculateDistributorPerformance,
  calculateBranchWiseKpis,
  calculateDssPerformance,
  calculateBranchCompanySales,
  calculateDailyBonusByProduct,
  calculateBranchCompanyNetPurchases,
  calculateHighDiscountDetails,
} from '../services/kpiCalculations';

const useKpiData = () => {
  const [appData, setAppData] = useState<AppData | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const processFile = async (file: File) => {
    setIsLoading(true);
    setValidationErrors([]);
    setAppData(null);

    try {
      const { data, errors } = await processAndValidateCsv(file);
      if (errors.length > 0) {
        setValidationErrors(errors);
        setIsLoading(false);
        return;
      }

      // Simulate backend processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const rawData: RawDataRow[] = data;
      const kpiData: KpiData = calculateKpis(rawData);
      const dailyTrends = calculateDailyTrends(rawData);
      const distributorPerformance = calculateDistributorPerformance(rawData);
      const highDiscountDetails = calculateHighDiscountDetails(rawData);
      const branchWiseKpiData = calculateBranchWiseKpis(rawData);
      const dssPerformance = calculateDssPerformance(rawData);
      const branchCompanySales = calculateBranchCompanySales(rawData);
      const dailyBonusByProduct = calculateDailyBonusByProduct(rawData);
      const branchCompanyNetPurchases = calculateBranchCompanyNetPurchases(rawData);
      const uniqueBranches = [...new Set(rawData.map(row => row.branch))];
      
      setAppData({
        kpiData,
        rawData,
        dailyTrends,
        distributorPerformance,
        highDiscountDetails,
        branchWiseKpiData,
        dssPerformance,
        branchCompanySales,
        dailyBonusByProduct,
        branchCompanyNetPurchases,
        uniqueBranches,
      });

    } catch (err) {
      const error = err as Error;
      setValidationErrors([error.message || 'An unexpected error occurred during processing.']);
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetData = () => {
      setAppData(null);
      setValidationErrors([]);
  };

  return {
    appData,
    validationErrors,
    isLoading,
    processFile,
    resetData,
  };
};

export default useKpiData;
