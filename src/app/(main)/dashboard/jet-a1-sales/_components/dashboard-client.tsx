// src/app/(main)/dashboard/jet-a1-sales/_components/dashboard-client.tsx
"use client";

import { useState, useMemo, useCallback } from 'react';
import { TrendingUp, PieChart, Upload } from 'lucide-react'; // Added Upload for completeness

import { useDataTableInstance } from '@/hooks/use-data-table-instance';

import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
// FIX: Import the missing Label component
import { Label } from '@/components/ui/label';

import { columns } from './columns';
import { 
  JetA1SalesData, 
  yearOptions, 
  airlineNames,
  monthNames,
  fetchJetA1Sales 
} from './data';
import { OverviewCards } from './overview-cards';
import { SalesChart } from './sales-chart';
// import { UploadDialog } from './upload-dialog'; 


const getInitialYearOptionsMap = () => new Map(yearOptions.map(opt => [opt.value, opt]));

// Helper to calculate total for resilience
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
  const [selectedAirlineFilter, setSelectedAirlineFilter] = useState<string>('ALL');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  
  const [dataCache, setDataCache] = useState<Record<string, JetA1SalesData[]>>({ '2025': ensureTotalRow(initialData) });
  const [availableYearsMap, setAvailableYearsMap] = useState(getInitialYearOptionsMap);

  const rawDisplayData: JetA1SalesData[] = useMemo(() => {
    return dataCache[selectedYear] || [];
  }, [selectedYear, dataCache]);

  const rawComparisonData: JetA1SalesData[] | undefined = useMemo(() => {
    return comparisonYear ? dataCache[comparisonYear] : undefined;
  }, [comparisonYear, dataCache]);

  const displayData = useMemo(() => {
    let filteredData = rawDisplayData.filter(d => d.month !== 'Total');

    if (selectedAirlineFilter !== 'ALL') {
        filteredData = filteredData.filter(d => d.airline === selectedAirlineFilter);
    }
    if (selectedMonthFilter !== 'ALL') {
        filteredData = filteredData.filter(d => d.month === selectedMonthFilter);
    }

    const filteredTotal = filteredData.reduce((sum, d) => sum + d.sale_liters, 0);
    const totalRow = { month: 'Total', airline: (selectedAirlineFilter !== 'ALL' || selectedMonthFilter !== 'ALL') ? 'FILTERED' : 'ALL', sale_liters: filteredTotal };
    
    return [...filteredData, totalRow];

  }, [rawDisplayData, selectedAirlineFilter, selectedMonthFilter]);

  const allAvailableYears = useMemo(() => {
    return Array.from(availableYearsMap.values()).sort((a, b) => parseInt(b.value) - parseInt(a.value));
  }, [availableYearsMap]);

  const table = useDataTableInstance({
    data: displayData,
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
  
  const handleDataUpload = (year: string, data: JetA1SalesData[]) => {
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
          Jet A-1 Sales
        </h2>
        <div className="flex items-center space-x-2">
          
          {/* NOTE: UploadDialog component implementation is still required */}
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
                <SelectItem key={option.value} value={option.value}>{option.label.replace(` (Initial Load)`, '')}</SelectItem>
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
        
        <SalesChart data={rawDisplayData.filter(d => d.month !== 'Total')} selectedYear={selectedYear} />

        <Card className="col-span-12 lg:col-span-4">
          <CardHeader>
            <CardTitle>Filter and View</CardTitle>
            <CardDescription>Filter data displayed in the table below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label>Filter by Airline</Label> {/* FIX: Label component used */}
                <Select onValueChange={setSelectedAirlineFilter} defaultValue="ALL">
                    <SelectTrigger><SelectValue placeholder="All Airlines" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Airlines</SelectItem>
                        <Separator />
                        {airlineNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                    </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label>Filter by Month</Label> {/* FIX: Label component used */}
                <Select onValueChange={setSelectedMonthFilter} defaultValue="ALL">
                    <SelectTrigger><SelectValue placeholder="All Months" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Months</SelectItem>
                        <Separator />
                        {monthNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                    </SelectContent>
                </Select>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-12">
        <CardHeader>
          <CardTitle>Detailed Sales Breakdown - {selectedYear}</CardTitle>
          <CardDescription>
            Sales in Liters per Airline and Month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            key={`${selectedYear}-${selectedAirlineFilter}-${selectedMonthFilter}`} 
            table={table}
            columns={columns}
          />
        </CardContent>
      </Card>
    </div>
  );
}