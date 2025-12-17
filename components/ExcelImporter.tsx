
import React from 'react';
import * as XLSX from 'xlsx';

interface ExcelImporterProps {
  onData: (data: any[]) => void;
  label: string;
}

const ExcelImporter: React.FC<ExcelImporterProps> = ({ onData, label }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      onData(data);
      // Reset input
      e.target.value = '';
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="relative inline-block">
      <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors">
        <span>📊</span> {label}
        <input 
          type="file" 
          className="hidden" 
          accept=".xlsx, .xls, .csv" 
          onChange={handleFileUpload} 
        />
      </label>
    </div>
  );
};

export default ExcelImporter;
