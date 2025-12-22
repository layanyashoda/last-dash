import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Plane, Fuel, LineChart, TrendingUp } from 'lucide-react'; 
import { JetA1SalesData } from './data';

interface OverviewCardsProps {
  currentYearData: JetA1SalesData[];
  selectedYear: string;
  comparisonYear: string | '';
  comparisonYearData: JetA1SalesData[] | undefined;
}

const formatLiters = (value: number) => {
    const units = [' Liters', 'k Liters', 'M Liters'];
    let i = 0;
    let num = value;
    while (num >= 1000 && i < units.length - 1) {
        num /= 1000;
        i++;
    }
    return `${num.toFixed(1)}${units[i]}`;
};

export function OverviewCards({ 
  currentYearData, 
  selectedYear, 
  comparisonYear, 
  comparisonYearData 
}: OverviewCardsProps) {
  
  const currentTotal = currentYearData.find(d => d.month === 'Total')?.sale_liters || 0;
  const srilankanTotal = currentYearData
    .filter(d => d.airline === 'SRI LANKAN AIRLINES' && d.month !== 'Total')
    .reduce((sum, d) => sum + d.sale_liters, 0);

  const monthsWithData = currentYearData.filter(d => d.month !== 'Total').map(d => d.month).filter((v, i, a) => a.indexOf(v) === i).length;

  let YoYChange = 0;
  if (comparisonYear && comparisonYearData) {
    const comparisonTotal = comparisonYearData.find(d => d.month === 'Total')?.sale_liters || 0;
    if (comparisonTotal > 0) YoYChange = (currentTotal - comparisonTotal) / comparisonTotal * 100;
  }

  const ChangeIcon = YoYChange >= 0 ? ArrowUp : ArrowDown;
  const DisplayedIcon = comparisonYear ? ChangeIcon : TrendingUp;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales ({selectedYear})</CardTitle>
          <Fuel className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatLiters(currentTotal)}</div>
          <p className="text-xs text-muted-foreground">Aggregated across {monthsWithData} months</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{comparisonYear ? 'YoY Change' : 'SriLankan Share'}</CardTitle>
          <DisplayedIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {comparisonYear ? `${Math.abs(YoYChange).toFixed(1)}%` : `${((srilankanTotal/currentTotal)*100).toFixed(1)}%`}
          </div>
          <p className="text-xs text-muted-foreground">Contribution to total volume</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Airline Volume</CardTitle>
          <Plane className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatLiters(srilankanTotal)}</div>
          <p className="text-xs text-muted-foreground">SriLankan Airlines Total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Monthly Sales</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monthsWithData > 0 ? formatLiters(currentTotal / monthsWithData) : '0 Liters'}</div>
          <p className="text-xs text-muted-foreground">Average per month</p>
        </CardContent>
      </Card>
    </div>
  );
}