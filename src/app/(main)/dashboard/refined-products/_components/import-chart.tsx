"use client";

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { RefinedProductImport } from './data';

interface ImportChartProps {
  data: RefinedProductImport[];          // Current Year
  comparisonData?: RefinedProductImport[]; // Comparison Year (Optional)
  selectedYear: string;
  comparisonYear?: string;
}

export function ImportChart({ data, comparisonData, selectedYear, comparisonYear }: ImportChartProps) {
  
  // Merge current and comparison data for the chart
  const chartData = useMemo(() => {
    return data.map(item => {
      const compareItem = comparisonData?.find(c => c.month === item.month);
      return {
        month: item.month,
        [selectedYear]: item.total,
        ...(comparisonYear && compareItem ? { [comparisonYear]: compareItem.total } : {}),
      };
    });
  }, [data, comparisonData, selectedYear, comparisonYear]);

  const chartConfig = {
    [selectedYear]: { label: `${selectedYear} Total`, color: "hsl(var(--chart-1))" },
    ...(comparisonYear ? { [comparisonYear]: { label: `${comparisonYear} Total`, color: "hsl(var(--chart-2))" } } : {}),
  };

  return (
    <Card className="col-span-12">
      <CardHeader>
        <CardTitle>Import Volume Comparison</CardTitle>
        <CardDescription>
          {comparisonYear 
            ? `Comparing Total Import Volume (MT) between ${selectedYear} and ${comparisonYear}`
            : `Total Import Volume (MT) for ${selectedYear}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickFormatter={(value) => `${value / 1000}k`} axisLine={false} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar 
              dataKey={selectedYear} 
              fill="var(--color-2025)" // This uses the dynamic key from config
              name={selectedYear}
              radius={[4, 4, 0, 0]} 
              fillOpacity={1}
              fill={`hsl(var(--chart-1))`}
            />
            {comparisonYear && (
              <Bar 
                dataKey={comparisonYear} 
                name={comparisonYear}
                radius={[4, 4, 0, 0]} 
                fill={`hsl(var(--muted-foreground))`}
                fillOpacity={0.4}
              />
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}