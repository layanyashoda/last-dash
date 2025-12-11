// src/app/(main)/dashboard/refined-products/_components/upload-dialog.tsx
"use client";

import * as React from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RefinedProductImport } from './data'; 
// >>> UNCOMMENT THIS LINE AFTER INSTALLING XLSX <<<
import * as XLSX from 'xlsx'; 
// import { toast } from '@/components/ui/sonner'; 

interface UploadDialogProps {
  onDataUpload: (year: string, data: RefinedProductImport[]) => void;
  availableYears: { value: string, label: string }[];
}

// =========================================================================
// !!! IMPLEMENTATION OF ACTUAL EXCEL PARSING USING SheetJS (xlsx) !!!
// =========================================================================
function parseExcelFile(file: File, fileBuffer: ArrayBuffer, year: string): RefinedProductImport[] {
    // 1. Read the workbook from the binary buffer
    const workbook = XLSX.read(fileBuffer, { type: 'array' });
    
    // 2. Identify the correct sheet by name (e.g., 'Product Wise' or 'MT')
    const sheetName = workbook.SheetNames.find(name => 
        name.includes('Product Wise') || name.includes('MT')
    );

    if (!sheetName) {
        throw new Error("Could not find a sheet named 'Product Wise' or 'MT'.");
    }

    const worksheet = workbook.Sheets[sheetName];
    
    // 3. Convert the sheet data to a JSON array. 
    // Based on the CSV structure you provided, the data starts on Row 6 (index 5).
    // The columns are unnamed, so we use header: 1 to get an array of arrays.
    const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1, 
        range: 4, // Start reading from the row *before* the month header (Row 5 in your file)
        raw: false // Preserve date/number formatting as text initially
    });
    
    // Your data columns:
    const COLUMN_MAP = {
        'Month': 0,
        'Gas Oil 0.05% M.S.': 1,
        'Gas Oil 0.001% M.S.': 2,
        'Pet 92': 3,
        'Pet 95': 4,
        'Jet A-1': 5,
        'HSFO': 6,
        'LSFO': 7,
        'Naphtha': 8,
        'Total': 9,
    };
    
    const [headerRow, ...dataRows] = rawData;
    
    const parsedData: RefinedProductImport[] = dataRows
        .map(row => {
            const monthValue = row[COLUMN_MAP['Month']];
            if (typeof monthValue !== 'string' || monthValue.trim() === '') return null;
            
            // Clean month name
            const month = monthValue.trim().replace(/ 1st Quarter| 2nd Quarter| 3rd Quarter| 4th Quarter| Quarter/, ' (Q)').trim();

            // Skip rows that are partial quarters or grand totals that aren't the final 'Total' row
            if (month.includes('(Q)') && month !== 'Total') return null;

            const newRow: RefinedProductImport = {
                month: month,
                'Gas Oil 0.05% M.S.': parseFloat(row[COLUMN_MAP['Gas Oil 0.05% M.S.']] || 0),
                'Gas Oil 0.001% M.S.': parseFloat(row[COLUMN_MAP['Gas Oil 0.001% M.S.']] || 0),
                'Pet 92': parseFloat(row[COLUMN_MAP['Pet 92']] || 0),
                'Pet 95': parseFloat(row[COLUMN_MAP['Pet 95']] || 0),
                'Jet A-1': parseFloat(row[COLUMN_MAP['Jet A-1']] || 0),
                'HSFO': parseFloat(row[COLUMN_MAP['HSFO']] || 0),
                'LSFO': parseFloat(row[COLUMN_MAP['LSFO']] || 0),
                'Naphtha': parseFloat(row[COLUMN_MAP['Naphtha']] || 0),
                total: parseFloat(row[COLUMN_MAP['Total']] || 0),
            };
            
            // Ensure data rows are not zeroed out.
            if (month !== 'Total' && newRow.total === 0) {
                 // For monthly data, return only if there is a month name and non-zero total, otherwise it might be an empty row.
                 return null;
            }
            
            return newRow;
        })
        .filter((row): row is RefinedProductImport => row !== null);

    return parsedData;
}
// =========================================================================

export function UploadDialog({ onDataUpload }: UploadDialogProps) {
  // ... (rest of the component remains the same)

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [targetYear, setTargetYear] = React.useState<string>('2026'); 

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    const fileNameYear = file.name.match(/(\d{4})/)?.[0];
    const finalYear = targetYear || fileNameYear;
    
    if (!finalYear || !/^\d{4}$/.test(finalYear)) {
        console.error("Upload Failed: Could not determine a valid year (YYYY).");
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
    }

    reader.onload = (e) => {
        const buffer = e.target?.result as ArrayBuffer;
        let parsedData: RefinedProductImport[] | null = null;
        
        try {
            // CALL THE REAL PARSING FUNCTION
            parsedData = parseExcelFile(file, buffer, finalYear);
        } catch (error) {
            console.error("Parsing Error:", error);
        }
        
        if (parsedData && parsedData.length > 0) {
            onDataUpload(finalYear, parsedData);
            console.log(`Successfully uploaded and replaced data for year ${finalYear}.`);
            setIsOpen(false);
            setTargetYear((parseInt(finalYear) + 1).toString()); 
        } else {
           console.error(`Parsing Failed: The file '${file.name}' could not be processed, or the parsed data was empty. Check the console for parsing errors.`);
        }
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    reader.onerror = () => {
        console.error("File Read Error: Failed to read file contents.");
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" /> Upload Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Refined Products Data</DialogTitle>
          <DialogDescription>
            Upload a new CSV/Excel file. Data format must match the existing monthly structure.
          </DialogDescription>
        </DialogHeader>
        <Card className="border-dashed border-2">
            <CardContent className="pt-6">
                <div className="grid gap-4">
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="year-select">Target Year for Upload (e.g., 2026)</Label>
                        <Input
                            id="year-select"
                            placeholder="e.g. 2026"
                            value={targetYear}
                            onChange={(e) => setTargetYear(e.target.value)}
                            className="w-full"
                            maxLength={4}
                        />
                         <p className="text-xs text-muted-foreground pt-1">
                            Use this to designate the year for the uploaded data.
                         </p>
                    </div>

                    <Label htmlFor="data-file" className="flex flex-col items-center justify-center p-6 border rounded-md cursor-pointer bg-muted/20 hover:bg-muted/40 transition">
                        <FileText className="h-6 w-6 mb-2" />
                        <span className="text-sm font-medium">Click to select CSV/Excel file</span>
                        <Input
                            id="data-file"
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </Label>
                </div>
            </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}