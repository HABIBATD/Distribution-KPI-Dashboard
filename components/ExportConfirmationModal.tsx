
import React from 'react';
import { Loader2, FileText } from 'lucide-react';

interface ExportConfirmationModalProps {
  isOpen: boolean;
  exportType: 'kpis-only' | 'with-details' | null;
  onConfirm: () => void;
  onCancel: () => void;
  isExporting: boolean;
}

const ExportConfirmationModal: React.FC<ExportConfirmationModalProps> = ({
  isOpen,
  exportType,
  onConfirm,
  onCancel,
  isExporting,
}) => {
  if (!isOpen || !exportType) return null;

  const exportTypeText = exportType === 'kpis-only' ? 'KPIs Only' : 'KPIs with All Details';
  
  const modalBgClasses = 'bg-white dark:bg-slate-800/80 dark:backdrop-blur-2xl border-slate-300 dark:border-white/20 text-slate-800 dark:text-white';
  const iconBgClasses = 'bg-slate-100 dark:bg-white/20';
  const titleClasses = 'text-slate-900 dark:text-white/90';
  const textClasses = 'text-slate-700 dark:text-white/80';
  const subTextClasses = 'text-slate-500 dark:text-white/60';
  const cancelBtnClasses = 'border-slate-300 dark:border-white/30 bg-white dark:bg-white/10 text-slate-800 dark:text-white/90 hover:bg-slate-50 dark:hover:bg-white/20 focus:ring-offset-white dark:focus:ring-offset-slate-800';

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className={`rounded-2xl shadow-2xl w-full max-w-md m-4 p-6 border ${modalBgClasses}`}>
        <div className="flex items-start">
            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${iconBgClasses}`}>
                <FileText className="h-6 w-6 text-brand-accent" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3 className={`text-lg leading-6 font-bold ${titleClasses}`} id="modal-title">
                    Confirm PDF Export
                </h3>
                <div className="mt-2">
                    <p className={`text-sm ${textClasses}`}>
                        You are about to export a PDF report containing: <span className="font-semibold">{exportTypeText}</span>.
                    </p>
                    <p className={`text-xs mt-1 ${subTextClasses}`}>
                        This may take a few moments, especially for detailed reports.
                    </p>
                </div>
            </div>
        </div>

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
                type="button"
                disabled={isExporting}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-brand-accent px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={onConfirm}
            >
                {isExporting ? (
                    <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Exporting...
                    </>
                ) : 'Confirm Export'}
            </button>
            <button
                type="button"
                disabled={isExporting}
                className={`mt-3 inline-flex w-full justify-center rounded-md border px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2 sm:mt-0 sm:col-start-1 sm:text-sm disabled:opacity-50 ${cancelBtnClasses}`}
                onClick={onCancel}
            >
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
};

export default ExportConfirmationModal;