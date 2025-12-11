// src/app/(main)/dashboard/refined-products/_components/import-chart.tsx
"use client";

import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { productNames, RefinedProductImport } from './data';

// FIX: Define explicit color mapping for each product
const chartConfig = {
  // Gas Oils (Using Chart 1 and 2 - blues/greens)
  'Gas Oil 0.05% M.S.': { label: 'Gas Oil 0.05% M.S.', color: 'hsl(var(--chart-1))' },
  'Gas Oil 0.001% M.S.': { label: 'Gas Oil 0.001% M.S.', color: 'hsl(var(--chart-2))' },

  // Petrol/Gasoline (Using Chart 3 and 4 - oranges/reds)
  'Pet 92': { label: 'Pet 92', color: 'hsl(var(--chart-3))' },
  'Pet 95': { label: 'Pet 95', color: 'hsl(var(--chart-4))' },

  // Jet A-1 (Using Chart 5 - primary color)
  'Jet A-1': { label: 'Jet A-1', color: 'hsl(var(--chart-5))' },

  // Fuel Oils (Using Chart 6 and 7 - purples/cyans)
  'LSFO': { label: 'LSFO', color: 'hsl(var(--chart-6))' },
  'Naphtha': { label: 'Naphtha', color: 'hsl(var(--chart-7))' },

  // HSFO (Using Chart 8 - a fallback color, since it's zero data)
  'HSFO': { label: 'HSFO', color: 'hsl(var(--chart-8))' }, 
};

const stackedKeys = productNames.filter(p => p !== 'HSFO');

interface ImportChartProps {
    data: RefinedProductImport[];
    selectedYear: string;
}

export function ImportChart({ data, selectedYear }: ImportChartProps) {
  const [selectedProduct, setSelectedProduct] = useState<'All' | string>('All');
  
  const chartData = useMemo(() => {
    return data.filter(d => d.total > 0);
  }, [data]);

  // Custom formatter for the Recharts Tooltip
  const valueFormatter = (value: number) => {
    return `${value.toLocaleString('en-US', { maximumFractionDigits: 0 })} MT`;
  };

  const chartSubtitle = selectedYear === '2025' 
    ? 'Breakdown of refined product imports by month (Jan - Jul 2025)'
    : selectedYear === '2024'
    ? 'Breakdown of refined product imports by month (Jan - Dec 2024)'
    : `Breakdown of refined product imports by month for year ${selectedYear}`;


  return (
    <Card className="col-span-12 lg:col-span-8">
      <CardHeader className="flex-row justify-between items-center">
        <div>
          <CardTitle>Monthly Import Volume (MT) - {selectedYear}</CardTitle>
          <CardDescription>{chartSubtitle}</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Select 
            onValueChange={(value) => setSelectedProduct(value)} 
            defaultValue="All"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Products (Stacked)</SelectItem>
              {productNames.map(product => (
                <SelectItem key={product} value={product}>
                  {product.replace(' M.S.', '')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis 
              tickFormatter={(value) => value.toLocaleString()} 
              axisLine={false} 
              tickLine={false} 
              tickMargin={10} 
            />
            <ChartTooltip 
              cursor={false} 
              content={<ChartTooltipContent valueFormatter={valueFormatter} />} 
            />
            <Legend />
            
            {/* Conditional rendering for stacked or single bar chart */}
            {selectedProduct === 'All' ? (
                // Stacked Bar Chart for "All Products"
                stackedKeys.map((key) => (
                    <Bar
                        key={key}
                        dataKey={key as keyof RefinedProductImport}
                        stackId="a"
                        // FIX: Use the specific color property from chartConfig
                        fill={chartConfig[key as keyof typeof chartConfig].color.replace('hsl(var(', 'var(').replace('))', '')}
                        radius={[4, 4, 0, 0]}
                    />
                ))
            ) : (
                // Simple Bar Chart for single product
                <Bar 
                    dataKey={selectedProduct as keyof RefinedProductImport} 
                    // FIX: Use the specific color property from chartConfig
                    fill={chartConfig[selectedProduct as keyof typeof chartConfig].color.replace('hsl(var(', 'var(').replace('))', '')} 
                    radius={[4, 4, 0, 0]}
                />
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}