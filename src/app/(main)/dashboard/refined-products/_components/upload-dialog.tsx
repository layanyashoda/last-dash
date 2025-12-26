"use client";

import * as React from 'react';
import { Upload, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface UploadDialogProps {
  onDataUpload: (year: string, data: any[]) => void;
}

export function UploadDialog({ onDataUpload }: UploadDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [targetYear, setTargetYear] = React.useState("2026");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // 1. Get raw rows as arrays to find the header
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        // 2. Find header row (the one containing 'Month' or 'Product')
        const headerIndex = rows.findIndex(r => r.some(c => /month|product/i.test(String(c))));
        
        if (headerIndex === -1) throw new Error("Could not find header row");

        // 3. Convert to JSON starting from that row
        const headers = rows[headerIndex].map(h => String(h).trim());
        const dataRows = rows.slice(headerIndex + 1);
        
        const json = dataRows.map(row => {
          const obj: any = {};
          headers.forEach((h, i) => { if (h) obj[h] = row[i]; });
          return obj;
        }).filter(row => row.Month || row.month); // Only keep rows with a month

        onDataUpload(targetYear, json);
        setIsOpen(false);
      } catch (error) {
        console.error(error);
        alert("Error: Header row (containing 'Month') not found.");
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload Data</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Excel Data</DialogTitle>
          <DialogDescription>The system will automatically find the header row.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Target Year</Label>
            <Input type="number" value={targetYear} onChange={(e) => setTargetYear(e.target.value)} />
          </div>
          <Card className="border-dashed border-2 cursor-pointer hover:bg-muted/50" onClick={() => fileInputRef.current?.click()}>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <FileText className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Click to select File</p>
              <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}