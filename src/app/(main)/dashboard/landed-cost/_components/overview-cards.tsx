// src/app/(main)/dashboard/landed-cost/_components/overview-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, PiggyBank, Receipt, Gauge, TrendingUp } from 'lucide-react'; 
import { LandedCost } from './data';

interface OverviewCardsProps {
  currentYearData: LandedCost[];
  selectedYear: string;
  comparisonYear: string | '';
  comparisonYearData: LandedCost[] | undefined;
}

const formatRs = (value: number) => `Rs ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
const formatPercent = (value: number) => value.toFixed(2) + '%';

// Helper to calculate the average price for a single product across available months
const getAvgLandedCost = (data: LandedCost[], product: string): number => {
    const productData = data.filter(d => d.product === product);
    if (productData.length === 0) return 0;
    
    const sum = productData.reduce((acc, d) => acc + d['Landing Cost (Rs/MT)'], 0);
    return sum / productData.length;
};

// Helper to calculate the average duties/tax share for a single product
const getAvgDutyShare = (data: LandedCost[], product: string): number => {
    const productData = data.filter(d => d.product === product);
    if (productData.length === 0) return 0;

    const totalLandedCost = productData.reduce((acc, d) => acc + d['Landing Cost (Rs/MT)'], 0);
    const totalDuties = productData.reduce((acc, d) => acc + d['Duties & Taxes (Rs/MT)'], 0);

    return totalLandedCost > 0 ? (totalDuties / totalLandedCost) * 100 : 0;
};


export function OverviewCards({ 
  currentYearData, 
  selectedYear, 
  comparisonYear, 
  comparisonYearData 
}: OverviewCardsProps) {
  
  const targetProduct = 'Petrol 92 RON';
  
  const currentAvgLandedCost = getAvgLandedCost(currentYearData, targetProduct);
  const currentAvgDutyShare = getAvgDutyShare(currentYearData, targetProduct);

  const monthsWithData = currentYearData.map(d => d.month).filter((v, i, a) => a.indexOf(v) === i).length;
  
  let YoYChange = 0;
  let comparisonText = '';
  
  if (comparisonYear && comparisonYearData) {
    const comparisonAvgLandedCost = getAvgLandedCost(comparisonYearData, targetProduct);
    if (comparisonAvgLandedCost > 0) {
      YoYChange = (currentAvgLandedCost - comparisonAvgLandedCost) / comparisonAvgLandedCost * 100;
      comparisonText = `vs ${comparisonYear} Avg Landed Cost`;
    }
  } else {
    // Current year: Difference between CIF and Landed Cost (Avg. total overhead)
    const currentAvgCIF = currentYearData.filter(d => d.product === targetProduct).reduce((acc, d) => acc + d['CIF (Rs/MT)'], 0) / monthsWithData;
    const overhead = currentAvgLandedCost - currentAvgCIF;
    
    if (currentAvgLandedCost > 0) {
        YoYChange = (overhead / currentAvgLandedCost) * 100; // Display overhead share
        comparisonText = `Avg. non-CIF share of cost.`;
    }
  }

  const ChangeIcon = YoYChange >= 0 ? ArrowUp : ArrowDown;
  const changeColor = YoYChange !== 0 ? (YoYChange >= 0 ? 'text-red-500' : 'text-green-500') : 'text-muted-foreground'; // Higher cost is "bad" (red)
  const changeValue = YoYChange !== 0 ? formatPercent(Math.abs(YoYChange)) : 'N/A';
  
  const averageMonthlyLandedCost = currentYearData.length > 0 ? currentYearData.reduce((sum, d) => sum + d['Landing Cost (Rs/MT)'], 0) / (currentYearData.length / monthsWithData) : 0;
  

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg. Landed Cost ({targetProduct})
          </CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatRs(currentAvgLandedCost)}</div>
          <p className="text-xs text-muted-foreground">
            Per Metric Ton (MT) for {selectedYear}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {comparisonYear ? 'YoY Cost Change' : 'Avg. Cost Overhead'}
          </CardTitle>
          <ChangeIcon className={`h-4 w-4 ${changeColor}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${changeColor}`}>
            {changeValue}
          </div>
          <p className="text-xs text-muted-foreground">
            {comparisonText}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg. Duties & Tax Share
          </CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPercent(currentAvgDutyShare)}</div>
          <p className="text-xs text-muted-foreground">
            Of total Landed Cost for {targetProduct}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Product Cost
          </CardTitle>
          <Gauge className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatRs(averageMonthlyLandedCost)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total average monthly landed cost across all products.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}