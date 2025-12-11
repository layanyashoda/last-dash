// src/app/(main)/dashboard/refined-products/_components/data.ts

export type RefinedProductImport = {
  month: string;
  'Gas Oil 0.05% M.S.': number;
  'Gas Oil 0.001% M.S.': number;
  'Pet 92': number;
  'Pet 95': number;
  'Jet A-1': number;
  'HSFO': number;
  'LSFO': number;
  'Naphtha': number;
  total: number;
};

export const productNames = [
  'Gas Oil 0.05% M.S.', 
  'Gas Oil 0.001% M.S.', 
  'Pet 92', 
  'Pet 95', 
  'Jet A-1', 
  'HSFO', 
  'LSFO', 
  'Naphtha'
];

export const yearOptions = [
  { value: '2025', label: '2025 (Initial Load)' },
  { value: '2024', label: '2024 (Initial Load)' },
];

// --- HARDCODED DATA ARRAYS RESTORED ---
export const refinedProductImports2025: RefinedProductImport[] = [
  { month: 'January', 'Gas Oil 0.05% M.S.': 38122.61, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 72428.70, 'Pet 95': 0, 'Jet A-1': 35752.99, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 146304.30 },
  { month: 'February', 'Gas Oil 0.05% M.S.': 33013.01, 'Gas Oil 0.001% M.S.': 5205.63, 'Pet 92': 36519.76, 'Pet 95': 0, 'Jet A-1': 302539.00, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 377277.40 },
  { month: 'March', 'Gas Oil 0.05% M.S.': 39303.95, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 37051.05, 'Pet 95': 0, 'Jet A-1': 36576.29, 'HSFO': 0, 'LSFO': 27505.99, 'Naphtha': 11862.45, total: 152299.74 },
  { month: 'April', 'Gas Oil 0.05% M.S.': 78757.71, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 67189.80, 'Pet 95': 5300.37, 'Jet A-1': 34967.02, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 186214.90 },
  { month: 'May', 'Gas Oil 0.05% M.S.': 33606.19, 'Gas Oil 0.001% M.S.': 5198.08, 'Pet 92': 37141.61, 'Pet 95': 0, 'Jet A-1': 37540.13, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 12208.68, total: 125694.68 },
  { month: 'June', 'Gas Oil 0.05% M.S.': 37802.30, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 74547.22, 'Pet 95': 0, 'Jet A-1': 0, 'HSFO': 0, 'LSFO': 31089.49, 'Naphtha': 0, total: 143439.02 },
  { month: 'July', 'Gas Oil 0.05% M.S.': 37301.00, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 30339.23, 'Pet 95': 4977.54, 'Jet A-1': 37403.51, 'HSFO': 0, 'LSFO': 65090.64, 'Naphtha': 18120.81, total: 193232.74 },
  { month: 'August', 'Gas Oil 0.05% M.S.': 0, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 0, 'Pet 95': 0, 'Jet A-1': 0, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 0 },
  { month: 'September', 'Gas Oil 0.05% M.S.': 0, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 0, 'Pet 95': 0, 'Jet A-1': 0, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 0 },
  { month: 'October', 'Gas Oil 0.05% M.S.': 0, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 0, 'Pet 95': 0, 'Jet A-1': 0, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 0 },
  { month: 'November', 'Gas Oil 0.05% M.S.': 0, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 0, 'Pet 95': 0, 'Jet A-1': 0, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 0 },
  { month: 'December', 'Gas Oil 0.05% M.S.': 0, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 0, 'Pet 95': 0, 'Jet A-1': 0, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 0 },
  { month: 'Total', 'Gas Oil 0.05% M.S.': 297906.77, 'Gas Oil 0.001% M.S.': 10403.71, 'Pet 92': 355217.37, 'Pet 95': 10277.91, 'Jet A-1': 484778.94, 'HSFO': 0, 'LSFO': 123686.12, 'Naphtha': 42191.94, total: 1324462.76 },
];

export const refinedProductImports2024: RefinedProductImport[] = [
  { month: 'January', 'Gas Oil 0.05% M.S.': 0, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 74045.63, 'Pet 95': 0, 'Jet A-1': 0, 'HSFO': 0, 'LSFO': 29556.30, 'Naphtha': 0, total: 103601.93 },
  { month: 'February', 'Gas Oil 0.05% M.S.': 68531.96, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 69010.08, 'Pet 95': 0, 'Jet A-1': 37955.04, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 175497.08 },
  { month: 'March', 'Gas Oil 0.05% M.S.': 43180.76, 'Gas Oil 0.001% M.S.': 7170.41, 'Pet 92': 37397.48, 'Pet 95': 0, 'Jet A-1': 37094.70, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 124843.35 },
  { month: 'April', 'Gas Oil 0.05% M.S.': 289713.00, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 30661.14, 'Pet 95': 5274.59, 'Jet A-1': 0, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 325648.72 },
  { month: 'May', 'Gas Oil 0.05% M.S.': 39138.86, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 33795.42, 'Pet 95': 0, 'Jet A-1': 35963.04, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 108897.32 },
  { month: 'June', 'Gas Oil 0.05% M.S.': 38617.04, 'Gas Oil 0.001% M.S.': 7268.15, 'Pet 92': 57869.90, 'Pet 95': 9220.46, 'Jet A-1': 37336.55, 'HSFO': 0, 'LSFO': 35468.01, 'Naphtha': 0, total: 185780.10 },
  { month: 'July', 'Gas Oil 0.05% M.S.': 78424.45, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 72393.19, 'Pet 95': 0, 'Jet A-1': 0, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 150817.64 },
  { month: 'August', 'Gas Oil 0.05% M.S.': 78250.66, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 72080.64, 'Pet 95': 0, 'Jet A-1': 74226.74, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 224558.04 },
  { month: 'September', 'Gas Oil 0.05% M.S.': 39354.45, 'Gas Oil 0.001% M.S.': 7338.21, 'Pet 92': 37117.20, 'Pet 95': 0, 'Jet A-1': 29532.71, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 113342.58 },
  { month: 'October', 'Gas Oil 0.05% M.S.': 7538.35, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 36775.53, 'Pet 95': 0, 'Jet A-1': 29681.29, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 11949.69, total: 85944.86 },
  { month: 'November', 'Gas Oil 0.05% M.S.': 38732.28, 'Gas Oil 0.001% M.S.': 0, 'Pet 92': 36760.18, 'Pet 95': 0, 'Jet A-1': 0, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 75492.46 },
  { month: 'December', 'Gas Oil 0.05% M.S.': 34081.77, 'Gas Oil 0.001% M.S.': 5168.55, 'Pet 92': 32111.24, 'Pet 95': 5045.77, 'Jet A-1': 34021.63, 'HSFO': 0, 'LSFO': 0, 'Naphtha': 0, total: 110428.95 },
  { month: 'Total', 'Gas Oil 0.05% M.S.': 755563.58, 'Gas Oil 0.001% M.S.': 26945.32, 'Pet 92': 590017.61, 'Pet 95': 19540.82, 'Jet A-1': 315811.70, 'HSFO': 0, 'LSFO': 65024.30, 'Naphtha': 11949.69, total: 1784853.01 },
];

export async function fetchRefinedProductImports(year: string): Promise<RefinedProductImport[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    if (year === '2025') return refinedProductImports2025;
    if (year === '2024') return refinedProductImports2024;
    return []; 
}