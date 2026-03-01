
import Papa from 'papaparse';
import { RawDataRow } from '../types';
import { STRICT_SCHEMA } from '../constants';

export const processAndValidateCsv = (file: File): Promise<{ data: RawDataRow[]; errors: string[] }> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const errors: string[] = [];
        const data = results.data as any[];

        // 1. Header validation
        const fileHeaders = results.meta.fields || [];
        const expectedHeaders = STRICT_SCHEMA.map(c => c.key);

        if (fileHeaders.length !== expectedHeaders.length || !expectedHeaders.every((h, i) => h === fileHeaders[i])) {
            errors.push(`Header mismatch. Expected: "${expectedHeaders.join(', ')}". Received: "${fileHeaders.join(', ')}". Order must match exactly.`);
            resolve({ data: [], errors });
            return;
        }

        // 2. Row-level validation
        const validatedData: RawDataRow[] = [];
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            let rowHasError = false;

            for (const col of STRICT_SCHEMA) {
                const value = row[col.key];

                if (col.required && (value === null || value === undefined || value === '')) {
                    errors.push(`Row ${i + 2}, Column "${col.key}": Value is missing but is required.`);
                    rowHasError = true;
                } else if (value !== null && value !== undefined && typeof value !== col.type) {
                   // This is a strict check. Papaparse's dynamicTyping should handle type conversion.
                   // If the type is still wrong here, it's a genuine data error.
                   errors.push(`Row ${i + 2}, Column "${col.key}": Invalid type. Expected ${col.type} but got "${value}" (type ${typeof value}).`);
                   rowHasError = true;
                }
            }
             if (errors.length > 10) {
                 errors.push("Stopping validation after 10 errors...");
                 resolve({ data: [], errors });
                 return;
             }

            if (!rowHasError) {
                validatedData.push(row as RawDataRow);
            }
        }
        
        if (errors.length > 0) {
            resolve({ data: [], errors });
        } else {
            resolve({ data: validatedData, errors: [] });
        }
      },
      error: (error: any) => {
        resolve({ data: [], errors: [`CSV Parsing Error: ${error.message}`] });
      },
    });
  });
};
