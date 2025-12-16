// src/app/(main)/dashboard/sap-sales/_components/overview-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Fuel, Truck, TrendingUp, LineChart } from 'lucide-react'; 
import { SapSalesEntry } from './data';

interface OverviewCardsProps {
  currentYearData: SapSalesEntry[];
  selectedYear: string;
  comparisonYear: string | '';
  comparisonYearData: SapSalesEntry[] | undefined;
}

const formatMT = (value: number) => {
    const num = value / 1000;
    return `${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}k MT`;
};
const formatPercent = (value: number) => value.toFixed(2) + '%';

// Helper to calculate the sum of sales
const getTotalSales = (data: SapSalesEntry[]): number => {
    return data.reduce((sum, d) => sum + d.sales_mt, 0);
};

// Helper to get total sales for a specific product
const getProductTotal = (data: SapSalesEntry[], product: string): number => {
    return data.filter(d => d.product === product).reduce((sum, d) => sum + d.sales_mt, 0);
};


export function OverviewCards({ 
  currentYearData, 
  selectedYear, 
  comparisonYear, 
  comparisonYearData 
}: OverviewCardsProps) {
  
  const totalSales = getTotalSales(currentYearData);
  const autoDieselTotal = getProductTotal(currentYearData, 'Lanka Auto Diesel');
  const monthsWithData = currentYearData.map(d => d.month).filter((v, i, a) => a.indexOf(v) === i).length;
  
  // Diesel Share
  const dieselShare = totalSales > 0 ? (autoDieselTotal / totalSales) * 100 : 0;
  
  let YoYChange = 0;
  let comparisonText = '';
  
  if (comparisonYear && comparisonYearData) {
    const comparisonTotalSales = getTotalSales(comparisonYearData);
    if (comparisonTotalSales > 0) {
      YoYChange = (totalSales - comparisonTotalSales) / comparisonTotalSales * 100;
      comparisonText = `vs ${comparisonYear} Total Sales`;
    }
  } else {
    // Default: Diesel Share
    YoYChange = dieselShare; 
    comparisonText = `Lanka Auto Diesel share of total sales.`;
  }

  const ChangeIcon = YoYChange >= 0 ? ArrowUp : ArrowDown;
  const changeColor = YoYChange !== 0 ? (YoYChange >= 0 ? 'text-green-500' : 'text-red-500') : 'text-muted-foreground';
  
  const displayedValue = comparisonYear ? formatPercent(Math.abs(YoYChange)) : formatPercent(dieselShare);
  const displayedIcon = comparisonYear ? ChangeIcon : Truck;
  const displayedColor = comparisonYear ? changeColor : 'text-primary';
  

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Sales Volume ({selectedYear})
          </CardTitle>
          <Fuel className="h-4 w-4 text-muted-foreground" />
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
            {comparisonYear ? 'YoY Sales Volume Change' : 'Auto Diesel Share'}
          </CardTitle>
          <displayedIcon className={`h-4 w-4 ${displayedColor}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${displayedColor}`}>
            {displayedValue}
          </div>
          <p className="text-xs text-muted-foreground">
            {comparisonText}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Lanka Auto Diesel Sales
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMT(autoDieselTotal)}</div>
          <p className="text-xs text-muted-foreground">
            Largest single product sales (MT).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Monthly Sales
          </CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monthsWithData > 0 ? formatMT(totalSales / monthsWithData) : formatMT(0)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total sales volume, averaged by month.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}