"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { TrendingUp, Filter, Check, ListFilter } from 'lucide-react';
import { useDataTableInstance } from '@/hooks/use-data-table-instance';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { columns } from './columns';
import { yearOptions } from './data';
import { OverviewCards } from './overview-cards';
import { ImportChart } from './import-chart';
import { UploadDialog } from './upload-dialog';

const STORAGE_KEY = 'refined_products_v15_forced_pagination';

interface ShipmentEntry {
  month: string;
  product: string;
  qty: number;
  year: string;
}

export function RefinedProductsDashboard({ initialData }: { initialData: any[] }) {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [comparisonYear, setComparisonYear] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [shipmentCache, setShipmentCache] = useState<Record<string, ShipmentEntry[]>>({});
  const [availableYears, setAvailableYears] = useState(yearOptions);

  // 1. DATA AGGREGATION
  const aggregateData = useCallback((year: string, products: string[]) => {
    const shipments = (shipmentCache[year] || []).filter(s => products.includes(s.product));
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthlyMap = new Map();
    
    months.forEach(m => {
      monthlyMap.set(m, { 
        month: m, 'Pet 92': 0, 'Pet 95': 0, 'Jet A-1': 0, 
        'Gas Oil 0.05% M.S.': 0, 'Gas Oil 0.001% M.S.': 0, 
        'LSFO': 0, 'HSFO': 0, 'Naphtha': 0, total: 0 
      });
    });

    shipments.forEach(s => {
      const monthKey = months.find(m => m.toLowerCase() === s.month.toLowerCase().trim());
      if (!monthKey) return;
      const entry = monthlyMap.get(monthKey);
      const qty = Number(s.qty) || 0;
      const p = s.product.toLowerCase();
      
      if (p.includes('92')) entry['Pet 92'] += qty;
      else if (p.includes('95')) entry['Pet 95'] += qty;
      else if (p.includes('jet') || p.includes('av gas')) entry['Jet A-1'] += qty;
      else if (p.includes('0.05')) entry['Gas Oil 0.05% M.S.'] += qty;
      else if (p.includes('0.001')) entry['Gas Oil 0.001% M.S.'] += qty;
      else if (p.includes('lsfo')) entry['LSFO'] += qty;
      else if (p.includes('hsfo') || p.includes('180') || p.includes('cst')) entry['HSFO'] += qty;
      else if (p.includes('naphtha')) entry['Naphtha'] += qty;
      entry.total += qty;
    });

    const result = Array.from(monthlyMap.values());
    const grandTotal = result.reduce((acc, curr) => {
        Object.keys(acc).forEach(key => { if (key !== 'month') acc[key] += (curr[key] || 0); });
        return acc;
    }, { month: 'Total', 'Pet 92': 0, 'Pet 95': 0, 'Jet A-1': 0, 'Gas Oil 0.05% M.S.': 0, 'Gas Oil 0.001% M.S.': 0, 'LSFO': 0, 'HSFO': 0, 'Naphtha': 0, total: 0 });

    return [...result, grandTotal];
  }, [shipmentCache]);

  const displayData = useMemo(() => aggregateData(selectedYear, selectedProducts), [selectedYear, selectedProducts, aggregateData]);
  const comparisonData = useMemo(() => comparisonYear ? aggregateData(comparisonYear, selectedProducts) : undefined, [comparisonYear, selectedProducts, aggregateData]);

  // 2. TABLE INSTANCE
  const table = useDataTableInstance({
    data: displayData,
    columns,
    getRowId: (row) => row.month,
    initialState: { pagination: { pageSize: 20 } }
  });

  // 3. THE FORCE FIX: Manually override page size after the table is ready
  useEffect(() => {
    if (table && typeof table.setPageSize === 'function') {
      table.setPageSize(20);
    }
  }, [table, displayData]);

  // 4. PERSISTENCE
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setShipmentCache(parsed);
      const years = Object.keys(parsed).sort((a,b) => b.localeCompare(a)).map(y => ({ value: y, label: `${y} (Saved)` }));
      setAvailableYears(prev => {
        const existing = prev.map(p => p.value);
        return [...prev, ...years.filter(s => !existing.includes(s.value))];
      });
    }
  }, []);

  useEffect(() => {
    if (Object.keys(shipmentCache).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shipmentCache));
    }
  }, [shipmentCache]);

  const allUniqueProducts = useMemo(() => {
    const products = new Set<string>();
    Object.values(shipmentCache).flat().forEach(s => { if (s.product) products.add(s.product); });
    return Array.from(products).sort();
  }, [shipmentCache]);

  useEffect(() => {
    if (allUniqueProducts.length > 0 && selectedProducts.length === 0) {
      setSelectedProducts(allUniqueProducts);
    }
  }, [allUniqueProducts]);

  const handleDataUpload = (year: string, rawData: any[]) => {
    const parsed: ShipmentEntry[] = rawData.map(row => {
      const refNo = String(row['Ref No.'] || "").trim();
      const yearMatch = refNo.match(/\/(\d{4})$/);
      return {
        month: String(row.Month || "").trim(),
        product: String(row.Product || "").trim(),
        qty: parseFloat(String(row['BL QTY MT'] || 0).replace(/,/g, '')),
        year: yearMatch ? yearMatch[1] : year
      };
    }).filter(s => s.month && s.qty > 0);

    const newCache = { ...shipmentCache };
    parsed.forEach(entry => {
      if (!newCache[entry.year]) newCache[entry.year] = [];
      newCache[entry.year].push(entry);
    });

    setShipmentCache(newCache);
    const yearsInFile = Array.from(new Set(parsed.map(p => p.year))).sort((a,b) => b.localeCompare(a));
    setAvailableYears(prev => {
      const existing = prev.map(p => p.value);
      const toAdd = yearsInFile.filter(y => !existing.includes(y)).map(y => ({ value: y, label: `${y} (New)` }));
      return [...prev, ...toAdd];
    });
    setSelectedYear(yearsInFile[0] || year);
    setSelectedProducts(Array.from(new Set(parsed.map(p => p.product))));
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Refined Products Imports</h2>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 border-dashed">
                <Filter className="mr-2 h-4 w-4" />
                Products ({selectedProducts.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="end">
              <div className="p-2 border-b flex items-center justify-between bg-muted/50 text-[10px] font-bold uppercase">
                <span>Product Filters</span>
                <Button variant="link" size="sm" className="h-6 p-0" onClick={() => setSelectedProducts(allUniqueProducts)}>Select All</Button>
              </div>
              <div className="max-h-[350px] overflow-y-auto p-1">
                {allUniqueProducts.map(p => (
                  <div key={p} className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer" onClick={() => {
                    setSelectedProducts(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
                  }}>
                    <div className={cn("w-4 h-4 border rounded flex items-center justify-center transition-all", selectedProducts.includes(p) ? "bg-primary text-primary-foreground border-primary" : "border-input")}>
                      {selectedProducts.includes(p) && <Check className="w-3 h-3" />}
                    </div>
                    <span className="text-xs truncate">{p}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <UploadDialog onDataUpload={handleDataUpload} />
          <Select onValueChange={setSelectedYear} value={selectedYear}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Year" /></SelectTrigger>
            <SelectContent>
              {availableYears.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator />
      <OverviewCards currentYearData={displayData} selectedYear={selectedYear} comparisonYear={comparisonYear} comparisonYearData={comparisonData} />
      <div className="grid gap-4 grid-cols-1">
        <ImportChart data={displayData.filter(d => d.month !== 'Total')} comparisonData={comparisonData?.filter(d => d.month !== 'Total')} selectedYear={selectedYear} comparisonYear={comparisonYear} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Monthly breakdown - {selectedYear}</CardTitle>
          <CardDescription>
            {`Viewing rows for Jan-Dec + Total. Row count: ${displayData.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable key={`${selectedYear}-${selectedProducts.length}`} table={table} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}