// src/app/(main)/dashboard/jet-a1-sales/_components/data.ts
// Re-using RefinedProductImport type definition is assumed from prior context, 
// but defining JetA1SalesData explicitly here for clarity.

export type JetA1SalesData = {
  month: string;
  airline: string;
  sale_liters: number;
};

// Data extracted and aggregated from the provided CSV files
const rawSales2025: JetA1SalesData[] = [
  // SRI LANKAN AIRLINES
  { month: 'February', airline: 'SRI LANKAN AIRLINES', sale_liters: 22128937 },
  { month: 'March', airline: 'SRI LANKAN AIRLINES', sale_liters: 23529698 },
  { month: 'April', airline: 'SRI LANKAN AIRLINES', sale_liters: 24005613 },
  { month: 'May', airline: 'SRI LANKAN AIRLINES', sale_liters: 22460004 },
  { month: 'June', airline: 'SRI LANKAN AIRLINES', sale_liters: 22096235 },
  { month: 'July', airline: 'SRI LANKAN AIRLINES', sale_liters: 25419503 },
  // EMIRATES AIRLINES
  { month: 'February', airline: 'EMIRATES AIRLINES', sale_liters: 4404240 },
  { month: 'March', airline: 'EMIRATES AIRLINES', sale_liters: 4583300 },
  { month: 'April', airline: 'EMIRATES AIRLINES', sale_liters: 4089650 },
  { month: 'May', airline: 'EMIRATES AIRLINES', sale_liters: 4245280 },
  { month: 'June', airline: 'EMIRATES AIRLINES', sale_liters: 4255160 },
  { month: 'July', airline: 'EMIRATES AIRLINES', sale_liters: 4314160 },
  // QATAR AIRWAYS
  { month: 'February', airline: 'QATAR AIRWAYS', sale_liters: 5084940 },
  { month: 'March', airline: 'QATAR AIRWAYS', sale_liters: 5234370 },
  { month: 'April', airline: 'QATAR AIRWAYS', sale_liters: 3762690 },
  { month: 'May', airline: 'QATAR AIRWAYS', sale_liters: 3407940 },
  { month: 'June', airline: 'QATAR AIRWAYS', sale_liters: 2659490 },
  { month: 'July', airline: 'QATAR AIRWAYS', sale_liters: 4518450 },
  // TURKISH AIRLINES
  { month: 'February', airline: 'TURKISH AIRLINES', sale_liters: 2263140 },
  { month: 'March', airline: 'TURKISH AIRLINES', sale_liters: 2158810 },
  { month: 'April', airline: 'TURKISH AIRLINES', sale_liters: 2074430 },
  { month: 'May', airline: 'TURKISH AIRLINES', sale_liters: 2085190 },
  { month: 'June', airline: 'TURKISH AIRLINES', sale_liters: 1966820 },
  { month: 'July', airline: 'TURKISH AIRLINES', sale_liters: 2143980 },
  // ETIHAD AIRWAYS
  { month: 'February', airline: 'ETIHAD AIRWAYS', sale_liters: 1951710 },
  { month: 'March', airline: 'ETIHAD AIRWAYS', sale_liters: 1946820 },
  { month: 'April', airline: 'ETIHAD AIRWAYS', sale_liters: 1817060 },
  { month: 'May', airline: 'ETIHAD AIRWAYS', sale_liters: 1826840 },
  { month: 'June', airline: 'ETIHAD AIRWAYS', sale_liters: 1699130 },
  { month: 'July', airline: 'ETIHAD AIRWAYS', sale_liters: 1807350 },
  // CHINA EASTERN AIRLINES
  { month: 'February', airline: 'CHINA EASTERN AIRLINES', sale_liters: 1445940 },
  { month: 'March', airline: 'CHINA EASTERN AIRLINES', sale_liters: 1520810 },
  { month: 'April', airline: 'CHINA EASTERN AIRLINES', sale_liters: 1427570 },
  { month: 'May', airline: 'CHINA EASTERN AIRLINES', sale_liters: 1513170 },
  { month: 'June', airline: 'CHINA EASTERN AIRLINES', sale_liters: 1359150 },
  { month: 'July', airline: 'CHINA EASTERN AIRLINES', sale_liters: 1624050 },
  // FITS AIR
  { month: 'February', airline: 'FITS AIR', sale_liters: 1086407 },
  { month: 'March', airline: 'FITS AIR', sale_liters: 1123015 },
  { month: 'April', airline: 'FITS AIR', sale_liters: 1296348 },
  { month: 'May', airline: 'FITS AIR', sale_liters: 1380385 },
  { month: 'June', airline: 'FITS AIR', sale_liters: 1294699 },
  { month: 'July', airline: 'FITS AIR', sale_liters: 1425245 },
  // FLY DUBAI
  { month: 'February', airline: 'FLY DUBAI', sale_liters: 1485450 },
  { month: 'March', airline: 'FLY DUBAI', sale_liters: 1586290 },
  { month: 'April', airline: 'FLY DUBAI', sale_liters: 1487600 },
  { month: 'May', airline: 'FLY DUBAI', sale_liters: 1241690 },
  { month: 'June', airline: 'FLY DUBAI', sale_liters: 1384530 },
  { month: 'July', airline: 'FLY DUBAI', sale_liters: 1412400 },
  // NATIONAL AIRLINES
  { month: 'February', airline: 'NATIONAL AIRLINES', sale_liters: 388090 },
  { month: 'March', airline: 'NATIONAL AIRLINES', sale_liters: 844870 },
  { month: 'April', airline: 'NATIONAL AIRLINES', sale_liters: 1224090 },
  { month: 'May', airline: 'NATIONAL AIRLINES', sale_liters: 1053420 },
  { month: 'June', airline: 'NATIONAL AIRLINES', sale_liters: 768930 },
  { month: 'July', airline: 'NATIONAL AIRLINES', sale_liters: 690220 },
  // AIR ARABIA
  { month: 'February', airline: 'AIR ARABIA', sale_liters: 829620 },
  { month: 'March', airline: 'AIR ARABIA', sale_liters: 918110 },
  { month: 'April', airline: 'AIR ARABIA', sale_liters: 894080 },
  { month: 'May', airline: 'AIR ARABIA', sale_liters: 795900 },
  { month: 'June', airline: 'AIR ARABIA', sale_liters: 907080 },
  { month: 'July', airline: 'AIR ARABIA', sale_liters: 918950 },
  // SINGAPORE AIRLINES
  { month: 'February', airline: 'SINGAPORE AIRLINES', sale_liters: 654150 },
  { month: 'March', airline: 'SINGAPORE AIRLINES', sale_liters: 765430 },
  { month: 'April', airline: 'SINGAPORE AIRLINES', sale_liters: 715010 },
  { month: 'May', airline: 'SINGAPORE AIRLINES', sale_liters: 778760 },
  { month: 'June', airline: 'SINGAPORE AIRLINES', sale_liters: 755660 },
  { month: 'July', airline: 'SINGAPORE AIRLINES', sale_liters: 823120 },
  // AIR INDIA
  { month: 'February', airline: 'AIR INDIA', sale_liters: 768180 },
  { month: 'March', airline: 'AIR INDIA', sale_liters: 889060 },
  { month: 'April', airline: 'AIR INDIA', sale_liters: 717330 },
  { month: 'May', airline: 'AIR INDIA', sale_liters: 771090 },
  { month: 'June', airline: 'AIR INDIA', sale_liters: 780500 },
  { month: 'July', airline: 'AIR INDIA', sale_liters: 1211970 },
  // CATHAY PACIFIC AIRLINES
  { month: 'February', airline: 'CATHAY PACIFIC AIRLINES', sale_liters: 512850 },
  { month: 'March', airline: 'CATHAY PACIFIC AIRLINES', sale_liters: 705440 },
  { month: 'April', airline: 'CATHAY PACIFIC AIRLINES', sale_liters: 703980 },
  { month: 'May', airline: 'CATHAY PACIFIC AIRLINES', sale_liters: 680460 },
  { month: 'June', airline: 'CATHAY PACIFIC AIRLINES', sale_liters: 767580 },
  { month: 'July', airline: 'CATHAY PACIFIC AIRLINES', sale_liters: 802520 },
  // TOTALS (from Jet A-1 Sales 2025.xlsx - 2025.csv)
  { month: 'Total', airline: 'ALL', sale_liters: 300972774 }, // Using the total from the summary file for resilience
];

// MOCK DATA FOR 2024 (Simulating a 5% lower total volume)
const rawSales2024: JetA1SalesData[] = rawSales2025
    .filter(d => d.month !== 'Total')
    .map(d => ({
        ...d,
        sale_liters: Math.round(d.sale_liters * 0.95), // 5% lower
    }));
rawSales2024.push({ month: 'Total', airline: 'ALL', sale_liters: rawSales2024.reduce((sum, d) => sum + d.sale_liters, 0) });


export const jetA1Sales2025: JetA1SalesData[] = rawSales2025;
export const jetA1Sales2024: JetA1SalesData[] = rawSales2024;

export const airlineNames = [
  'SRI LANKAN AIRLINES', 'EMIRATES AIRLINES', 'QATAR AIRWAYS', 
  'TURKISH AIRLINES', 'ETIHAD AIRWAYS', 'CHINA EASTERN AIRLINES', 
  'FITS AIR', 'FLY DUBAI', 'NATIONAL AIRLINES', 'AIR ARABIA', 
  'SINGAPORE AIRLINES', 'AIR INDIA', 'CATHAY PACIFIC AIRLINES'
];

export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const yearOptions = [
  { value: '2025', label: '2025 (Jan-Jul)' },
  { value: '2024', label: '2024 (Full Year Mock)' },
];

export async function fetchJetA1Sales(year: string): Promise<JetA1SalesData[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    if (year === '2025') return jetA1Sales2025;
    if (year === '2024') return jetA1Sales2024;
    return []; 
}