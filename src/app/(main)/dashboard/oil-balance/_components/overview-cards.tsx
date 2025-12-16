// src/app/(main)/dashboard/oil-balance/_components/overview-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Factory, Truck, TrendingUp, MinusCircle } from 'lucide-react'; 
import { OilBalanceEntry } from './data';

interface OverviewCardsProps {
  currentYearData: OilBalanceEntry[];
  selectedYear: string;
  comparisonYear: string | '';
  comparisonYearData: OilBalanceEntry[] | undefined;
}

const formatMT = (value: number) => {
    const num = value / 1000;
    return `${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}k MT`;
};
const formatPercent = (value: number) => value.toFixed(2) + '%';

// Helper to calculate the sum for a specific key
const getTotal = (data: OilBalanceEntry[], key: keyof OilBalanceEntry): number => {
    return data.reduce((sum, d) => sum + d[key], 0);
};


export function OverviewCards({ 
  currentYearData, 
  selectedYear, 
  comparisonYear, 
  comparisonYearData 
}: OverviewCardsProps) {
  
  const totalSales = getTotal(currentYearData, 'Total Sales (MT)');
  const totalProduction = getTotal(currentYearData, 'Refinery Production (MT)');
  const totalLoss = getTotal(currentYearData, 'Total Own Use & Loss (MT)');
  const totalImports = getTotal(currentYearData, 'Refined Product Imports (MT)');
  const totalCrudeInput = getTotal(currentYearData, 'Crude Oil Input (MT)');
  const monthsWithData = currentYearData.length;
  
  // Sales Mix: How much of total sales came from local production
  const productionShare = totalSales > 0 ? (totalProduction / totalSales) * 100 : 0;
  
  let YoYChange = 0;
  let comparisonText = '';
  
  if (comparisonYear && comparisonYearData) {
    const comparisonTotalSales = getTotal(comparisonYearData, 'Total Sales (MT)');
    if (comparisonTotalSales > 0) {
      YoYChange = (totalSales - comparisonTotalSales) / comparisonTotalSales * 100;
      comparisonText = `vs ${comparisonYear} Total Sales`;
    }
  } else {
    // Default: Sales vs. Imports
    const importsShare = totalSales > 0 ? (totalImports / totalSales) * 100 : 0;
    YoYChange = importsShare; // Use imports share as the default metric
    comparisonText = `Imports share of Total Sales`;
  }

  const ChangeIcon = YoYChange >= 0 ? ArrowUp : ArrowDown;
  const changeColor = YoYChange !== 0 ? (YoYChange >= 0 ? 'text-green-500' : 'text-red-500') : 'text-muted-foreground';
  const changeValue = formatPercent(Math.abs(YoYChange));
  

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Sales ({selectedYear})
          </CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMT(totalSales)}</div>
          <p className="text-xs text-muted-foreground">
            Total volume sold across {monthsWithData} months.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {comparisonYear ? 'YoY Sales Volume Change' : 'Production Share of Sales'}
          </CardTitle>
          {comparisonYear ? <ChangeIcon className={`h-4 w-4 ${changeColor}`} /> : <Factory className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${comparisonYear ? changeColor : 'text-primary'}`}>
            {comparisonYear ? changeValue : formatPercent(productionShare)}
          </div>
          <p className="text-xs text-muted-foreground">
            {comparisonYear ? comparisonText : 'From local refinery production.'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Refinery Input
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMT(totalCrudeInput)}</div>
          <p className="text-xs text-muted-foreground">
            Total Crude Oil Input (MT).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Own Use & Loss
          </CardTitle>
          <MinusCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatMT(totalLoss)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total volume lost or used internally (MT).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}