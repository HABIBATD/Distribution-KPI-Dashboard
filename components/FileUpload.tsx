
import React, { useState, useCallback } from 'react';
import { UploadCloud, FileCheck2, AlertTriangle, Loader2 } from 'lucide-react';
import SchemaDefinition from './SchemaDefinition';

interface FileUploadProps {
  onProcessFile: (file: File) => void;
  errors: string[];
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onProcessFile, errors, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      onProcessFile(file);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        setFile(e.dataTransfer.files[0]);
        e.dataTransfer.clearData();
    }
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-lg p-8 rounded-2xl shadow-xl dark:shadow-2xl">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white/90 mb-4">Upload Your Data</h2>
        <p className="text-slate-600 dark:text-white/70 mb-6">
          Upload a CSV file to populate the dashboard. The file must adhere to the specified schema for successful validation.
        </p>

        <div 
          onDragOver={onDragOver}
          onDrop={onDrop}
          className="border-2 border-dashed border-slate-300 dark:border-white/30 rounded-lg p-8 text-center bg-slate-50 dark:bg-black/20 cursor-pointer hover:border-brand-accent hover:bg-slate-100 dark:hover:bg-black/30 transition-colors"
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".csv"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <UploadCloud className="mx-auto h-12 w-12 text-slate-400 dark:text-white/50" />
            <p className="mt-2 text-sm text-slate-600 dark:text-white/80">
              <span className="font-semibold text-brand-accent">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500 dark:text-white/60 mt-1">CSV files up to 10MB</p>
          </label>
        </div>

        {file && (
          <div className="mt-4 flex items-center justify-between bg-green-100 dark:bg-green-500/20 border border-green-300 dark:border-green-400/30 text-green-800 dark:text-green-200 p-3 rounded-md">
            <div className="flex items-center space-x-2">
                <FileCheck2 className="h-5 w-5" />
                <span className="text-sm font-medium">{file.name}</span>
            </div>
            <button onClick={() => setFile(null)} className="text-sm font-semibold hover:underline">Clear</button>
          </div>
        )}

        {errors.length > 0 && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-400/30 rounded-md">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">Validation Errors</h3>
                <ul className="mt-2 list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="w-full mt-6 bg-brand-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-400 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Processing...
            </>
          ) : (
            'Generate Dashboard'
          )}
        </button>
      </div>
      
      <SchemaDefinition />

    </div>
  );
};

export default FileUpload;