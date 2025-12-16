// src/app/(main)/dashboard/oil-balance/_components/balance-chart.tsx
"use client";

import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OilBalanceEntry, balanceItems } from './data';
import { Separator } from '@/components/ui/separator';

const formatMT = (value: number) => {
    const num = value / 1000;
    return `${num.toFixed(0)}k MT`;
};

const chartConfig = {
    'Crude Oil Input (MT)': { label: 'Crude Input', color: 'hsl(var(--chart-1))' },
    'Refinery Production (MT)': { label: 'Production', color: 'hsl(var(--chart-2))' },
    'Refined Product Imports (MT)': { label: 'Imports', color: 'hsl(var(--chart-3))' },
    'Total Sales (MT)': { label: 'Sales/Demand', color: 'hsl(var(--chart-4))' },
    'Total Own Use & Loss (MT)': { label: 'Loss', color: 'hsl(var(--chart-5))' },
    'Stock Change (MT)': { label: 'Stock Change', color: 'hsl(var(--chart-6))' },
};

const defaultKeys = ['Refinery Production (MT)', 'Refined Product Imports (MT)', 'Total Sales (MT)'];

interface BalanceChartProps {
    data: OilBalanceEntry[];
    selectedYear: string;
}

export function BalanceChart({ data, selectedYear }: BalanceChartProps) {
  const [selectedView, setSelectedView] = useState<'All' | 'SupplyDemand'>('SupplyDemand');
  
  const chartData = useMemo(() => {
    return data.filter(d => d.month);
  }, [data]);

  const valueFormatter = (value: number) => {
    return value.toLocaleString('en-US', { minimumFractionDigits: 0 }) + ' MT';
  };
  
  const chartKeys = selectedView === 'All' 
    ? balanceItems 
    : defaultKeys;

  const chartDescription = selectedView === 'All' 
    ? 'All components of the oil balance, MT.'
    : 'Comparison of key supply (Production + Imports) versus demand (Total Sales), MT.';


  return (
    <Card className="col-span-12">
      <CardHeader className="flex-row justify-between items-center">
        <div>
          <CardTitle>Monthly Oil Balance Trend - {selectedYear}</CardTitle>
          <CardDescription>{chartDescription}</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Select 
            onValueChange={(value) => setSelectedView(value as 'All' | 'SupplyDemand')} 
            defaultValue="SupplyDemand"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SupplyDemand">Supply & Demand</SelectItem>
              <Separator />
              <SelectItem value="All">All Components</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barSize={10}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis 
              tickFormatter={(value) => formatMT(value)} 
              axisLine={false} 
              tickLine={false} 
              tickMargin={10} 
            />
            <ChartTooltip 
              cursor={{ fill: 'transparent' }} 
              content={<ChartTooltipContent valueFormatter={valueFormatter} />} 
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            
            {chartKeys.map((key, index) => {
                const config = chartConfig[key as keyof typeof chartConfig];
                const isStacked = key === 'Refinery Production (MT)' || key === 'Refined Product Imports (MT)';
                
                return (
                    <Bar
                        key={key}
                        dataKey={key as keyof OilBalanceEntry}
                        // Stack Production and Imports as Supply
                        stackId={isStacked ? "supply" : undefined}
                        fill={config.color.replace('hsl(var(', 'var(').replace('))', '')}
                        radius={isStacked ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                );
            })}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}