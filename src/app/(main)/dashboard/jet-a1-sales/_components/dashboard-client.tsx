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
  JetA1SalesData, 
  yearOptions, 
  fetchJetA1Sales 
} from './data';
import { OverviewCards } from './overview-cards';
import { SalesChart } from './sales-chart';

const getInitialYearOptionsMap = () => new Map(yearOptions.map(opt => [opt.value, opt]));

function ensureTotalRow(data: JetA1SalesData[]): JetA1SalesData[] {
    const existingTotal = data.find(d => d.month === 'Total');
    if (existingTotal && existingTotal.airline === 'ALL') return data; 

    const monthlyData = data.filter(d => d.month !== 'Total');
    if (monthlyData.length === 0) return data;

    const newTotal = monthlyData.reduce((acc, row) => acc + row.sale_liters, 0);
    const cleanData = data.filter(d => d.month !== 'Total');
    
    return [...cleanData, { month: 'Total', airline: 'ALL', sale_liters: newTotal }];
}

export function JetA1SalesDashboard({ initialData }: { initialData: JetA1SalesData[] }) {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [comparisonYear, setComparisonYear] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [dataCache, setDataCache] = useState<Record<string, JetA1SalesData[]>>({ '2025': ensureTotalRow(initialData) });
  const [availableYearsMap, setAvailableYearsMap] = useState(getInitialYearOptionsMap);

  const rawDisplayData: JetA1SalesData[] = useMemo(() => {
    return dataCache[selectedYear] || [];
  }, [selectedYear, dataCache]);

  const rawComparisonData: JetA1SalesData[] | undefined = useMemo(() => {
    return comparisonYear ? dataCache[comparisonYear] : undefined;
  }, [comparisonYear, dataCache]);

  const allAvailableYears = useMemo(() => {
    return Array.from(availableYearsMap.values()).sort((a, b) => parseInt(b.value) - parseInt(a.value));
  }, [availableYearsMap]);

  const table = useDataTableInstance({
    data: rawDisplayData,
    columns,
    getRowId: (row: JetA1SalesData) => `${row.month}-${row.airline}`,
  });

  const fetchAndCacheData = useCallback(async (year: string) => {
    if (!dataCache[year]) {
      const newData = await fetchJetA1Sales(year);
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
  
  const handleDataUpload = (year: string, data: JetA1SalesData[]) => {
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

  if (isLoading || rawDisplayData.length === 0) {
    return (
      <div className="flex justify-center items-center h-full min-h-[500px]">
        <p className="text-xl text-muted-foreground">Loading data for {selectedYear}...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Jet A-1 Sales</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload</Button>
          <Select onValueChange={handleYearChange} defaultValue={selectedYear}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Year" /></SelectTrigger>
            <SelectContent>
              {allAvailableYears.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select onValueChange={handleComparisonYearChange} value={comparisonYear}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Compare" /></SelectTrigger>
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
        currentYearData={rawDisplayData} 
        selectedYear={selectedYear} 
        comparisonYear={comparisonYear} 
        comparisonYearData={rawComparisonData} 
      />

      <div className="grid gap-4 grid-cols-1">
        {/* Full width chart grid */}
        <SalesChart data={rawDisplayData.filter(d => d.month !== 'Total')} selectedYear={selectedYear} />
      </div>

      <Card className="col-span-12">
        <CardHeader>
          <CardTitle>Detailed Sales Breakdown - {selectedYear}</CardTitle>
          <CardDescription>Sales in Liters per Airline and Month.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable key={selectedYear} table={table} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}