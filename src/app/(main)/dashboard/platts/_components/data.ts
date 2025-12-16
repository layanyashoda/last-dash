// src/app/(main)/dashboard/platts/_components/data.ts

export type PlattsPrice = {
  month: string;
  'Gasoline 92 (USD/BBL)': number;
  'Gasoline 95 (USD/BBL)': number;
  'Jet Kero (USD/BBL)': number;
  'Gasoil 0.05% (USD/BBL)': number;
  'FO 380 CST (USD/MT)': number;
  'Naphtha (USD/BBL)': number;
};

// Data extracted and simplified from Platts 2025.xlsx - Average.csv
export const plattsPrices2025: PlattsPrice[] = [
  { month: 'January', 'Gasoline 92 (USD/BBL)': 84.83, 'Gasoline 95 (USD/BBL)': 86.30, 'Jet Kero (USD/BBL)': 91.69, 'Gasoil 0.05% (USD/BBL)': 90.63, 'FO 380 CST (USD/MT)': 483.68, 'Naphtha (USD/BBL)': 72.11 },
  { month: 'February', 'Gasoline 92 (USD/BBL)': 84.83, 'Gasoline 95 (USD/BBL)': 86.30, 'Jet Kero (USD/BBL)': 91.69, 'Gasoil 0.05% (USD/BBL)': 90.63, 'FO 380 CST (USD/MT)': 483.68, 'Naphtha (USD/BBL)': 72.11 },
  { month: 'March', 'Gasoline 92 (USD/BBL)': 79.56, 'Gasoline 95 (USD/BBL)': 81.00, 'Jet Kero (USD/BBL)': 85.27, 'Gasoil 0.05% (USD/BBL)': 85.13, 'FO 380 CST (USD/MT)': 456.82, 'Naphtha (USD/BBL)': 69.35 },
  { month: 'April', 'Gasoline 92 (USD/BBL)': 75.30, 'Gasoline 95 (USD/BBL)': 76.81, 'Jet Kero (USD/BBL)': 79.46, 'Gasoil 0.05% (USD/BBL)': 79.40, 'FO 380 CST (USD/MT)': 412.35, 'Naphtha (USD/BBL)': 66.21 },
  { month: 'May', 'Gasoline 92 (USD/BBL)': 74.80, 'Gasoline 95 (USD/BBL)': 76.33, 'Jet Kero (USD/BBL)': 78.73, 'Gasoil 0.05% (USD/BBL)': 80.01, 'FO 380 CST (USD/MT)': 434.70, 'Naphtha (USD/BBL)': 65.01 },
  { month: 'June', 'Gasoline 92 (USD/BBL)': 75.86, 'Gasoline 95 (USD/BBL)': 77.70, 'Jet Kero (USD/BBL)': 78.30, 'Gasoil 0.05% (USD/BBL)': 79.96, 'FO 380 CST (USD/MT)': 423.24, 'Naphtha (USD/BBL)': 60.83 },
  { month: 'July', 'Gasoline 92 (USD/BBL)': 78.26, 'Gasoline 95 (USD/BBL)': 80.10, 'Jet Kero (USD/BBL)': 84.73, 'Gasoil 0.05% (USD/BBL)': 88.00, 'FO 380 CST (USD/MT)': 415.70, 'Naphtha (USD/BBL)': 61.98 },
];

// Mock data for 2024 (Simulating a difference for comparison)
export const plattsPrices2024: PlattsPrice[] = plattsPrices2025.map(p => ({
    ...p,
    'Gasoline 92 (USD/BBL)': p['Gasoline 92 (USD/BBL)'] * 1.05,
    'Jet Kero (USD/BBL)': p['Jet Kero (USD/BBL)'] * 0.98,
    'FO 380 CST (USD/MT)': p['FO 380 CST (USD/MT)'] * 1.10,
}));


export const productNames = Object.keys(plattsPrices2025[0]).filter(k => k !== 'month');

export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const yearOptions = [
  { value: '2025', label: '2025 (Jan-Jul)' },
  { value: '2024', label: '2024 (Mock)' },
];

// Mock Fetcher
export async function fetchPlattsPrices(year: string): Promise<PlattsPrice[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    if (year === '2025') return plattsPrices2025;
    if (year === '2024') return plattsPrices2024;
    return []; 
}