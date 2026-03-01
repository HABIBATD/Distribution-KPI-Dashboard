
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download } from 'lucide-react';
import { STRICT_SCHEMA } from '../constants';

// Content of sample-data.csv is now embedded to ensure download works in sandboxed environments.
const SAMPLE_CSV_CONTENT = `date,branch,distributor_id,distributor_name,distributor_limit,principal_company,product_id,product_name,transaction_type,invoice_id,units,unit_price,total_value,discount_claimable,discount_non_claimable,bonus_units,cash_in_hand,petty_cash,bank_balance,inventory_value,deliveryman_name,dss_collection_value
2024-05-20,North Branch,D001,"HealthFirst Pharma",50000,"MediCorp Inc.",P101,"Product A",sale,INV001,100,50,5000,250,50,10,15000,500,250000,800000,"Ali Khan",4800
2024-05-20,North Branch,D002,"Wellness Distributors",75000,"MediCorp Inc.",P102,"Product B",sale,INV002,200,25,5000,200,0,20,15000,500,250000,800000,"Bilal Ahmed",5000
2024-05-20,South Branch,D003,"CarePoint Supply",60000,"PharmaLife Co.",P201,"Product C",sale,INV003,50,150,7500,500,100,5,22000,800,450000,1200000,"Faisal Butt",7400
2024-05-20,South Branch,D001,"HealthFirst Pharma",50000,"PharmaLife Co.",P202,"Product D",purchase,PO001,500,80,40000,0,0,0,22000,800,450000,1200000,"N/A",0
2024-05-21,North Branch,D001,"HealthFirst Pharma",50000,"MediCorp Inc.",P101,"Product A",return,RTN001,10,50,500,25,5,1,14500,450,240000,795000,"Ali Khan",-500
2024-05-21,South Branch,D003,"CarePoint Supply",60000,"PharmaLife Co.",P201,"Product C",sale,INV004,20,150,3000,200,40,2,21000,750,445000,1150000,"Faisal Butt",2900
2024-05-21,North Branch,D001,"HealthFirst Pharma",50000,"MediCorp Inc.",P102,"Product B",sale,INV005,1000,55,55000,2000,500,100,18000,500,300000,750000,"Ali Khan",54000
2024-05-21,North Branch,D002,"Wellness Distributors",75000,"PharmaLife Co.",P201,"Product C",sale,INV006,100,150,15000,1000,200,10,18000,500,300000,750000,"Bilal Ahmed",14500
2024-05-21,South Branch,D004,"FutureMeds",80000,"BioGen Labs",P301,"Product E",sale,INV007,300,70,21000,1500,300,30,25000,850,500000,1300000,"Asim Gill",20000
2024-05-21,South Branch,D004,"FutureMeds",80000,"BioGen Labs",P301,"Product E",purchase,PO002,1000,45,45000,0,0,0,25000,850,500000,1300000,"N/A",0
2024-05-22,South Branch,D001,"HealthFirst Pharma",50000,"PharmaLife Co.",P202,"Product D",purchase_return,PR001,50,80,4000,0,0,0,20000,700,440000,1100000,"N/A",0
2024-05-22,North Branch,D002,"Wellness Distributors",75000,"MediCorp Inc.",P101,"Product A",sale,INV008,500,50,25000,1250,250,50,20000,600,320000,800000,"Bilal Ahmed",24000
2024-05-22,South Branch,D003,"CarePoint Supply",60000,"BioGen Labs",P302,"Product F",sale,INV009,150,90,13500,700,150,15,24000,820,480000,1250000,"Faisal Butt",13000
2024-05-22,North Branch,D005,"Rapid Relief",40000,"PharmaLife Co.",P201,"Product C",sale,INV010,80,155,12400,600,120,8,21000,650,330000,820000,"Naveed Shah",12000
2024-05-22,South Branch,D004,"FutureMeds",80000,"MediCorp Inc.",P102,"Product B",sale,INV011,400,26,10400,400,50,40,23000,800,470000,1200000,"Asim Gill",10000
2024-05-22,West Branch,D006,"Pharma Express",65000,"HealthWave Solutions",P401,"Product G",sale,INV012,250,110,27500,1375,275,25,30000,1000,600000,1500000,"Sajid Ali",27000
2024-05-22,West Branch,D006,"Pharma Express",65000,"HealthWave Solutions",P401,"Product G",purchase,PO003,1000,75,75000,0,0,0,30000,1000,600000,1500000,"N/A",0
2024-05-23,South Branch,D003,"CarePoint Supply",60000,"PharmaLife Co.",P201,"Product C",sale,INV013,100,150,15000,1500,300,10,28000,900,490000,1280000,"Faisal Butt",14500
2024-05-23,West Branch,D007,"Metro Meds",90000,"MediCorp Inc.",P102,"Product B",sale,INV014,500,28,14000,700,100,50,32000,1100,620000,1550000,"Kamran Raja",13500
2024-05-23,West Branch,D006,"Pharma Express",65000,"HealthWave Solutions",P401,"Product G",return,RTN002,20,110,2200,110,22,2,29000,950,610000,1520000,"Sajid Ali",-2200
2024-05-23,North Branch,D001,"HealthFirst Pharma",50000,"BioGen Labs",P302,"Product F",sale,INV015,120,95,11400,570,114,12,23000,700,350000,850000,"Ali Khan",11000`;


const SchemaDefinition: React.FC = () => {
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  useEffect(() => {
    // Create a Blob from the CSV content string
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    
    // Create a temporary URL for the Blob that the browser can use for downloading
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);

    // Clean up the temporary URL when the component is no longer displayed to prevent memory leaks
    return () => {
      URL.revokeObjectURL(url);
    };
  }, []); // The empty array ensures this effect runs only once when the component mounts

  return (
    <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-lg p-8 rounded-2xl shadow-xl dark:shadow-2xl">
      <div className="flex items-center mb-4">
        <ShieldCheck className="h-8 w-8 text-brand-accent mr-3" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white/90">Strict Schema Required</h2>
      </div>
      <p className="text-slate-600 dark:text-white/70 mb-4">
        Your CSV file's header must exactly match these columns in order. All columns are required.
      </p>
      <a
        href={downloadUrl}
        download="sample-data.csv"
        aria-disabled={!downloadUrl}
        className={`inline-flex items-center justify-center bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 mb-6 w-full sm:w-auto ${!downloadUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Download className="h-5 w-5 mr-2" />
        Download Sample CSV
      </a>
      <div className="max-h-[340px] overflow-y-auto pr-2 border border-slate-200 dark:border-white/20 rounded-md">
        <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300">
            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-black/30 sticky top-0">
                <tr>
                    <th scope="col" className="px-4 py-3">Column Name</th>
                    <th scope="col" className="px-4 py-3">Data Type</th>
                    <th scope="col" className="px-4 py-3">Description</th>
                </tr>
            </thead>
            <tbody>
                {STRICT_SCHEMA.map((col, index) => (
                    <tr key={index} className="bg-transparent border-b border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10">
                        <th scope="row" className="px-4 py-3 font-mono font-medium text-slate-900 dark:text-white whitespace-nowrap">
                            {col.key}
                        </th>
                        <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                col.type === 'string' ? 'bg-blue-100 dark:bg-blue-500/30 text-blue-800 dark:text-blue-200' : 'bg-green-100 dark:bg-green-500/30 text-green-800 dark:text-green-200'
                            }`}>
                                {col.type}
                            </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                            {col.description}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchemaDefinition;