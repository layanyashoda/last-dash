// src/app/(main)/dashboard/oil-balance/_components/data.ts

export type OilBalanceEntry = {
  month: string;
  'Crude Oil Input (MT)': number;
  'Refinery Production (MT)': number;
  'Total Own Use & Loss (MT)': number;
  'Refined Product Imports (MT)': number;
  'Total Sales (MT)': number;
  'Stock Change (MT)': number;
};

// --- Mock Data for 2025 (Jan-Jul) based on file names ---
export const oilBalance2025: OilBalanceEntry[] = [
  { month: 'January', 'Crude Oil Input (MT)': 250000, 'Refinery Production (MT)': 245000, 'Total Own Use & Loss (MT)': 5000, 'Refined Product Imports (MT)': 150000, 'Total Sales (MT)': 390000, 'Stock Change (MT)': 0 },
  { month: 'February', 'Crude Oil Input (MT)': 240000, 'Refinery Production (MT)': 235000, 'Total Own Use & Loss (MT)': 5500, 'Refined Product Imports (MT)': 180000, 'Total Sales (MT)': 410000, 'Stock Change (MT)': -500 },
  { month: 'March', 'Crude Oil Input (MT)': 260000, 'Refinery Production (MT)': 255000, 'Total Own Use & Loss (MT)': 6000, 'Refined Product Imports (MT)': 170000, 'Total Sales (MT)': 420000, 'Stock Change (MT)': 500 },
  { month: 'April', 'Crude Oil Input (MT)': 255000, 'Refinery Production (MT)': 250000, 'Total Own Use & Loss (MT)': 5500, 'Refined Product Imports (MT)': 200000, 'Total Sales (MT)': 440000, 'Stock Change (MT)': 4500 },
  { month: 'May', 'Crude Oil Input (MT)': 245000, 'Refinery Production (MT)': 240000, 'Total Own Use & Loss (MT)': 5000, 'Refined Product Imports (MT)': 160000, 'Total Sales (MT)': 395000, 'Stock Change (MT)': 500 },
  { month: 'June', 'Crude Oil Input (MT)': 235000, 'Refinery Production (MT)': 230000, 'Total Own Use & Loss (MT)': 4500, 'Refined Product Imports (MT)': 155000, 'Total Sales (MT)': 380000, 'Stock Change (MT)': 500 },
  { month: 'July', 'Crude Oil Input (MT)': 270000, 'Refinery Production (MT)': 265000, 'Total Own Use & Loss (MT)': 5000, 'Refined Product Imports (MT)': 190000, 'Total Sales (MT)': 450000, 'Stock Change (MT)': 5000 },
];

// Mock Data for 2024 (Full Year) - Simulating 5% lower overall volumes
export const oilBalance2024: OilBalanceEntry[] = [
  { month: 'January', 'Crude Oil Input (MT)': 240000, 'Refinery Production (MT)': 230000, 'Total Own Use & Loss (MT)': 4500, 'Refined Product Imports (MT)': 140000, 'Total Sales (MT)': 370000, 'Stock Change (MT)': 500 },
  { month: 'February', 'Crude Oil Input (MT)': 230000, 'Refinery Production (MT)': 220000, 'Total Own Use & Loss (MT)': 4500, 'Refined Product Imports (MT)': 160000, 'Total Sales (MT)': 380000, 'Stock Change (MT)': -4500 },
  { month: 'March', 'Crude Oil Input (MT)': 250000, 'Refinery Production (MT)': 240000, 'Total Own Use & Loss (MT)': 5000, 'Refined Product Imports (MT)': 150000, 'Total Sales (MT)': 390000, 'Stock Change (MT)': 5000 },
  { month: 'April', 'Crude Oil Input (MT)': 245000, 'Refinery Production (MT)': 235000, 'Total Own Use & Loss (MT)': 4500, 'Refined Product Imports (MT)': 180000, 'Total Sales (MT)': 410000, 'Stock Change (MT)': 500 },
  { month: 'May', 'Crude Oil Input (MT)': 235000, 'Refinery Production (MT)': 225000, 'Total Own Use & Loss (MT)': 4000, 'Refined Product Imports (MT)': 140000, 'Total Sales (MT)': 365000, 'Stock Change (MT)': 1500 },
  { month: 'June', 'Crude Oil Input (MT)': 225000, 'Refinery Production (MT)': 215000, 'Total Own Use & Loss (MT)': 3500, 'Refined Product Imports (MT)': 135000, 'Total Sales (MT)': 345000, 'Stock Change (MT)': 2500 },
  { month: 'July', 'Crude Oil Input (MT)': 260000, 'Refinery Production (MT)': 250000, 'Total Own Use & Loss (MT)': 4000, 'Refined Product Imports (MT)': 170000, 'Total Sales (MT)': 420000, 'Stock Change (MT)': 2000 },
  { month: 'August', 'Crude Oil Input (MT)': 250000, 'Refinery Production (MT)': 245000, 'Total Own Use & Loss (MT)': 4500, 'Refined Product Imports (MT)': 160000, 'Total Sales (MT)': 400000, 'Stock Change (MT)': 500 },
  { month: 'September', 'Crude Oil Input (MT)': 240000, 'Refinery Production (MT)': 230000, 'Total Own Use & Loss (MT)': 4000, 'Refined Product Imports (MT)': 150000, 'Total Sales (MT)': 375000, 'Stock Change (MT)': 1000 },
  { month: 'October', 'Crude Oil Input (MT)': 250000, 'Refinery Production (MT)': 245000, 'Total Own Use & Loss (MT)': 5000, 'Refined Product Imports (MT)': 160000, 'Total Sales (MT)': 400000, 'Stock Change (MT)': 500 },
  { month: 'November', 'Crude Oil Input (MT)': 240000, 'Refinery Production (MT)': 235000, 'Total Own Use & Loss (MT)': 4500, 'Refined Product Imports (MT)': 150000, 'Total Sales (MT)': 380000, 'Stock Change (MT)': 500 },
  { month: 'December', 'Crude Oil Input (MT)': 255000, 'Refinery Production (MT)': 250000, 'Total Own Use & Loss (MT)': 5000, 'Refined Product Imports (MT)': 170000, 'Total Sales (MT)': 420000, 'Stock Change (MT)': 500 },
];


export const balanceItems = [
  'Crude Oil Input (MT)', 
  'Refinery Production (MT)', 
  'Refined Product Imports (MT)', 
  'Total Sales (MT)', 
  'Total Own Use & Loss (MT)', 
  'Stock Change (MT)',
];

export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const yearOptions = [
  { value: '2025', label: '2025 (Jan-Jul Mock)' },
  { value: '2024', label: '2024 (Full Year Mock)' },
];

// Mock Fetcher
export async function fetchOilBalance(year: string): Promise<OilBalanceEntry[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    if (year === '2025') return oilBalance2025;
    if (year === '2024') return oilBalance2024;
    return []; 
}