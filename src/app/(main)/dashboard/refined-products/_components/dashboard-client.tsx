"use client";

import { useState, useMemo, useCallback } from 'react';
import { TrendingUp, Upload } from 'lucide-react';

import { useDataTableInstance } from '@/hooks/use-data-table-instance';

import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

import { columns } from './columns';
import { 
  RefinedProductImport, 
  yearOptions, 
  fetchRefinedProductImports 
} from './data';
import { OverviewCards } from './overview-cards';
import { ImportChart } from './import-chart';
// import { UploadDialog } from './upload-dialog'; 

const getInitialYearOptionsMap = () => new Map(yearOptions.map(opt => [opt.value, opt]));

function ensureTotalRow(data: RefinedProductImport[]): RefinedProductImport[] {
    const existingTotal = data.find(d => d.month === 'Total');
    if (existingTotal) return data; 

    const monthlyData = data.filter(d => d.month !== 'Total');
    if (monthlyData.length === 0) return data;

    const newTotal = monthlyData.reduce((acc, row) => {
        acc['Gas Oil 0.05% M.S.'] += row['Gas Oil 0.05% M.S.'] || 0;
        acc['Gas Oil 0.001% M.S.'] += row['Gas Oil 0.001% M.S.'] || 0;
        acc['Pet 92'] += row['Pet 92'] || 0;
        acc['Pet 95'] += row['Pet 95'] || 0;
        acc['Jet A-1'] += row['Jet A-1'] || 0;
        acc['HSFO'] += row['HSFO'] || 0;
        acc['LSFO'] += row['LSFO'] || 0;
        acc['Naphtha'] += row['Naphtha'] || 0;
        acc.total += row.total || 0;
        return acc;
    }, { 
        month: 'Total', 
        'Gas Oil 0.05% M.S.': 0, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 0, 
        'Pet 95': 0, 'Jet A-1': 0, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 0 
    } as RefinedProductImport);

    return [...monthlyData, newTotal];
}

export function RefinedProductsDashboard({ initialData }: { initialData: RefinedProductImport[] }) {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [comparisonYear, setComparisonYear] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [dataCache, setDataCache] = useState<Record<string, RefinedProductImport[]>>({ 
    '2025': ensureTotalRow(initialData) 
  });
  const [availableYearsMap, setAvailableYearsMap] = useState(getInitialYearOptionsMap);

  const displayData: RefinedProductImport[] = useMemo(() => {
    return dataCache[selectedYear] || [];
  }, [selectedYear, dataCache]);

  const comparisonData: RefinedProductImport[] | undefined = useMemo(() => {
    return comparisonYear ? dataCache[comparisonYear] : undefined;
  }, [comparisonYear, dataCache]);
  
  const allAvailableYears = useMemo(() => {
    return Array.from(availableYearsMap.values()).sort((a, b) => parseInt(b.value) - parseInt(a.value));
  }, [availableYearsMap]);

  const initialVisibility = {
    month: true, total: true, JetA1: true, 'Pet 92': true, 'Pet 95': true,
    GasOil005MS: false, GasOil0001MS: false, LSFO: false, Naphtha: false, HSFO: false,
  } as Record<string, boolean>;

  const table = useDataTableInstance({
    data: displayData,
    columns,
    getRowId: (row: RefinedProductImport) => row.month,
    initialState: { columnVisibility: initialVisibility },
  });

  const fetchAndCacheData = useCallback(async (year: string) => {
    if (!dataCache[year]) {
      const newData = await fetchRefinedProductImports(year);
      if (newData && newData.length > 0) {
         const validatedData = ensureTotalRow(newData);
         setDataCache(prev => ({ ...prev, [year]: validatedData }));
         return validatedData;
      }
    }
    return dataCache[year];
  }, [dataCache]);

  const handleYearChange = useCallback(async (newYear: string) => {
    if (newYear === selectedYear) return;
    setSelectedYear(newYear); 
    if (newYear === comparisonYear) setComparisonYear('');
    if (!dataCache[newYear]) {
        setIsLoading(true);
        await fetchAndCacheData(newYear);
        setIsLoading(false);
    }
  }, [selectedYear, dataCache, comparisonYear, fetchAndCacheData]);
  
  const handleComparisonYearChange = useCallback(async (newYear: string) => {
    setComparisonYear(newYear);
    if (newYear && !dataCache[newYear]) {
        setIsLoading(true);
        await fetchAndCacheData(newYear);
        setIsLoading(false);
    }
  }, [dataCache, fetchAndCacheData]);

  const handleDataUpload = (year: string, data: RefinedProductImport[]) => {
    const validatedData = ensureTotalRow(data);
    setDataCache(prev => ({ ...prev, [year]: validatedData }));
    if (!availableYearsMap.has(year)) {
        setAvailableYearsMap(prev => {
            const newMap = new Map(prev);
            newMap.set(year, { value: year, label: `${year} (Uploaded)` });
            return newMap;
        });
    }
    setSelectedYear(year); 
  };

  const comparisonOptions = useMemo(() => {
    return allAvailableYears.filter(o => o.value !== selectedYear);
  }, [selectedYear, allAvailableYears]);

  if (isLoading || displayData.length === 0) {
    return <div className="flex justify-center items-center h-full min-h-[500px] text-muted-foreground text-xl">Loading data for {selectedYear}...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Refined Products Imports</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload Data</Button>
          <Select onValueChange={handleYearChange} defaultValue={selectedYear}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Year" /></SelectTrigger>
            <SelectContent>
              {allAvailableYears.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select onValueChange={handleComparisonYearChange} value={comparisonYear}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Compare Year..." /></SelectTrigger>
            <SelectContent>
              {comparisonOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label.replace(` (Initial Load)`, '')}</SelectItem>)}
              {comparisonYear && <SelectItem value="">Stop Comparison</SelectItem>}
            </SelectContent>
          </Select>
          <Button><TrendingUp className="mr-2 h-4 w-4" /> Export</Button>
        </div>
      </div>

      <Separator />

      <OverviewCards 
        currentYearData={displayData} 
        selectedYear={selectedYear} 
        comparisonYear={comparisonYear} 
        comparisonYearData={comparisonData} 
      />

      <div className="grid gap-4 grid-cols-1">
        {/* Expanded the chart to col-span-1 in a single column grid (Full Width) */}
        <ImportChart data={displayData.filter(d => d.month !== 'Total')} selectedYear={selectedYear} />
      </div>

      <Card className="col-span-12">
        <CardHeader>
          <CardTitle>Monthly Product-Wise Imports Table - {selectedYear}</CardTitle>
          <CardDescription>Detailed quantities in Metric Tons (MT).</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable key={selectedYear} table={table} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}