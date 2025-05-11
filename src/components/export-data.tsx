import { Button } from "@/components/ui/button";
import { useState } from "react";
import * as XLSX from 'xlsx';

interface ExportDataProps {
  data: any[];
  filename: string;
}

export function ExportData({ data, filename }: ExportDataProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `${filename}-${new Date().toISOString()}.xlsx`);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button 
      onClick={handleExport}
      disabled={exporting}
      variant="outline"
    >
      {exporting ? 'Exporting...' : 'Export to Excel'}
    </Button>
  );
}