// src/app/(main)/dashboard/platts/_components/price-chart.tsx
"use client";

import { useMemo, useState } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlattsPrice, productNames } from './data';
import { Separator } from '@/components/ui/separator';


const chartConfig = {
    'Gasoline 92 (USD/BBL)': { label: 'Gas 92 ($/BBL)', color: 'hsl(var(--chart-1))' },
    'Gasoline 95 (USD/BBL)': { label: 'Gas 95 ($/BBL)', color: 'hsl(var(--chart-2))' },
    'Jet Kero (USD/BBL)': { label: 'Jet Kero ($/BBL)', color: 'hsl(var(--chart-3))' },
    'Gasoil 0.05% (USD/BBL)': { label: 'Gasoil 0.05% ($/BBL)', color: 'hsl(var(--chart-4))' },
    'FO 380 CST (USD/MT)': { label: 'FO 380 CST ($/MT)', color: 'hsl(var(--chart-5))' },
    'Naphtha (USD/BBL)': { label: 'Naphtha ($/BBL)', color: 'hsl(var(--chart-6))' },
};

interface PriceChartProps {
    data: PlattsPrice[];
    selectedYear: string;
}

export function PriceChart({ data, selectedYear }: PriceChartProps) {
  const [selectedProduct, setSelectedProduct] = useState<'All' | string>('All');
  
  const chartData = useMemo(() => {
    return data.filter(d => d.month);
  }, [data]);

  const valueFormatter = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const chartKeys = selectedProduct === 'All' 
    ? productNames.filter(name => !name.includes('(USD/MT)')) // Exclude MT products if showing All BBL
    : [selectedProduct];

  const chartSubtitle = selectedProduct.includes('(USD/MT)') 
    ? 'Monthly average price in USD per Metric Ton (MT).'
    : 'Monthly average price in USD per Barrel (BBL).';


  return (
    <Card className="col-span-12 lg:col-span-8">
      <CardHeader className="flex-row justify-between items-center">
        <div>
          <CardTitle>Monthly Price Trend - {selectedYear}</CardTitle>
          <CardDescription>{chartSubtitle}</CardDescription>
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
              <SelectItem value="All">All BBL Products</SelectItem>
              <Separator />
              {productNames.map(product => (
                <SelectItem key={product} value={product}>
                  {chartConfig[product as keyof typeof chartConfig].label}
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
              tickFormatter={(value) => `$${Math.round(value)}`} 
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
                        dataKey={key as keyof PlattsPrice}
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