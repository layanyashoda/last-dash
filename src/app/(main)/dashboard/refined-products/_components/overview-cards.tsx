import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Fuel, Plane, TrendingUp, LineChart } from 'lucide-react'; 
import { RefinedProductImport } from './data';

interface OverviewCardsProps {
  currentYearData: RefinedProductImport[];
  selectedYear: string;
  comparisonYear: string | '';
  comparisonYearData: RefinedProductImport[] | undefined;
}

const formatMT = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' MT';
const formatPercent = (value: number) => value.toFixed(2) + '%';

export function OverviewCards({ 
  currentYearData, 
  selectedYear, 
  comparisonYear, 
  comparisonYearData 
}: OverviewCardsProps) {
  
  const currentTotal = currentYearData.find(d => d.month === 'Total')?.total || 0;
  const jetA1Total = currentYearData.find(d => d.month === 'Total')?.['Jet A-1'] || 0;
  const monthsWithData = currentYearData.filter(d => d.month !== 'Total' && d.total > 0).length;

  let YoYChange = 0;
  let comparisonText = '';
  
  if (comparisonYear && comparisonYearData) {
    const comparisonTotal = comparisonYearData.find(d => d.month === 'Total')?.total || 0;
    if (comparisonTotal > 0) {
      YoYChange = (currentTotal - comparisonTotal) / comparisonTotal * 100;
      comparisonText = `vs ${comparisonYear} Total Imports`;
    }
  } else {
    comparisonText = `Total imports for ${selectedYear}`;
  }

  const ChangeIcon = YoYChange >= 0 ? ArrowUp : ArrowDown;
  const changeColor = YoYChange !== 0 ? (YoYChange >= 0 ? 'text-green-500' : 'text-red-500') : 'text-muted-foreground';
  
  // FIX: Icon casing to prevent ReferenceError
  const DisplayedIcon = comparisonYear ? ChangeIcon : TrendingUp;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Imports ({selectedYear})</CardTitle>
          <Fuel className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMT(currentTotal)}</div>
          <p className="text-xs text-muted-foreground">{comparisonText}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{comparisonYear ? 'YoY Change' : 'Jet A-1 Share'}</CardTitle>
          <DisplayedIcon className={`h-4 w-4 ${comparisonYear ? changeColor : 'text-muted-foreground'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${comparisonYear ? changeColor : 'text-primary'}`}>
            {comparisonYear ? formatPercent(Math.abs(YoYChange)) : formatPercent((jetA1Total / currentTotal) * 100)}
          </div>
          <p className="text-xs text-muted-foreground">{comparisonYear ? comparisonText : 'Share of total imports'}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jet A-1 Volume</CardTitle>
          <Plane className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMT(jetA1Total)}</div>
          <p className="text-xs text-muted-foreground">MT for the selected period</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Monthly Import</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monthsWithData > 0 ? formatMT(currentTotal / monthsWithData) : '0 MT'}</div>
          <p className="text-xs text-muted-foreground">Based on {monthsWithData} months</p>
        </CardContent>
      </Card>
    </div>
  );
}