"use client";

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LandedCost } from './data';

interface CostChartProps {
  data: LandedCost[];
  comparisonData?: LandedCost[];
  selectedYear: string;
  comparisonYear?: string;
}

export function CostChart({ data, comparisonData, selectedYear, comparisonYear }: CostChartProps) {
  
  const chartData = useMemo(() => {
    // We aggregate by month for the chart. 
    // Usually showing the average landed cost across all products per month.
    const months = [...new Set(data.map(d => d.month))];
    
    return months.map(month => {
      const monthItems = data.filter(d => d.month === month);
      const avgCurrent = monthItems.reduce((acc, curr) => acc + curr['Landing Cost (Rs/MT)'], 0) / (monthItems.length || 1);
      
      let avgCompare = 0;
      if (comparisonData) {
        const compareItems = comparisonData.filter(d => d.month === month);
        avgCompare = compareItems.reduce((acc, curr) => acc + curr['Landing Cost (Rs/MT)'], 0) / (compareItems.length || 1);
      }

      return {
        month,
        [selectedYear]: avgCurrent,
        ...(comparisonYear ? { [comparisonYear]: avgCompare } : {}),
      };
    });
  }, [data, comparisonData, selectedYear, comparisonYear]);

  const chartConfig = {
    [selectedYear]: { label: `${selectedYear} Cost`, color: "hsl(var(--chart-1))" },
    ...(comparisonYear ? { [comparisonYear]: { label: `${comparisonYear} Cost`, color: "hsl(var(--chart-2))" } } : {}),
  };

  return (
    <Card className="col-span-12">
      <CardHeader>
        <CardTitle>Landed Cost Trend {comparisonYear && 'Comparison'}</CardTitle>
        <CardDescription>
          Average Landed Cost (Rs/MT) across all products.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey={selectedYear} fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            {comparisonYear && (
              <Bar dataKey={comparisonYear} fill="hsl(var(--muted-foreground))" fillOpacity={0.5} radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}