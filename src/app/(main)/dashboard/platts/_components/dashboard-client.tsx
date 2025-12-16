// src/app/(main)/dashboard/platts/_components/dashboard-client.tsx
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
  PlattsPrice, 
  yearOptions, 
  productNames,
  monthNames,
  fetchPlattsPrices
} from './data';
import { OverviewCards } from './overview-cards';
import { PriceChart } from './price-chart';
// import { UploadDialog } from '../../refined-products/_components/upload-dialog'; // Assuming path to shared upload component


const getInitialYearOptionsMap = () => new Map(yearOptions.map(opt => [opt.value, opt]));

function cleanPlattsData(data: PlattsPrice[]): PlattsPrice[] {
    // Price data often doesn't need total rows, but we ensure any empty/invalid month rows are removed
    return data.filter(d => d.month && d.month.trim() !== '' && d.month !== 'Total');
}


export function PlattsDashboard({ initialData }: { initialData: PlattsPrice[] }) {
  
  const [selectedYear, setSelectedYear] = useState('2025');
  const [comparisonYear, setComparisonYear] = useState<string>('');
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('All');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);
  
  const [dataCache, setDataCache] = useState<Record<string, PlattsPrice[]>>({ '2025': cleanPlattsData(initialData) });
  const [availableYearsMap, setAvailableYearsMap] = useState(getInitialYearOptionsMap);

  const rawDisplayData: PlattsPrice[] = useMemo(() => {
    return dataCache[selectedYear] || [];
  }, [selectedYear, dataCache]);

  const rawComparisonData: PlattsPrice[] | undefined = useMemo(() => {
    return comparisonYear ? dataCache[comparisonYear] : undefined;
  }, [comparisonYear, dataCache]);

  const displayData = useMemo(() => {
    let filteredData = rawDisplayData;

    if (selectedMonthFilter !== 'All') {
        filteredData = filteredData.filter(d => d.month === selectedMonthFilter);
    }
    
    // Note: Filtering by product is not done here; the table/chart will handle filtering/visibility.
    return filteredData;
  }, [rawDisplayData, selectedMonthFilter]);

  const allAvailableYears = useMemo(() => {
    return Array.from(availableYearsMap.values()).sort((a, b) => parseInt(b.value) - parseInt(a.value));
  }, [availableYearsMap]);

  const table = useDataTableInstance({
    data: displayData,
    columns,
    getRowId: (row: PlattsPrice) => row.month,
  });

  const fetchAndCacheData = useCallback(async (year: string) => {
    if (!dataCache[year]) {
      const newData = await fetchPlattsPrices(year);
      if (newData && newData.length > 0) {
         const validatedData = cleanPlattsData(newData);
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
  
  // NOTE: Assuming the UploadDialog component will be provided by the user.
  const handleDataUpload = (year: string, data: PlattsPrice[]) => {
    const validatedData = cleanPlattsData(data);
    
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

  // Use the list of available product names for the chart/filter options
  const productFilterOptions = useMemo(() => {
    return productNames.map(name => ({ value: name, label: name }));
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
          Platts Market Prices
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
        
        {/* Price Chart */}
        <PriceChart data={rawDisplayData} selectedYear={selectedYear} />

        <Card className="col-span-12 lg:col-span-4">
          <CardHeader>
            <CardTitle>Filter and View</CardTitle>
            <CardDescription>Filter data displayed in the table below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label>Filter by Product</Label>
                <Select onValueChange={setSelectedProductFilter} defaultValue="All">
                    <SelectTrigger><SelectValue placeholder="All Products" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Products</SelectItem>
                        <Separator />
                        {productFilterOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label>Filter by Month</Label>
                <Select onValueChange={setSelectedMonthFilter} defaultValue="All">
                    <SelectTrigger><SelectValue placeholder="All Months" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Months</SelectItem>
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
          <CardTitle>Monthly Price Breakdown - {selectedYear}</CardTitle>
          <CardDescription>
            Average Platts Prices in USD per Barrel (or MT).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            // Key ensures the table is refreshed when filters or year change
            key={`${selectedYear}-${selectedMonthFilter}`} 
            table={table}
            columns={columns}
          />
        </CardContent>
      </Card>
    </div>
  );
}