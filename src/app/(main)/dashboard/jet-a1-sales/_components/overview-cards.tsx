// src/app/(main)/dashboard/jet-a1-sales/_components/overview-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Plane, Fuel, LineChart } from 'lucide-react'; 
import { JetA1SalesData } from './data';

interface OverviewCardsProps {
  currentYearData: JetA1SalesData[];
  selectedYear: string;
  comparisonYear: string | '';
  comparisonYearData: JetA1SalesData[] | undefined;
}

const formatLiters = (value: number) => {
    const units = [' Liters', 'k Liters', 'M Liters', 'B Liters'];
    let i = 0;
    let num = value;
    // Scale number down for display (e.g., 50,000,000 -> 50 M Liters)
    while (num >= 1000 && i < units.length - 1) {
        num /= 1000;
        i++;
    }
    return `${num.toFixed(1)}${units[i]}`;
};

const formatPercent = (value: number) => value.toFixed(2) + '%';

export function OverviewCards({ 
  currentYearData, 
  selectedYear, 
  comparisonYear, 
  comparisonYearData 
}: OverviewCardsProps) {
  
  const currentTotal = currentYearData.find(d => d.month === 'Total')?.sale_liters || 0;
  
  // Calculate months with data based on the presence of monthly total rows (ignoring airline breakdown for month count)
  const monthlySaleRows = currentYearData.filter(d => d.airline === 'ALL' && d.month !== 'Total');
  const monthsWithData = monthlySaleRows.length || (currentYearData.filter(d => d.month !== 'Total').map(d => d.month).filter((v, i, a) => a.indexOf(v) === i).length);

  const srilankanTotal = currentYearData
    .filter(d => d.airline === 'SRI LANKAN AIRLINES' && d.month !== 'Total')
    .reduce((sum, d) => sum + d.sale_liters, 0);

  let YoYChange = 0;
  let comparisonText = '';
  
  if (comparisonYear && comparisonYearData) {
    const comparisonTotal = comparisonYearData.find(d => d.month === 'Total')?.sale_liters || 0;
    if (comparisonTotal > 0) {
      YoYChange = (currentTotal - comparisonTotal) / comparisonTotal * 100;
      comparisonText = `vs ${comparisonYear} Total Sales`;
    }
  } else {
    comparisonText = monthsWithData > 0 ? `Total sales across ${monthsWithData} months.` : `No data for ${selectedYear}`;
  }


  const ChangeIcon = YoYChange >= 0 ? ArrowUp : ArrowDown;
  const changeColor = YoYChange !== 0 ? (YoYChange >= 0 ? 'text-green-500' : 'text-red-500') : 'text-muted-foreground';
  const changeValue = YoYChange !== 0 ? formatPercent(YoYChange) : 'N/A';
  

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Sales ({selectedYear})
          </CardTitle>
          <Fuel className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatLiters(currentTotal)}</div>
          <p className="text-xs text-muted-foreground">
            {comparisonText.includes('vs') ? `${selectedYear} Total` : comparisonText}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {comparisonYear ? 'YoY Volume Change' : 'SRI LANKAN AIRLINES Share'}
          </CardTitle>
          <ChangeIcon className={`h-4 w-4 ${changeColor}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${changeColor}`}>
            {comparisonYear ? changeValue : (currentTotal > 0 ? formatPercent((srilankanTotal / currentTotal) * 100) : 'N/A')}
          </div>
          <p className="text-xs text-muted-foreground">
            {comparisonYear ? comparisonText : 'of total sales volume.'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Top Airline Volume (SRI LANKAN)
          </CardTitle>
          <Plane className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatLiters(srilankanTotal)}</div>
          <p className="text-xs text-muted-foreground">
            Absolute volume in Liters for {selectedYear}.
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
            {monthsWithData > 0 ? formatLiters(currentTotal / monthsWithData) : formatLiters(0)}
          </div>
          <p className="text-xs text-muted-foreground">
            Based on {monthsWithData} months of recorded data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}