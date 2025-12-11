// src/app/(main)/dashboard/refined-products/_components/dashboard-client.tsx
"use client";

import { useState, useMemo, useCallback } from 'react';
import { TrendingUp, PieChart } from 'lucide-react';

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
  productNames,
  fetchRefinedProductImports 
} from './data';
import { OverviewCards } from './overview-cards';
import { ImportChart } from './import-chart';
import { UploadDialog } from './upload-dialog'; 

// Helper function to create the initial map from the array
const getInitialYearOptionsMap = () => new Map(yearOptions.map(opt => [opt.value, opt]));

// NEW: Helper function to calculate/verify the Total row for resiliency
function ensureTotalRow(data: RefinedProductImport[]): RefinedProductImport[] {
    const existingTotal = data.find(d => d.month === 'Total');
    const monthlyData = data.filter(d => d.month !== 'Total');

    // If the data already contains a total row, return it as is.
    if (existingTotal) return data; 

    // If the data is empty, return empty
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
        'Gas Oil 0.05% M.S.': 0, 
        'Gas Oil 0.001% M.S.': 0, 
        'Pet 92': 0, 
        'Pet 95': 0, 
        'Jet A-1': 0, 
        'HSFO': 0, 
        'LSFO': 0, 
        'Naphtha': 0, 
        total: 0 
    } as RefinedProductImport);

    if (newTotal.total === 0) return data; // If sum is zero, skip appending

    // Append the calculated total row to the end of the monthly data
    return [...monthlyData, newTotal];
}


export function RefinedProductsDashboard({ initialData }: { initialData: RefinedProductImport[] }) {
  
  const [selectedYear, setSelectedYear] = useState('2025');
  const [comparisonYear, setComparisonYear] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Ensure initial data is processed for a Total row guarantee
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

  // Initial column visibility (remains the same)
  const initialVisibility = {
    month: true, total: true, JetA1: true, 'Pet 92': true, 'Pet 95': true,
    GasOil005MS: false, GasOil0001MS: false, LSFO: false, Naphtha: false, HSFO: false,
  } as Record<string, boolean>;

  // Instantiate the table object (correctly at the top level)
  const table = useDataTableInstance({
    data: displayData,
    columns,
    getRowId: (row: RefinedProductImport) => row.month,
    initialState: {
        columnVisibility: initialVisibility,
    },
  });
  
  // Logic for the product share breakdown
  const productShareData = useMemo(() => {
    const totalData = displayData.find(d => d.month === 'Total');
    return productNames
      .map(product => ({
        name: product.replace(' M.S.', ''),
        value: totalData ? totalData[product as keyof RefinedProductImport] : 0,
        share: totalData && totalData.total > 0 ? (totalData[product as keyof RefinedProductImport] / totalData.total) * 100 : 0,
      }))
      .filter(p => p.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [displayData]);

  // Function to fetch and cache data for a given year
  const fetchAndCacheData = useCallback(async (year: string) => {
    if (!dataCache[year]) {
      const newData = await fetchRefinedProductImports(year);
      if (newData && newData.length > 0) {
         const validatedData = ensureTotalRow(newData); // Validate fetched data
         setDataCache(prev => ({ ...prev, [year]: validatedData }));
         return validatedData;
      }
    }
    return dataCache[year];
  }, [dataCache]);


  // Handle year change: Check cache, if missing, fetch the data dynamically
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
  
  // Handle comparison year change, fetching if necessary
  const handleComparisonYearChange = useCallback(async (newYear: string) => {
    setComparisonYear(newYear);

    if (newYear && !dataCache[newYear]) {
        setIsLoading(true);
        await fetchAndCacheData(newYear);
        setIsLoading(false);
    }
  }, [dataCache, fetchAndCacheData]);
  
  // Handler for uploaded data: updates cache and available years
  const handleDataUpload = (year: string, data: RefinedProductImport[]) => {
    const validatedData = ensureTotalRow(data); // Validate uploaded data
    
    // Set cache first
    setDataCache(prev => ({ ...prev, [year]: validatedData }));
    
    // Update available years list
    if (!availableYearsMap.has(year) || availableYearsMap.get(year)?.label.includes('Initial Load')) {
        setAvailableYearsMap(prev => {
            const newMap = new Map(prev);
            newMap.set(year, { value: year, label: `${year} (Uploaded)` });
            return newMap;
        });
    }

    // Finally, change selected year to trigger full UI refresh
    setSelectedYear(year); 
  };


  const comparisonOptions = useMemo(() => {
    return allAvailableYears.filter(o => o.value !== selectedYear);
  }, [selectedYear, allAvailableYears]);


  if (isLoading || displayData.length === 0) {
    return (
      <div className="flex justify-center items-center h-full min-h-[500px]">
        {/* You can replace this with your project's Spinner/Loader component */}
        <p className="text-xl text-muted-foreground">Loading data for {selectedYear}...</p>
      </div>
    );
  }


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Refined Products Imports
        </h2>
        <div className="flex items-center space-x-2">
          
          <UploadDialog onDataUpload={handleDataUpload} availableYears={allAvailableYears} />
          
          <Select onValueChange={handleYearChange} defaultValue={selectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {allAvailableYears.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={handleComparisonYearChange} value={comparisonYear}>
            <SelectTrigger className="w-[180px]">
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

      {/* KPI CARDS: Guaranteed correct data flow */}
      <OverviewCards 
        currentYearData={displayData} 
        selectedYear={selectedYear} 
        comparisonYear={comparisonYear} 
        comparisonYearData={comparisonData} 
      />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">
        
        <ImportChart data={displayData.filter(d => d.month !== 'Total')} selectedYear={selectedYear} />

        <Card className="col-span-12 lg:col-span-4">
          <CardHeader>
            <CardTitle>Product Share (MT) - {selectedYear}</CardTitle>
            <CardDescription>Top products by volume for {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col items-center justify-center space-y-2">
             <PieChart className="h-16 w-16 text-primary/80" />
            <div className="text-center text-sm text-muted-foreground">
              [Pie Chart Component Placeholder]<br/>
              {productShareData.length > 0 && (
                <>
                  <span className="font-semibold text-primary/90">{productShareData[0].name}</span> accounts for <span className="font-semibold text-primary/90">{productShareData[0].share.toFixed(1)}%</span> of the total.
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-12">
        <CardHeader>
          <CardTitle>Monthly Product-Wise Imports Table - {selectedYear}</CardTitle>
          <CardDescription>
            Detailed Bill of Lading Quantity in Metric Tons (MT). Use the <span className="font-semibold">View Options</span> to toggle product visibility.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* The key={selectedYear} forces the DataTable to re-render with the new data prop */}
          <DataTable
            key={selectedYear} 
            table={table}
            columns={columns}
          />
        </CardContent>
      </Card>
    </div>
  );
}