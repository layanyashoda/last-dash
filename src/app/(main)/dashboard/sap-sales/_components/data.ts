// src/app/(main)/dashboard/sap-sales/_components/data.ts

export type SapSalesEntry = {
  month: string;
  product: string;
  sales_mt: number; // Sales in Metric Tons
};

export const productNames = [
  'Lanka Auto Diesel',
  'Lanka Super Diesel - Euro4',
  'Lanka Petrol 95 Oct Euro4',
  'Lanka Petrol 92 Octane',
  'Lanka Industrial Kerosene',
  'Lanka Kerosene',
];

export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Data extracted and aggregated from 2025.xlsx - MT.csv (Jan-Jul)
const sales2025Data: SapSalesEntry[] = [
  // Lanka Auto Diesel
  { month: 'January', product: 'Lanka Auto Diesel', sales_mt: 80027.1506 },
  { month: 'February', product: 'Lanka Auto Diesel', sales_mt: 89342.9019 },
  { month: 'March', product: 'Lanka Auto Diesel', sales_mt: 91022.9755 },
  { month: 'April', product: 'Lanka Auto Diesel', sales_mt: 84363.8917 },
  { month: 'May', product: 'Lanka Auto Diesel', sales_mt: 83211.4526 },
  { month: 'June', product: 'Lanka Auto Diesel', sales_mt: 88879.8553 },
  { month: 'July', product: 'Lanka Auto Diesel', sales_mt: 80644.6015 },

  // Lanka Super Diesel - Euro4
  { month: 'January', product: 'Lanka Super Diesel - Euro4', sales_mt: 3168.8663 },
  { month: 'February', product: 'Lanka Super Diesel - Euro4', sales_mt: 2015.7360 },
  { month: 'March', product: 'Lanka Super Diesel - Euro4', sales_mt: 2032.4873 },
  { month: 'April', product: 'Lanka Super Diesel - Euro4', sales_mt: 2253.0457 },
  { month: 'May', product: 'Lanka Super Diesel - Euro4', sales_mt: 2155.3299 },
  { month: 'June', product: 'Lanka Super Diesel - Euro4', sales_mt: 2504.3147 },
  { month: 'July', product: 'Lanka Super Diesel - Euro4', sales_mt: 2085.5330 },

  // Lanka Petrol 95 Oct Euro4
  { month: 'January', product: 'Lanka Petrol 95 Oct Euro4', sales_mt: 1898.6301 },
  { month: 'February', product: 'Lanka Petrol 95 Oct Euro4', sales_mt: 1747.9452 },
  { month: 'March', product: 'Lanka Petrol 95 Oct Euro4', sales_mt: 1793.1507 },
  { month: 'April', product: 'Lanka Petrol 95 Oct Euro4', sales_mt: 2041.7808 },
  { month: 'May', product: 'Lanka Petrol 95 Oct Euro4', sales_mt: 2004.1096 },
  { month: 'June', product: 'Lanka Petrol 95 Oct Euro4', sales_mt: 2421.0046 },
  { month: 'July', product: 'Lanka Petrol 95 Oct Euro4', sales_mt: 1989.0411 },

  // Lanka Petrol 92 Octane
  { month: 'January', product: 'Lanka Petrol 92 Octane', sales_mt: 66661.4612 },
  { month: 'February', product: 'Lanka Petrol 92 Octane', sales_mt: 62428.7823 },
  { month: 'March', product: 'Lanka Petrol 92 Octane', sales_mt: 68569.6766 },
  { month: 'April', product: 'Lanka Petrol 92 Octane', sales_mt: 72532.6712 },
  { month: 'May', product: 'Lanka Petrol 92 Octane', sales_mt: 72027.4125 },
  { month: 'June', product: 'Lanka Petrol 92 Octane', sales_mt: 74167.6065 },
  { month: 'July', product: 'Lanka Petrol 92 Octane', sales_mt: 68337.6712 },

  // Lanka Industrial Kerosene (Using data from 2025.xlsx - Product Wise Summary.csv)
  { month: 'January', product: 'Lanka Industrial Kerosene', sales_mt: 737.7848 },
  { month: 'February', product: 'Lanka Industrial Kerosene', sales_mt: 699.0110 },
  { month: 'March', product: 'Lanka Industrial Kerosene', sales_mt: 845.0903 },
  { month: 'April', product: 'Lanka Industrial Kerosene', sales_mt: 399.2145 },
  { month: 'May', product: 'Lanka Industrial Kerosene', sales_mt: 523.6449 },
  { month: 'June', product: 'Lanka Industrial Kerosene', sales_mt: 829.6936 },
  { month: 'July', product: 'Lanka Industrial Kerosene', sales_mt: 876.1060 },

  // Lanka Kerosene (Using data from 2025.xlsx - Product Wise Summary.csv)
  { month: 'January', product: 'Lanka Kerosene', sales_mt: 11525.3731 },
  { month: 'February', product: 'Lanka Kerosene', sales_mt: 12595.9937 },
  { month: 'March', product: 'Lanka Kerosene', sales_mt: 12600.6716 },
  { month: 'April', product: 'Lanka Kerosene', sales_mt: 11751.7925 },
  { month: 'May', product: 'Lanka Kerosene', sales_mt: 11525.3731 },
  { month: 'June', product: 'Lanka Kerosene', sales_mt: 12496.0123 },
  { month: 'July', product: 'Lanka Kerosene', sales_mt: 11878.2987 },
];

export const sapSales2025: SapSalesEntry[] = sales2025Data;

// Mock Data for 2024 (Full Year) - Simulating a 5% lower overall volume
export const sapSales2024: SapSalesEntry[] = sapSales2025.map(d => ({
    ...d,
    sales_mt: Math.round(d.sales_mt * 0.95), // 5% lower
}));

export const yearOptions = [
  { value: '2025', label: '2025 (Jan-Jul)' },
  { value: '2024', label: '2024 (Mock)' },
];

// Mock Fetcher
export async function fetchSapSales(year: string): Promise<SapSalesEntry[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    if (year === '2025') return sapSales2025;
    if (year === '2024') return sapSales2024;
    return []; 
}