// src/app/(main)/dashboard/platts/_components/overview-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, DollarSign, TrendingUp, LineChart } from 'lucide-react'; 
import { PlattsPrice } from './data';

interface OverviewCardsProps {
  currentYearData: PlattsPrice[];
  selectedYear: string;
  comparisonYear: string | '';
  comparisonYearData: PlattsPrice[] | undefined;
}

const formatUSD = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatPercent = (value: number) => value.toFixed(2) + '%';

export function OverviewCards({ 
  currentYearData, 
  selectedYear, 
  comparisonYear, 
  comparisonYearData 
}: OverviewCardsProps) {
  
  const currentJetKeroPrices = currentYearData.map(d => d['Jet Kero (USD/BBL)']).filter(p => p > 0);
  const comparisonJetKeroPrices = comparisonYearData?.map(d => d['Jet Kero (USD/BBL)']).filter(p => p > 0);

  const currentAvgJetKero = currentJetKeroPrices.length > 0 
    ? currentJetKeroPrices.reduce((sum, p) => sum + p, 0) / currentJetKeroPrices.length 
    : 0;

  const firstMonthPrice = currentJetKeroPrices[0] || 0;
  const lastMonthPrice = currentJetKeroPrices[currentJetKeroPrices.length - 1] || 0;

  let YoYChange = 0;
  let priceChange = 0;
  let comparisonText = '';
  
  if (comparisonYear && comparisonJetKeroPrices && comparisonJetKeroPrices.length > 0) {
    const comparisonAvgJetKero = comparisonJetKeroPrices.reduce((sum, p) => sum + p, 0) / comparisonJetKeroPrices.length;
    if (comparisonAvgJetKero > 0) {
      YoYChange = (currentAvgJetKero - comparisonAvgJetKero) / comparisonAvgJetKero * 100;
      comparisonText = `vs ${comparisonYear} Avg Jet Kero Price`;
    }
  } else {
    // Current year volatility (first month vs last month)
    priceChange = firstMonthPrice > 0 ? (lastMonthPrice - firstMonthPrice) / firstMonthPrice * 100 : 0;
    comparisonText = `Volatility since first month (${currentYearData[0]?.month})`;
  }


  const ChangeIcon = YoYChange >= 0 ? ArrowUp : ArrowDown;
  const changeColor = YoYChange !== 0 ? (YoYChange >= 0 ? 'text-green-500' : 'text-red-500') : 'text-muted-foreground';
  
  const volatilityIcon = priceChange >= 0 ? ArrowUp : ArrowDown;
  const volatilityColor = priceChange !== 0 ? (priceChange >= 0 ? 'text-green-500' : 'text-red-500') : 'text-muted-foreground';

  const displayedChange = comparisonYear ? formatPercent(YoYChange) : formatPercent(priceChange);
  
  // FIX 1: Rename to PascalCase
  const DisplayedIcon = comparisonYear ? ChangeIcon : volatilityIcon; 
  const displayedColor = comparisonYear ? changeColor : volatilityColor;


  // Calculate Max Price Volatility for Jet Kero
  const maxPrice = Math.max(...currentJetKeroPrices, 0);
  const minPrice = Math.min(...currentJetKeroPrices, Infinity);
  const range = maxPrice - minPrice;


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Jet Kero Price ({selectedYear})
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatUSD(currentAvgJetKero)}</div>
          <p className="text-xs text-muted-foreground">
            Per Barrel (Avg. of {currentJetKeroPrices.length} months)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {comparisonYear ? 'Avg. Price YoY Change' : 'Monthly Volatility'}
          </CardTitle>
          {/* FIX 2: Use the PascalCase variable name */}
          <DisplayedIcon className={`h-4 w-4 ${displayedColor}`} /> 
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${displayedColor}`}>
            {displayedChange}
          </div>
          <p className="text-xs text-muted-foreground">
            {comparisonText}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Jet Kero Price Range
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatUSD(range)}</div>
          <p className="text-xs text-muted-foreground">
            {formatUSD(minPrice)} to {formatUSD(maxPrice)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Current Jet Kero Price
          </CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatUSD(lastMonthPrice)}
          </div>
          <p className="text-xs text-muted-foreground">
            Price for the latest month ({currentYearData[currentYearData.length - 1]?.month})
          </p>
        </CardContent>
      </Card>
    </div>
  );
}