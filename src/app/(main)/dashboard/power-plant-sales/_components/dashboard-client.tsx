// src/app/(main)/dashboard/power-plant-sales/_components/dashboard-client.tsx
"use client";

import { useState, useMemo, useCallback } from 'react';
import { TrendingUp, Upload } from 'lucide-react';

import { useDataTableInstance } from '@/hooks/use-data-table-instance';

import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

import { columns } from './columns';
import { 
  PowerPlantSalesEntry, 
  yearOptions, 
  powerPlants,
  fetchPowerPlantSales
} from './data';
import { OverviewCards } from './overview-cards';
import { SalesChart } from './sales-chart';


const getInitialYearOptionsMap = () => new Map(yearOptions.map(opt => [opt.value, opt]));

// Helper function to ensure total row exists (if needed for custom uploaded data)
function ensureTotalRow(data: PowerPlantSalesEntry[]): PowerPlantSalesEntry[] {
    const existingTotal = data.find(d => d.month === 'Total');
    if (existingTotal) return data; 

    const monthlyData = data.filter(d => d.month !== 'Total');
    if (monthlyData.length === 0) return data;

    const newTotal = monthlyData.reduce((acc, row) => acc + row.sales_mt, 0);
    
    // Aggregate by month, then plant, then total
    const cleanData = data.filter(d => d.month !== 'Total');
    
    return [...cleanData, { month: 'Total', plant: 'All Plants', sales_mt: newTotal }];
}


export function PowerPlantSalesDashboard({ initialData }: { initialData: PowerPlantSalesEntry[] }) {
  
  const [selectedYear, setSelectedYear] = useState('2025');
  const [comparisonYear, setComparisonYear] = useState<string>('');
  const [selectedPlantFilter, setSelectedPlantFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);
  
  const [dataCache, setDataCache] = useState<Record<string, PowerPlantSalesEntry[]>>({ '2025': ensureTotalRow(initialData) });
  const [availableYearsMap, setAvailableYearsMap] = useState(getInitialYearOptionsMap);

  const rawDisplayData: PowerPlantSalesEntry[] = useMemo(() => {
    return dataCache[selectedYear] || [];
  }, [selectedYear, dataCache]);

  const rawComparisonData: PowerPlantSalesEntry[] | undefined = useMemo(() => {
    return comparisonYear ? dataCache[comparisonYear] : undefined;
  }, [comparisonYear, dataCache]);

  const displayData = useMemo(() => {
    let filteredData = rawDisplayData;

    if (selectedPlantFilter !== 'All') {
        filteredData = filteredData.filter(d => d.plant === selectedPlantFilter);
    }
    
    // We keep the Total row for KPIs, but ensure it's calculated based on filters
    if (selectedPlantFilter !== 'All') {
        const total = filteredData.filter(d => d.month !== 'Total').reduce((sum, d) => sum + d.sales_mt, 0);
        const nonTotalData = filteredData.filter(d => d.month !== 'Total');
        return [...nonTotalData, { month: 'Total', plant: selectedPlantFilter, sales_mt: total }];
    }
    
    return filteredData;
  }, [rawDisplayData, selectedPlantFilter]);

  const allAvailableYears = useMemo(() => {
    return Array.from(availableYearsMap.values()).sort((a, b) => parseInt(b.value) - parseInt(a.value));
  }, [availableYearsMap]);

  const table = useDataTableInstance({
    data: displayData,
    columns,
    getRowId: (row: PowerPlantSalesEntry) => `${row.month}-${row.plant}`,
  });

  const fetchAndCacheData = useCallback(async (year: string) => {
    if (!dataCache[year]) {
      const newData = await fetchPowerPlantSales(year);
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

    if (newYear === comparisonYear) {
        setComparisonYear('');
    }

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
  
  const handleDataUpload = (year: string, data: PowerPlantSalesEntry[]) => {
    const validatedData = ensureTotalRow(data);
    
    setDataCache(prev => ({ ...prev, [year]: validatedData }));
    
    if (!availableYearsMap.has(year) || availableYearsMap.get(year)?.label.includes('Initial Load')) {
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

  const plantFilterOptions = useMemo(() => {
    return powerPlants.filter(p => p !== 'Total Sales').map(name => ({ value: name, label: name }));
  }, []);


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
        <h2 className="text-3xl font-bold tracking-tight">
          Power Plant Sales
        </h2>
        <div className="flex items-center space-x-2">
          
          {/* PLACEHOLDER: UploadDialog implementation needed */}
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Upload Data
          </Button>
          
          <Select onValueChange={handleYearChange} defaultValue={selectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {allAvailableYears.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={handleComparisonYearChange} value={comparisonYear}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Compare Year..." />
            </SelectTrigger>
            <SelectContent>
              {comparisonOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label.replace(` (Mock)`, '')}</SelectItem>
              ))}
              {comparisonYear && <SelectItem value="">Stop Comparison</SelectItem>}
            </SelectContent>
          </Select>
          
          <Button>
            <TrendingUp className="mr-2 h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>

      <Separator />

      <OverviewCards 
        currentYearData={rawDisplayData} 
        selectedYear={selectedYear} 
        comparisonYear={comparisonYear} 
        comparisonYearData={rawComparisonData} 
      />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">
        
        {/* Sales Chart (Full Width) */}
        <Card className="col-span-12">
           <SalesChart data={rawDisplayData} selectedYear={selectedYear} />
        </Card>
      </div>

      <Card className="col-span-12">
        <CardHeader>
          <CardTitle>Sales Breakdown - {selectedYear}</CardTitle>
          <CardDescription>
            Sales Volume (MT) per Power Plant and Month.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <div className="flex justify-end pb-4">
                <div className="w-[200px]">
                    <Label>Filter by Plant</Label>
                    <Select onValueChange={setSelectedPlantFilter} defaultValue="All">
                        <SelectTrigger><SelectValue placeholder="All Plants" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Plants</SelectItem>
                            <Separator />
                            {plantFilterOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
          <DataTable
            key={`${selectedYear}-${selectedPlantFilter}`} 
            table={table}
            columns={columns}
          />
        </CardContent>
      </Card>
    </div>
  );
}