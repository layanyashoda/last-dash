// src/app/(main)/dashboard/power-plant-sales/_components/overview-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Zap, Factory, BarChart, LineChart } from 'lucide-react'; 
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
const formatPercent = (value: number) => value.toFixed(2) + '%';

// Helper to get the annual total sales
const getTotalSales = (data: PowerPlantSalesEntry[]): number => {
    return data.find(d => d.month === 'Total')?.sales_mt || 0;
};

// Helper to get the top plant's sales (mocking Kelanitissa as top)
const getTopPlantSales = (data: PowerPlantSalesEntry[]): { sales: number, share: number } => {
    const totalSales = getTotalSales(data);
    const plantSales = data.filter(d => d.plant === 'Kelanitissa CCGT' && d.month !== 'Total')
                           .reduce((sum, d) => sum + d.sales_mt, 0);
    
    return { 
        sales: plantSales, 
        share: totalSales > 0 ? (plantSales / totalSales) * 100 : 0 
    };
};


export function OverviewCards({ 
  currentYearData, 
  selectedYear, 
  comparisonYear, 
  comparisonYearData 
}: OverviewCardsProps) {
  
  const totalSales = getTotalSales(currentYearData);
  const { sales: topPlantSales, share: topPlantShare } = getTopPlantSales(currentYearData);
  
  const monthlyData = currentYearData.filter(d => d.month !== 'Total' && d.plant === 'Kelanitissa CCGT');
  const monthsWithData = monthlyData.length;

  let YoYChange = 0;
  let comparisonText = '';
  
  if (comparisonYear && comparisonYearData) {
    const comparisonTotalSales = getTotalSales(comparisonYearData);
    if (comparisonTotalSales > 0) {
      YoYChange = (totalSales - comparisonTotalSales) / comparisonTotalSales * 100;
      comparisonText = `vs ${comparisonYear} Total Sales`;
    }
  } else {
    // Default: Total sales volume
    YoYChange = 0;
    comparisonText = `Total sales volume across ${monthsWithData} months.`;
  }

  const ChangeIcon = YoYChange >= 0 ? ArrowUp : ArrowDown;
  const changeColor = YoYChange !== 0 ? (YoYChange >= 0 ? 'text-green-500' : 'text-red-500') : 'text-muted-foreground';
  const changeValue = YoYChange !== 0 ? formatPercent(Math.abs(YoYChange)) : 'N/A';
  

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Sales Volume ({selectedYear})
          </CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMT(totalSales)}</div>
          <p className="text-xs text-muted-foreground">
            {comparisonText}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {comparisonYear ? 'YoY Sales Volume Change' : 'Kelanitissa Share'}
          </CardTitle>
          {comparisonYear ? <ChangeIcon className={`h-4 w-4 ${changeColor}`} /> : <Factory className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${comparisonYear ? changeColor : 'text-primary'}`}>
            {comparisonYear ? changeValue : formatPercent(topPlantShare)}
          </div>
          <p className="text-xs text-muted-foreground">
            {comparisonYear ? comparisonText : 'Share of total sales volume.'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Kelanitissa CCGT Total Sales
          </CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMT(topPlantSales)}</div>
          <p className="text-xs text-muted-foreground">
            Largest single power plant sales (MT).
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
            Sales across all plants, averaged by month.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}