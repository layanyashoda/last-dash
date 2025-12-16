// src/app/(main)/dashboard/sap-sales/_components/sales-chart.tsx
"use client";

import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SapSalesEntry, productNames } from './data';
import { Separator } from '@/components/ui/separator';

const formatMT = (value: number) => {
    const num = value / 1000;
    return `${num.toFixed(0)}k MT`;
};

const chartConfig = productNames.reduce((acc, name, index) => {
    acc[name] = { label: name, color: `hsl(var(--chart-${(index % 6) + 1}))` };
    return acc;
}, {} as Record<string, { label: string, color: string }>);


interface SalesChartProps {
    data: SapSalesEntry[];
    selectedYear: string;
}

export function SalesChart({ data, selectedYear }: SalesChartProps) {
  const [selectedProduct, setSelectedProduct] = useState<'All' | string>('All');
  
  const chartData = useMemo(() => {
    const monthlyTotals = data
        .reduce((acc, row) => {
            const month = row.month;
            if (!acc[month]) {
                acc[month] = { month };
            }
            acc[month][row.product] = row.sales_mt;
            return acc;
        }, {} as Record<string, any>);

    return Object.values(monthlyTotals);
  }, [data]);

  const valueFormatter = (value: number) => {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' MT';
  };

  const currentProducts = productNames;
  
  const chartKeys = selectedProduct === 'All' 
    ? currentProducts
    : [selectedProduct];


  return (
    <Card className="col-span-12">
      <CardHeader className="flex-row justify-between items-center">
        <div>
          <CardTitle>Monthly Sales Volume by Product - {selectedYear}</CardTitle>
          <CardDescription>Sales volume (MT) per product, stacked.</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Select 
            onValueChange={(value) => setSelectedProduct(value)} 
            defaultValue="All"
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Products (Stacked)</SelectItem>
              <Separator />
              {currentProducts.map(product => (
                <SelectItem key={product} value={product}>
                  {product}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis 
              tickFormatter={(value) => formatMT(value)} 
              axisLine={false} 
              tickLine={false} 
              tickMargin={10} 
            />
            <ChartTooltip 
              cursor={false} 
              content={<ChartTooltipContent valueFormatter={valueFormatter} />} 
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            
            {chartKeys.map((key) => {
                const config = chartConfig[key as keyof typeof chartConfig];
                return (
                    <Bar
                        key={key}
                        dataKey={key as keyof SapSalesEntry}
                        stackId="a"
                        fill={config.color.replace('hsl(var(', 'var(').replace('))', '')}
                        radius={[4, 4, 0, 0]}
                    />
                );
            })}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}