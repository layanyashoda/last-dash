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

export function OverviewCards({ 
  currentYearData, 
  selectedYear, 
  comparisonYear, 
  comparisonYearData 
}: OverviewCardsProps) {
  
  const totalSales = currentYearData.reduce((sum, d) => sum + d.sales_mt, 0);
  const autoDieselTotal = currentYearData.filter(d => d.product === 'Lanka Auto Diesel').reduce((sum, d) => sum + d.sales_mt, 0);
  const monthsWithData = new Set(currentYearData.map(d => d.month)).size;
  
  let YoYChange = 0;
  if (comparisonYear && comparisonYearData) {
    const comparisonTotal = comparisonYearData.reduce((sum, d) => sum + d.sales_mt, 0);
    if (comparisonTotal > 0) YoYChange = (totalSales - comparisonTotal) / comparisonTotal * 100;
  }

  const ChangeIcon = YoYChange >= 0 ? ArrowUp : ArrowDown;
  // Renamed to DisplayedIcon (PascalCase) to fix the casing error
  const DisplayedIcon = comparisonYear ? ChangeIcon : TrendingUp;
  const changeColor = YoYChange >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales ({selectedYear})</CardTitle>
          <Fuel className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMT(totalSales)}</div>
          <p className="text-xs text-muted-foreground">Volume for {monthsWithData} months</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{comparisonYear ? 'YoY Change' : 'Auto Diesel Share'}</CardTitle>
          <DisplayedIcon className={`h-4 w-4 ${comparisonYear ? changeColor : 'text-muted-foreground'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${comparisonYear ? changeColor : 'text-primary'}`}>
            {comparisonYear ? `${Math.abs(YoYChange).toFixed(1)}%` : `${((autoDieselTotal/totalSales)*100).toFixed(1)}%`}
          </div>
          <p className="text-xs text-muted-foreground">{comparisonYear ? `Compared to ${comparisonYear}` : 'Lanka Auto Diesel contribution'}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Auto Diesel Total</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMT(autoDieselTotal)}</div>
          <p className="text-xs text-muted-foreground">MT for the period</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Monthly Sale</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monthsWithData > 0 ? formatMT(totalSales / monthsWithData) : '0 MT'}</div>
          <p className="text-xs text-muted-foreground">Average across period</p>
        </CardContent>
      </Card>
    </div>
  );
}