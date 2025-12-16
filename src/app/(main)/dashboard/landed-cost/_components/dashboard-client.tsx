// src/app/(main)/dashboard/landed-cost/_components/dashboard-client.tsx
"use client";

import { useState, useMemo, useCallback } from 'react';
import { TrendingUp, Upload } from 'lucide-react';

import { useDataTableInstance } from '@/hooks/use-data-table-instance';

import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
// Removed: import { Label } from '@/components/ui/label'; 

import { columns } from './columns';
import { 
  LandedCost, 
  yearOptions, 
  productNames,
  monthNames, 
  fetchLandedCost
} from './data';
import { OverviewCards } from './overview-cards';
import { CostChart } from './cost-chart';
// import { UploadDialog } from '../../refined-products/_components/upload-dialog'; 


const getInitialYearOptionsMap = () => new Map(yearOptions.map(opt => [opt.value, opt]));

function cleanLandedCostData(data: LandedCost[]): LandedCost[] {
    // Ensure all required fields exist and filter out any empty rows
    return data.filter(d => 
        d.month && d.month.trim() !== '' && 
        d.product && d.product.trim() !== '' &&
        d['Landing Cost (Rs/MT)'] > 0
    );
}


export function LandedCostDashboard({ initialData }: { initialData: LandedCost[] }) {
  
  const [selectedYear, setSelectedYear] = useState('2025');
  const [comparisonYear, setComparisonYear] = useState<string>('');
  // REMOVED: selectedProductFilter and selectedMonthFilter state
  const [isLoading, setIsLoading] = useState(false);
  
  const [dataCache, setDataCache] = useState<Record<string, LandedCost[]>>({ '2025': cleanLandedCostData(initialData) });
  const [availableYearsMap, setAvailableYearsMap] = useState(getInitialYearOptionsMap);

  const rawDisplayData: LandedCost[] = useMemo(() => {
    return dataCache[selectedYear] || [];
  }, [selectedYear, dataCache]);

  const rawComparisonData: LandedCost[] | undefined = useMemo(() => {
    return comparisonYear ? dataCache[comparisonYear] : undefined;
  }, [comparisonYear, dataCache]);

  // Data is no longer filtered, it displays the full dataset for the selected year
  const displayData = rawDisplayData;

  const allAvailableYears = useMemo(() => {
    return Array.from(availableYearsMap.values()).sort((a, b) => parseInt(b.value) - parseInt(a.value));
  }, [availableYearsMap]);

  const table = useDataTableInstance({
    data: displayData,
    columns,
    getRowId: (row: LandedCost) => `${row.month}-${row.product}`,
  });

  const fetchAndCacheData = useCallback(async (year: string) => {
    if (!dataCache[year]) {
      const newData = await fetchLandedCost(year);
      if (newData && newData.length > 0) {
         const validatedData = cleanLandedCostData(newData);
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
  
  const handleDataUpload = (year: string, data: LandedCost[]) => {
    const validatedData = cleanLandedCostData(data);
    
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
          Landed Cost of Refined Products
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
        
        {/* Cost Chart now spans 12 columns */}
        <Card className="col-span-12">
           <CostChart data={rawDisplayData} selectedYear={selectedYear} />
        </Card>
      </div>

      <Card className="col-span-12">
        <CardHeader>
          <CardTitle>Detailed Landed Cost Breakdown - {selectedYear}</CardTitle>
          <CardDescription>
            Landed Cost including CIF and Duties & Taxes (Rs/MT).
          </CardDescription>
        </CardHeader>
        <CardContent>
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