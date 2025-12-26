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
  PowerPlantSalesEntry, 
  yearOptions, 
  fetchPowerPlantSales
} from './data';
import { OverviewCards } from './overview-cards';
import { SalesChart } from './sales-chart';


const getInitialYearOptionsMap = () => new Map(yearOptions.map(opt => [opt.value, opt]));

function cleanPowerPlantSalesData(data: PowerPlantSalesEntry[]): PowerPlantSalesEntry[] {
    return data.filter(d => 
        d.month && d.month.trim() !== '' && 
        d.plant && d.plant.trim() !== '' &&
        d.sales_mt > 0
    );
}

export function PowerPlantSalesDashboard({ initialData }: { initialData: PowerPlantSalesEntry[] }) {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [comparisonYear, setComparisonYear] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [dataCache, setDataCache] = useState<Record<string, PowerPlantSalesEntry[]>>({ '2025': cleanPowerPlantSalesData(initialData) });
  const [availableYearsMap, setAvailableYearsMap] = useState(getInitialYearOptionsMap);

  const rawDisplayData: PowerPlantSalesEntry[] = useMemo(() => {
    return dataCache[selectedYear] || [];
  }, [selectedYear, dataCache]);

  const rawComparisonData: PowerPlantSalesEntry[] | undefined = useMemo(() => {
    return comparisonYear ? dataCache[comparisonYear] : undefined;
  }, [comparisonYear, dataCache]);

  const allAvailableYears = useMemo(() => {
    return Array.from(availableYearsMap.values()).sort((a, b) => parseInt(b.value) - parseInt(a.value));
  }, [availableYearsMap]);

  const comparisonOptions = useMemo(() => {
    return allAvailableYears.filter(o => o.value !== selectedYear);
  }, [selectedYear, allAvailableYears]);

  const table = useDataTableInstance({
    data: rawDisplayData,
    columns,
    getRowId: (row: PowerPlantSalesEntry) => `${row.month}-${row.plant}`,
  });

  const fetchAndCacheData = useCallback(async (year: string) => {
    if (!dataCache[year]) {
      const newData = await fetchPowerPlantSales(year);
      if (newData && newData.length > 0) {
         const validatedData = cleanPowerPlantSalesData(newData);
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
        <h2 className="text-3xl font-bold tracking-tight">Power Plant Sales</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload Data</Button>
          <Select onValueChange={handleYearChange} defaultValue={selectedYear}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Year" /></SelectTrigger>
            <SelectContent>
              {allAvailableYears.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select onValueChange={handleComparisonYearChange} value={comparisonYear}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Compare" /></SelectTrigger>
            <SelectContent>
              {comparisonOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                    {option.label.replace(` (Full Year Mock)`, '')}
                </SelectItem>
              ))}
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
        {/* Fixed: redundant Card wrapper removed */}
        <SalesChart data={rawDisplayData} selectedYear={selectedYear} />
      </div>

      <Card className="col-span-12">
        <CardHeader>
          <CardTitle>Sales Breakdown - {selectedYear}</CardTitle>
          <CardDescription>Sales Volume (MT) per Power Plant and Month.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable key={selectedYear} table={table} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}