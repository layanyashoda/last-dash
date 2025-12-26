import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Zap, Factory, TrendingUp, LineChart } from 'lucide-react'; 
import { PowerPlantSalesEntry } from './data';

interface OverviewCardsProps {
  currentYearData: PowerPlantSalesEntry[];
  selectedYear: string;
  comparisonYear: string | '';
  comparisonYearData: PowerPlantSalesEntry[] | undefined;
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
  
  const totalSales = currentYearData.find(d => d.month === 'Total')?.sales_mt || 0;
  const topPlantSales = currentYearData
    .filter(d => d.plant === 'Kelanitissa CCGT' && d.month !== 'Total')
    .reduce((sum, d) => sum + d.sales_mt, 0);
  
  const monthsWithData = new Set(currentYearData.filter(d => d.month !== 'Total').map(d => d.month)).size;

  let YoYChange = 0;
  if (comparisonYear && comparisonYearData) {
    const comparisonTotal = comparisonYearData.find(d => d.month === 'Total')?.sales_mt || 0;
    if (comparisonTotal > 0) YoYChange = (totalSales - comparisonTotal) / comparisonTotal * 100;
  }

  const ChangeIcon = YoYChange >= 0 ? ArrowUp : ArrowDown;
  const DisplayedIcon = comparisonYear ? ChangeIcon : TrendingUp;
  const changeColor = YoYChange >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales ({selectedYear})</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMT(totalSales)}</div>
          <p className="text-xs text-muted-foreground">Volume for {monthsWithData} months</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{comparisonYear ? 'YoY Change' : 'Kelanitissa Share'}</CardTitle>
          <DisplayedIcon className={`h-4 w-4 ${comparisonYear ? changeColor : 'text-muted-foreground'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${comparisonYear ? changeColor : 'text-primary'}`}>
            {comparisonYear ? `${Math.abs(YoYChange).toFixed(1)}%` : `${((topPlantSales/totalSales)*100).toFixed(1)}%`}
          </div>
          <p className="text-xs text-muted-foreground">Based on annual volume</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Plant Sales</CardTitle>
          <Factory className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMT(topPlantSales)}</div>
          <p className="text-xs text-muted-foreground">Kelanitissa CCGT Total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Monthly Sale</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monthsWithData > 0 ? formatMT(totalSales / monthsWithData) : '0 MT'}</div>
          <p className="text-xs text-muted-foreground">Average per recorded month</p>
        </CardContent>
      </Card>
    </div>
  );
}