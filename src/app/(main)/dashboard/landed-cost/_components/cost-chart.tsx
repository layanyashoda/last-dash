// src/app/(main)/dashboard/landed-cost/_components/cost-chart.tsx
"use client";

import { useMemo, useState } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LandedCost, productNames } from './data';
import { Separator } from '@/components/ui/separator';

const formatRs = (value: number) => {
    const num = value / 1000;
    return `${num.toFixed(0)}k Rs/MT`;
};

const chartConfig = productNames.reduce((acc, name, index) => {
    // Assign colors cyclically for the products
    acc[name] = { label: name, color: `hsl(var(--chart-${(index % 6) + 1}))` };
    return acc;
}, {} as Record<string, { label: string, color: string }>);


interface CostChartProps {
    data: LandedCost[];
    selectedYear: string;
}

export function CostChart({ data, selectedYear }: CostChartProps) {
  const [selectedProduct, setSelectedProduct] = useState<'All' | string>('All');
  
  const chartData = useMemo(() => {
    const monthlyData = data
        .reduce((acc, row) => {
            if (!acc[row.month]) {
                acc[row.month] = { month: row.month };
            }
            acc[row.month][row.product] = row['Landing Cost (Rs/MT)'];
            return acc;
        }, {} as Record<string, any>);

    return Object.values(monthlyData);
  }, [data]);

  const valueFormatter = (value: number) => {
    return `Rs ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };
  
  const chartKeys = selectedProduct === 'All' 
    ? productNames
    : [selectedProduct];

  return (
    <Card className="col-span-12 lg:col-span-8">
      <CardHeader className="flex-row justify-between items-center">
        <div>
          <CardTitle>Monthly Landed Cost Trend - {selectedYear}</CardTitle>
          <CardDescription>Final Landed Cost (Rs/MT) including all Duties and Taxes.</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Select 
            onValueChange={(value) => setSelectedProduct(value)} 
            defaultValue="All"
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Products</SelectItem>
              <Separator />
              {productNames.map(product => (
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
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis 
              tickFormatter={(value) => formatRs(value)} 
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
                    <Line
                        key={key}
                        type="monotone"
                        dataKey={key as keyof LandedCost}
                        stroke={config.color.replace('hsl(var(', 'var(').replace('))', '')}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                );
            })}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}