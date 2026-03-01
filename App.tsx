
import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Kpi, KpiId, AppData, RawDataRow, Theme } from './types';
import { KPI_CONFIG } from './constants';
import Dashboard from './components/Dashboard';
import DetailView from './components/DetailView';
import FileUpload from './components/FileUpload';
import Header from './components/Header';
import SideNavigation from './components/SideNavigation';
import useKpiData from './hooks/useKpiData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ExportConfirmationModal from './components/ExportConfirmationModal';
import {
  calculateKpis,
  calculateDailyTrends,
  calculateDistributorPerformance,
  calculateBranchWiseKpis,
  calculateDssPerformance,
  calculateBranchCompanySales,
  calculateDailyBonusByProduct,
  calculateBranchCompanyNetPurchases,
} from './services/kpiCalculations';


const App: React.FC = () => {
  const [selectedKpiId, setSelectedKpiId] = useState<KpiId | null>(null);
  const { appData, validationErrors, isLoading, processFile, resetData } = useKpiData();
  const [isExporting, setIsExporting] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>('All Branches');
  const [exportConfirmation, setExportConfirmation] = useState<'kpis-only' | 'with-details' | null>(null);

  const [themePreference, setThemePreference] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'system'
  );
  const [effectiveTheme, setEffectiveTheme] = useState<Exclude<Theme, 'system'>>('dark');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (themePreference === 'system') {
        setEffectiveTheme(e.matches ? 'dark' : 'light');
      }
    };

    if (themePreference === 'system') {
      handleSystemThemeChange(mediaQuery);
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      setEffectiveTheme(themePreference as Exclude<Theme, 'system'>);
    }
    
    localStorage.setItem('theme', themePreference);

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [themePreference]);

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    const animatedThemes: { [key in Theme]?: string } = {
        dark: 'bg-animated-gradient-dark',
        sunset: 'bg-animated-gradient-sunset',
        ocean: 'bg-animated-gradient-ocean',
        forest: 'bg-animated-gradient-forest',
        cosmic: 'bg-animated-gradient-cosmic',
        blush: 'bg-animated-gradient-blush',
    };

    root.classList.remove('dark');
    body.classList.remove('bg-animated-gradient', 'bg-400%', 'animate-gradient-bg');
    Object.values(animatedThemes).forEach(className => {
        if (className) body.classList.remove(className);
    });
    body.style.backgroundColor = '';

    if (effectiveTheme !== 'light') {
      root.classList.add('dark');
    }

    if (animatedThemes[effectiveTheme]) {
        body.classList.add('bg-animated-gradient', 'bg-400%', 'animate-gradient-bg', animatedThemes[effectiveTheme]);
    } else {
        body.style.backgroundColor = '#f1f5f9';
    }
  }, [effectiveTheme]);


  const handleKpiSelect = (kpiId: KpiId) => {
    setSelectedKpiId(kpiId);
  };

  const handleBackToDashboard = () => {
    setSelectedKpiId(null);
  };

  const handleLogout = () => {
    resetData();
    setSelectedKpiId(null);
    setSelectedBranch('All Branches');
  };

  const handleBranchSelect = (branch: string) => {
    setSelectedBranch(branch);
    setSelectedKpiId(null);
  };

  const displayData = useMemo<AppData | null>(() => {
    if (!appData) return null;
    if (selectedBranch === 'All Branches') {
      return appData;
    }

    const filteredRawData: RawDataRow[] = appData.rawData.filter(row => row.branch === selectedBranch);

    if (filteredRawData.length === 0) {
      return {
        kpiData: calculateKpis([]),
        rawData: [],
        dailyTrends: [],
        distributorPerformance: [],
        highDiscountDetails: [],
        branchWiseKpiData: {},
        dssPerformance: [],
        branchCompanySales: {},
        dailyBonusByProduct: [],
        branchCompanyNetPurchases: {},
        uniqueBranches: [selectedBranch],
      };
    }

    return {
      kpiData: calculateKpis(filteredRawData),
      rawData: filteredRawData,
      dailyTrends: calculateDailyTrends(filteredRawData),
      distributorPerformance: calculateDistributorPerformance(filteredRawData),
      highDiscountDetails: [], // Note: high discounts details are not filtered by branch in this view
      branchWiseKpiData: calculateBranchWiseKpis(filteredRawData),
      dssPerformance: calculateDssPerformance(filteredRawData),
      branchCompanySales: calculateBranchCompanySales(filteredRawData),
      dailyBonusByProduct: calculateDailyBonusByProduct(filteredRawData),
      branchCompanyNetPurchases: calculateBranchCompanyNetPurchases(filteredRawData),
      uniqueBranches: [selectedBranch],
    };
  }, [appData, selectedBranch]);
  
  const handleInitiateExport = (exportType: 'kpis-only' | 'with-details') => {
    setExportConfirmation(exportType);
  };
  
  const handleCancelExport = () => {
    setExportConfirmation(null);
  };

  const handleConfirmExport = async () => {
    if (exportConfirmation) {
      await handleExportToPdf(exportConfirmation);
      setExportConfirmation(null);
    }
  };

  const chartTheme = effectiveTheme === 'light' ? 'light' : 'dark';

  const handleExportToPdf = async (exportType: 'kpis-only' | 'with-details') => {
    const dashboardElement = document.getElementById('dashboard-content');
    if (!dashboardElement || !displayData) return;

    setIsExporting(true);
    
    try {
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: 'a4'
        });
        
        const isDark = chartTheme === 'dark';
        const textColor = isDark ? '#e2e8f0' : '#1e293b';
        const subTextColor = isDark ? '#94a3b8' : '#475569';

        const addPageHeader = (pdfInstance: jsPDF, title: string) => {
            pdfInstance.setFontSize(18);
            pdfInstance.setTextColor(textColor);
            pdfInstance.text(title, 40, 45);
            pdfInstance.setFontSize(10);
            pdfInstance.setTextColor(subTextColor);
            pdfInstance.text(`Exported on: ${new Date().toLocaleDateString()}`, 40, 60);
        };
        
        const addCanvasToPdf = async (pdfInstance: jsPDF, canvas: HTMLCanvasElement) => {
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdfInstance.internal.pageSize.getWidth();
            const pdfHeight = pdfInstance.internal.pageSize.getHeight();
            const margin = 40;
            const headerHeight = 80;
            
            const availableWidth = pdfWidth - (2 * margin);
            const availableHeight = pdfHeight - headerHeight - margin;

            const canvasAspectRatio = canvas.width / canvas.height;
            let finalImgWidth, finalImgHeight;

            if (availableWidth / canvasAspectRatio <= availableHeight) {
                finalImgWidth = availableWidth;
                finalImgHeight = finalImgWidth / canvasAspectRatio;
            } else {
                finalImgHeight = availableHeight;
                finalImgWidth = finalImgHeight * canvasAspectRatio;
            }
            
            const xOffset = margin + (availableWidth - finalImgWidth) / 2;
            
            pdfInstance.addImage(imgData, 'PNG', xOffset, headerHeight, finalImgWidth, finalImgHeight);
        }

        const addBackground = (pdfInstance: jsPDF) => {
            const { width, height } = pdfInstance.internal.pageSize;
            if (isDark) {
                const gradient = pdfInstance.context2d.createLinearGradient(0, 0, width, height);
                gradient.addColorStop(0, '#0f172a');
                gradient.addColorStop(0.33, '#1e293b');
                gradient.addColorStop(0.66, '#0369a1');
                gradient.addColorStop(1, '#1d4ed8');
                pdfInstance.context2d.fillStyle = gradient;
            } else {
                pdfInstance.context2d.fillStyle = '#f1f5f9';
            }
            pdfInstance.context2d.fillRect(0, 0, width, height);
        };
        
        const dashboardTotalHeight = dashboardElement.scrollHeight;
        const dashboardTotalWidth = dashboardElement.scrollWidth;
        let dashboardYPosition = 0;
        let dashboardPageNum = 1;
        const chunkHeight = 650;

        while (dashboardYPosition < dashboardTotalHeight) {
            const currentChunkHeight = Math.min(dashboardTotalHeight - dashboardYPosition, chunkHeight);
            if (currentChunkHeight <= 0) break;

            const canvas = await html2canvas(dashboardElement, {
                scale: 1.5,
                useCORS: true,
                backgroundColor: null, 
                width: dashboardTotalWidth,
                height: currentChunkHeight,
                windowWidth: dashboardTotalWidth,
                windowHeight: dashboardTotalHeight,
                y: dashboardYPosition
            });
            
            if (dashboardPageNum > 1) {
                pdf.addPage();
            }

            addBackground(pdf);
            
            const pageTitle = dashboardPageNum === 1 ? dashboardTitle : `${dashboardTitle} (Page ${dashboardPageNum})`;
            addPageHeader(pdf, pageTitle);
            await addCanvasToPdf(pdf, canvas);
            
            dashboardYPosition += currentChunkHeight;
            dashboardPageNum++;
        }

        if (exportType === 'with-details') {
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.width = '1100px';
            container.style.padding = '2rem';
            document.body.appendChild(container);

            for (const kpi of kpis) {
                const detailRoot = createRoot(container);
                detailRoot.render(
                    <React.StrictMode>
                        <div className={ isDark ? "dark" : ""}>
                            <div className={ isDark ? "bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl" : "bg-white p-8 rounded-2xl shadow-xl" }>
                              <DetailView
                                  kpi={kpi}
                                  appData={displayData}
                                  onBack={() => {}}
                                  selectedBranch={selectedBranch}
                                  isExporting={true}
                                  theme={chartTheme}
                              />
                            </div>
                        </div>
                    </React.StrictMode>
                );

                await new Promise(resolve => setTimeout(resolve, 1000));

                const totalHeight = container.scrollHeight;
                const totalWidth = container.scrollWidth;
                let yPosition = 0;
                let pageNum = 1;

                while (yPosition < totalHeight) {
                    const currentChunkHeight = Math.min(totalHeight - yPosition, chunkHeight);
                    if (currentChunkHeight <= 0) break;

                    const canvas = await html2canvas(container, {
                        scale: 1.5,
                        useCORS: true,
                        backgroundColor: null,
                        width: totalWidth,
                        height: currentChunkHeight,
                        windowWidth: totalWidth,
                        windowHeight: totalHeight,
                        y: yPosition
                    });

                    pdf.addPage();
                    addBackground(pdf);
                    
                    const pageTitle = pageNum === 1 ? kpi.title : `${kpi.title} (Page ${pageNum})`;
                    addPageHeader(pdf, pageTitle);
                    await addCanvasToPdf(pdf, canvas);

                    yPosition += currentChunkHeight;
                    pageNum++;
                }
                detailRoot.unmount();
            }
            document.body.removeChild(container);
        }

        pdf.save(`${dashboardTitle.replace(/\s+/g, '_').toLowerCase()}_${exportType}_${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (error) {
        console.error("Error exporting to PDF", error);
    } finally {
        setIsExporting(false);
    }
  };


  const kpis = useMemo<Kpi[]>(() => {
    if (!displayData) return [];
    const orderedKpiIds: KpiId[] = [
      'dailyBusinessPosition', 'totalSalesAllPrincipals', 'highDiscountsToday',
      'totalInventoryInHand', 'dailyUCC', 'totalSalesInvoices', 'totalCashInHand',
      'totalPettyCash', 'dailyDssCollection', 'dailyCashDepositedAtBank', 'dailySalesValue', 'dailySalesReturnValue',
      'totalPurchasesCompanyWise', 'totalPurchaseReturnsCompanyWise', 'totalClaimableDiscount',
      'totalNonClaimableDiscount', 'dailyBonusUnits', 'salesByValueCompanyWise',
      'salesByVolumeCompanyWise', 'tillDateUCC', 'branchWiseBankBalance', 'totalSalesReturns',
      'dailyOpenReturnsValue', 'customerWiseMarketCredit', 'companyWiseClaimableDiscount',
      'companyWiseNonClaimableDiscount', 'companyWiseLedgerBalances', 'top20SkusBySales',
      'topSkusByProductiveCustomers'
    ];

    return orderedKpiIds
      .map((id): Kpi | null => {
        const config = KPI_CONFIG[id];
        if (!config) return null;
        return {
          id: id as KpiId,
          title: config.title,
          category: config.category,
          value: config.value(displayData.kpiData),
          description: config.description,
          valueType: config.valueType,
          valueLabel: config.valueLabel,
        };
      })
      .filter((kpi): kpi is Kpi => kpi !== null);
  }, [displayData]);

  const selectedKpi = useMemo(() => {
    return kpis.find(kpi => kpi.id === selectedKpiId) || null;
  }, [kpis, selectedKpiId]);
  
  const dashboardTitle = useMemo(() => {
    if (selectedBranch !== 'All Branches') {
      return `${selectedBranch} Dashboard`;
    }
    if (appData?.uniqueBranches?.length === 1) {
      return `${appData.uniqueBranches[0]} Dashboard`;
    }
    return 'Distribution KPI Dashboard';
  }, [appData, selectedBranch]);

  return (
    <div className="min-h-screen text-slate-800 dark:text-white">
      <Header 
        title={dashboardTitle}
        showActions={!!displayData && !selectedKpi}
        onInitiateExport={handleInitiateExport}
        onLogout={handleLogout}
        isExporting={isExporting}
        theme={themePreference}
        setTheme={setThemePreference}
      />

      {!appData ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 mt-8">
           <div className="bg-white dark:bg-black/20 dark:backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
              <FileUpload
                onProcessFile={processFile}
                errors={validationErrors}
                isLoading={isLoading}
              />
            </div>
        </main>
      ) : (
        <div className="flex max-w-full mx-auto">
          <SideNavigation
            branches={appData.uniqueBranches}
            selectedBranch={selectedBranch}
            onSelectBranch={handleBranchSelect}
          />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 88px)' }}>
            <div id="dashboard-content">
              {displayData && selectedKpi ? (
                 <div className="bg-white dark:bg-white/10 dark:backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
                    <DetailView
                        kpi={selectedKpi}
                        appData={displayData}
                        onBack={handleBackToDashboard}
                        selectedBranch={selectedBranch}
                        theme={chartTheme}
                    />
                 </div>
              ) : displayData && kpis.length > 0 ? (
                <Dashboard
                  kpis={kpis}
                  onKpiSelect={handleKpiSelect}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-white dark:bg-white/10 dark:backdrop-blur-lg rounded-2xl shadow-2xl">
                  <p className="text-slate-500 dark:text-white/80 text-lg">No data available for the selected branch.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
      <ExportConfirmationModal
        isOpen={!!exportConfirmation}
        exportType={exportConfirmation}
        onConfirm={handleConfirmExport}
        onCancel={handleCancelExport}
        isExporting={isExporting}
      />
    </div>
  );
};

export default App;
