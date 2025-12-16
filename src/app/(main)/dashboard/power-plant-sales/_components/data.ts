// src/app/(main)/dashboard/power-plant-sales/_components/data.ts

export type PowerPlantSalesEntry = {
  month: string;
  plant: string;
  sales_mt: number; // Sales in Metric Tons
};

export const powerPlants = [
  'Kelanitissa CCGT', 
  'Sapugaskanda Diesel', 
  'Kerawalapitiya Combined', 
  'Sama Power', 
  'Lakdhanavi Power',
  'Total Sales' // Used for aggregated metrics
];

// FIX: monthNames must be defined before mockSalesByPlant uses it.
export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


const mockSalesByPlant = (year: number, salesMultiplier: number): PowerPlantSalesEntry[] => {
    const data: PowerPlantSalesEntry[] = [];
    const baseSales = {
        'Kelanitissa CCGT': 40000,
        'Sapugaskanda Diesel': 15000,
        'Kerawalapitiya Combined': 30000,
        'Sama Power': 10000,
        'Lakdhanavi Power': 8000,
    };
    
    let totalSales = 0;

    // FIX: monthNames is now accessible here
    for (const month of monthNames) { 
        let monthlyTotal = 0;
        for (const plant of Object.keys(baseSales)) {
            const sale = Math.round(baseSales[plant as keyof typeof baseSales] * (1 + (Math.random() - 0.5) * 0.1) * salesMultiplier);
            data.push({ month, plant, sales_mt: sale });
            monthlyTotal += sale;
        }
        totalSales += monthlyTotal;
    }
    
    // Append a single entry for the Grand Total of sales across the year
    data.push({ month: 'Total', plant: 'All Plants', sales_mt: totalSales });

    return data;
};

// These lines must come after mockSalesByPlant
export const sales2025: PowerPlantSalesEntry[] = mockSalesByPlant(2025, 1.05); // 5% increase for 2025
export const sales2024: PowerPlantSalesEntry[] = mockSalesByPlant(2024, 1.0);

export const yearOptions = [
  { value: '2025', label: '2025 (Full Year Mock)' },
  { value: '2024', label: '2024 (Full Year Mock)' },
];

// Mock Fetcher
export async function fetchPowerPlantSales(year: string): Promise<PowerPlantSalesEntry[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    if (year === '2025') return sales2025;
    if (year === '2024') return sales2024;
    return []; 
}