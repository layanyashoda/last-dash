// src/app/(main)/dashboard/jet-a1-sales/_components/sales-chart.tsx
"use client";

import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JetA1SalesData, airlineNames } from './data';
import { Separator } from '@/components/ui/separator';

const formatLiters = (value: number) => {
    const num = value / 1000000;
    return `${num.toFixed(1)} M Liters`;
};

const chartConfig = airlineNames.reduce((acc, name, index) => {
    // Assign Chart-1 to Chart-8 colors cyclically for the airlines
    acc[name] = { label: name, color: `hsl(var(--chart-${(index % 8) + 1}))` };
    return acc;
}, {} as Record<string, { label: string, color: string }>);


interface SalesChartProps {
    data: JetA1SalesData[];
    selectedYear: string;
}

export function SalesChart({ data, selectedYear }: SalesChartProps) {
  const [selectedAirline, setSelectedAirline] = useState<'All' | string>('All');
  
  const chartData = useMemo(() => {
    const monthlyTotals = data
        .filter(d => d.month !== 'Total')
        .reduce((acc, row) => {
            const month = row.month;
            if (!acc[month]) {
                acc[month] = { month };
            }
            acc[month][row.airline] = row.sale_liters;
            return acc;
        }, {} as Record<string, any>);

    return Object.values(monthlyTotals);
  }, [data]);

  const valueFormatter = (value: number) => {
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' Liters';
  };

  const currentAirlines = useMemo(() => {
    return data.map(d => d.airline).filter((v, i, a) => v !== 'ALL' && v !== 'Total' && a.indexOf(v) === i);
  }, [data]);


  return (
    <Card className="col-span-12 lg:col-span-8">
      <CardHeader className="flex-row justify-between items-center">
        <div>
          <CardTitle>Monthly Sales Volume (Liters) - {selectedYear}</CardTitle>
          <CardDescription>Sales volume per month, filtered by airline.</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Select 
            onValueChange={(value) => setSelectedAirline(value)} 
            defaultValue="All"
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Airline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Airlines (Stacked)</SelectItem>
              <Separator />
              {currentAirlines.map(airline => (
                <SelectItem key={airline} value={airline}>
                  {airline}
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
              tickFormatter={(value) => formatLiters(value)} 
              axisLine={false} 
              tickLine={false} 
              tickMargin={10} 
            />
            <ChartTooltip 
              cursor={false} 
              content={<ChartTooltipContent valueFormatter={valueFormatter} />} 
            />
            <Legend />
            
            {selectedAirline === 'All' ? (
                currentAirlines.map((airline) => (
                    <Bar
                        key={airline}
                        dataKey={airline}
                        stackId="a"
                        fill={chartConfig[airline].color.replace('hsl(var(', 'var(').replace('))', '')}
                        radius={[4, 4, 0, 0]}
                    />
                ))
            ) : (
                <Bar 
                    dataKey={selectedAirline} 
                    fill={chartConfig[selectedAirline].color.replace('hsl(var(', 'var(').replace('))', '')} 
                    radius={[4, 4, 0, 0]}
                />
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}