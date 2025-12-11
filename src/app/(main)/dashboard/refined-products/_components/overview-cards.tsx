// src/app/(main)/dashboard/refined-products/_components/overview-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Plane, Fuel, LineChart } from 'lucide-react'; 
import { RefinedProductImport } from './data'; // Only import the type

interface OverviewCardsProps {
  currentYearData: RefinedProductImport[];
  selectedYear: string;
  comparisonYear: string | '';
  comparisonYearData: RefinedProductImport[] | undefined;
}

// Function to find the total row data for a given array
const getTotalData = (data: RefinedProductImport[]): RefinedProductImport | undefined => {
  return data.find(d => d.month === 'Total');
};

// Function to calculate months with data
const getMonthsWithData = (data: RefinedProductImport[]): number => {
  // Exclude the 'Total' row
  return data.filter(d => d.month !== 'Total' && d.total > 0).length;
};

// Function to format numbers as MT
const formatMT = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' MT';
const formatPercent = (value: number) => value.toFixed(2) + '%';

export function OverviewCards({ 
  currentYearData, 
  selectedYear, 
  comparisonYear, 
  comparisonYearData 
}: OverviewCardsProps) {
  
  const currentTotalData = getTotalData(currentYearData);
  const comparisonTotalData = comparisonYearData ? getTotalData(comparisonYearData) : undefined;
  
  const totalImportsMT = currentTotalData?.total || 0;
  const totalJetA1 = currentTotalData?.['Jet A-1'] || 0;
  const monthsWithData = getMonthsWithData(currentYearData);
  
  let YoYChange = 0;
  let comparisonText = '';
  
  if (comparisonYear && comparisonTotalData) {
    const comparisonImportsMT = comparisonTotalData.total;
    if (comparisonImportsMT > 0) {
      YoYChange = (totalImportsMT - comparisonImportsMT) / comparisonImportsMT * 100;
      comparisonText = `vs ${comparisonYear} Total Imports`;
    }
  } else {
    // Default text if no comparison is selected
    const monthLabels = currentYearData.filter(d => d.month !== 'Total' && d.total > 0).map(d => d.month);
    const startMonth = monthLabels[0];
    const endMonth = monthLabels[monthLabels.length - 1];
    comparisonText = monthsWithData > 0 ? `${startMonth} - ${endMonth} ${selectedYear}` : `No data for ${selectedYear}`;
  }


  const ChangeIcon = YoYChange >= 0 ? ArrowUp : ArrowDown;
  const changeColor = YoYChange !== 0 ? (YoYChange >= 0 ? 'text-green-500' : 'text-red-500') : 'text-muted-foreground';
  const changeValue = YoYChange !== 0 ? formatPercent(YoYChange) : 'N/A';
  

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Imports ({selectedYear})
          </CardTitle>
          <Fuel className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMT(totalImportsMT)}</div>
          <p className="text-xs text-muted-foreground">
            {comparisonText.includes('vs') ? `${selectedYear} Total` : comparisonText}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {comparisonYear ? 'YoY Volume Change' : 'Total Jet A-1 Share'}
          </CardTitle>
          <ChangeIcon className={`h-4 w-4 ${changeColor}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${changeColor}`}>
            {comparisonYear ? changeValue : (totalImportsMT > 0 ? formatPercent((totalJetA1 / totalImportsMT) * 100) : 'N/A')}
          </div>
          <p className="text-xs text-muted-foreground">
            {comparisonYear ? comparisonText : 'of total imported volume.'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Jet A-1 Total Imports
          </CardTitle>
          <Plane className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMT(totalJetA1)}</div>
          <p className="text-xs text-muted-foreground">
            Absolute volume in MT for {selectedYear}.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Monthly Import
          </CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monthsWithData > 0 ? formatMT(totalImportsMT / monthsWithData) : formatMT(0)}
          </div>
          <p className="text-xs text-muted-foreground">
            Based on {monthsWithData} months of recorded data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}