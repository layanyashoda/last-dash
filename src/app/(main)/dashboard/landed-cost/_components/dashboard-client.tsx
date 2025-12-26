"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { TrendingUp, Receipt } from 'lucide-react';
import { useDataTableInstance } from '@/hooks/use-data-table-instance';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

import { columns } from './columns';
import { LandedCost, yearOptions, fetchLandedCost } from './data';
import { OverviewCards } from './overview-cards';
import { CostChart } from './cost-chart';
import { UploadDialog } from '../../refined-products/_components/upload-dialog'; // Reuse shared upload dialog
import { mapLandedCostData } from './data-mapper';

const STORAGE_KEY = 'landed_cost_cache';

export function LandedCostDashboard({ initialData }: { initialData: LandedCost[] }) {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [comparisonYear, setComparisonYear] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Cache Management
  const [dataCache, setDataCache] = useState<Record<string, LandedCost[]>>({ '2025': initialData });
  const [availableYears, setAvailableYears] = useState(yearOptions);

  // 1. Persistence Logic: Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setDataCache(parsed);
      const storedYears = Object.keys(parsed).map(y => ({ value: y, label: `${y} (Saved)` }));
      setAvailableYears(prev => {
        const existing = prev.map(p => p.value);
        const filtered = storedYears.filter(s => !existing.includes(s.value));
        return [...prev, ...filtered];
      });
    }
  }, []);

  // 2. Persistence Logic: Save to LocalStorage on update
  useEffect(() => {
    if (Object.keys(dataCache).length > 1 || !dataCache['2025']) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataCache));
    }
  }, [dataCache]);

  const displayData = useMemo(() => dataCache[selectedYear] || [], [selectedYear, dataCache]);
  const comparisonData = useMemo(() => comparisonYear ? dataCache[comparisonYear] : undefined, [comparisonYear, dataCache]);

  const table = useDataTableInstance({
    data: displayData,
    columns,
    getRowId: (row: LandedCost) => `${row.month}-${row.product}`,
  });

  const handleDataUpload = (year: string, rawData: any[]) => {
    const mappedData = mapLandedCostData(rawData);
    setDataCache(prev => ({ ...prev, [year]: mappedData }));
    
    if (!availableYears.some(y => y.value === year)) {
      setAvailableYears(prev => [...prev, { value: year, label: `${year} (Uploaded)` }]);
    }
    setSelectedYear(year);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Landed Cost Dashboard</h2>
        <div className="flex items-center space-x-2">
          <UploadDialog onDataUpload={handleDataUpload} />
          
          <Select onValueChange={setSelectedYear} value={selectedYear}>
            <SelectTrigger className="w-[130px]"><SelectValue placeholder="Year" /></SelectTrigger>
            <SelectContent>
              {availableYears.map(y => <SelectItem key={y.value} value={y.value}>{y.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select onValueChange={setComparisonYear} value={comparisonYear}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Compare" /></SelectTrigger>
            <SelectContent>
              {availableYears.filter(y => y.value !== selectedYear).map(y => (
                <SelectItem key={y.value} value={y.value}>{y.label.split(' (')[0]}</SelectItem>
              ))}
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
        {/* Visual Comparison Chart */}
        
        <CostChart 
          data={displayData} 
          comparisonData={comparisonData} 
          selectedYear={selectedYear} 
          comparisonYear={comparisonYear} 
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly breakdown - {selectedYear}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable table={table} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}