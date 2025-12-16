// src/app/(main)/dashboard/landed-cost/_components/data.ts

export type LandedCost = {
  month: string;
  product: string;
  'CIF (Rs/MT)': number;
  'Duties & Taxes (Rs/MT)': number;
  'Landing Cost (Rs/MT)': number;
};

// --- Mock Data expanded to full 12 months for 2025 ---
const landedCost2025: LandedCost[] = [
  // Product: Petrol 92 RON
  { month: 'January', product: 'Petrol 92 RON', 'CIF (Rs/MT)': 78000.00, 'Duties & Taxes (Rs/MT)': 32000.00, 'Landing Cost (Rs/MT)': 110000.00 },
  { month: 'February', product: 'Petrol 92 RON', 'CIF (Rs/MT)': 79500.00, 'Duties & Taxes (Rs/MT)': 32500.00, 'Landing Cost (Rs/MT)': 112000.00 },
  { month: 'March', product: 'Petrol 92 RON', 'CIF (Rs/MT)': 80200.00, 'Duties & Taxes (Rs/MT)': 33000.00, 'Landing Cost (Rs/MT)': 113200.00 },
  { month: 'April', product: 'Petrol 92 RON', 'CIF (Rs/MT)': 81000.00, 'Duties & Taxes (Rs/MT)': 33200.00, 'Landing Cost (Rs/MT)': 114200.00 },
  { month: 'May', product: 'Petrol 92 RON', 'CIF (Rs/MT)': 81500.00, 'Duties & Taxes (Rs/MT)': 33300.00, 'Landing Cost (Rs/MT)': 114800.00 },
  { month: 'June', product: 'Petrol 92 RON', 'CIF (Rs/MT)': 82000.00, 'Duties & Taxes (Rs/MT)': 33400.00, 'Landing Cost (Rs/MT)': 115400.00 },
  { month: 'July', product: 'Petrol 92 RON', 'CIF (Rs/MT)': 82500.00, 'Duties & Taxes (Rs/MT)': 33500.00, 'Landing Cost (Rs/MT)': 116000.00 },
  { month: 'August', product: 'Petrol 92 RON', 'CIF (Rs/MT)': 83000.00, 'Duties & Taxes (Rs/MT)': 33600.00, 'Landing Cost (Rs/MT)': 116600.00 },
  { month: 'September', product: 'Petrol 92 RON', 'CIF (Rs/MT)': 83500.00, 'Duties & Taxes (Rs/MT)': 33700.00, 'Landing Cost (Rs/MT)': 117200.00 },
  { month: 'October', product: 'Petrol 92 RON', 'CIF (Rs/MT)': 84000.00, 'Duties & Taxes (Rs/MT)': 33800.00, 'Landing Cost (Rs/MT)': 117800.00 },
  { month: 'November', product: 'Petrol 92 RON', 'CIF (Rs/MT)': 84500.00, 'Duties & Taxes (Rs/MT)': 33900.00, 'Landing Cost (Rs/MT)': 118400.00 },
  { month: 'December', product: 'Petrol 92 RON', 'CIF (Rs/MT)': 85000.00, 'Duties & Taxes (Rs/MT)': 34000.00, 'Landing Cost (Rs/MT)': 119000.00 },
  
  // Product: Petrol 95 RON
  { month: 'January', product: 'Petrol 95 RON', 'CIF (Rs/MT)': 85000.00, 'Duties & Taxes (Rs/MT)': 34000.00, 'Landing Cost (Rs/MT)': 119000.00 },
  { month: 'February', product: 'Petrol 95 RON', 'CIF (Rs/MT)': 86500.00, 'Duties & Taxes (Rs/MT)': 34500.00, 'Landing Cost (Rs/MT)': 121000.00 },
  { month: 'March', product: 'Petrol 95 RON', 'CIF (Rs/MT)': 87000.00, 'Duties & Taxes (Rs/MT)': 35000.00, 'Landing Cost (Rs/MT)': 122000.00 },
  { month: 'April', product: 'Petrol 95 RON', 'CIF (Rs/MT)': 88000.00, 'Duties & Taxes (Rs/MT)': 35200.00, 'Landing Cost (Rs/MT)': 123200.00 },
  { month: 'May', product: 'Petrol 95 RON', 'CIF (Rs/MT)': 88500.00, 'Duties & Taxes (Rs/MT)': 35300.00, 'Landing Cost (Rs/MT)': 123800.00 },
  { month: 'June', product: 'Petrol 95 RON', 'CIF (Rs/MT)': 89000.00, 'Duties & Taxes (Rs/MT)': 35400.00, 'Landing Cost (Rs/MT)': 124400.00 },
  { month: 'July', product: 'Petrol 95 RON', 'CIF (Rs/MT)': 89500.00, 'Duties & Taxes (Rs/MT)': 35500.00, 'Landing Cost (Rs/MT)': 125000.00 },
  { month: 'August', product: 'Petrol 95 RON', 'CIF (Rs/MT)': 90000.00, 'Duties & Taxes (Rs/MT)': 35600.00, 'Landing Cost (Rs/MT)': 125600.00 },
  { month: 'September', product: 'Petrol 95 RON', 'CIF (Rs/MT)': 90500.00, 'Duties & Taxes (Rs/MT)': 35700.00, 'Landing Cost (Rs/MT)': 126200.00 },
  { month: 'October', product: 'Petrol 95 RON', 'CIF (Rs/MT)': 91000.00, 'Duties & Taxes (Rs/MT)': 35800.00, 'Landing Cost (Rs/MT)': 126800.00 },
  { month: 'November', product: 'Petrol 95 RON', 'CIF (Rs/MT)': 91500.00, 'Duties & Taxes (Rs/MT)': 35900.00, 'Landing Cost (Rs/MT)': 127400.00 },
  { month: 'December', product: 'Petrol 95 RON', 'CIF (Rs/MT)': 92000.00, 'Duties & Taxes (Rs/MT)': 36000.00, 'Landing Cost (Rs/MT)': 128000.00 },

  // Product: Jet Fuel
  { month: 'January', product: 'Jet Fuel', 'CIF (Rs/MT)': 75000.00, 'Duties & Taxes (Rs/MT)': 28000.00, 'Landing Cost (Rs/MT)': 103000.00 },
  { month: 'February', product: 'Jet Fuel', 'CIF (Rs/MT)': 76000.00, 'Duties & Taxes (Rs/MT)': 28500.00, 'Landing Cost (Rs/MT)': 104500.00 },
  { month: 'March', product: 'Jet Fuel', 'CIF (Rs/MT)': 77000.00, 'Duties & Taxes (Rs/MT)': 29000.00, 'Landing Cost (Rs/MT)': 106000.00 },
  { month: 'April', product: 'Jet Fuel', 'CIF (Rs/MT)': 78000.00, 'Duties & Taxes (Rs/MT)': 29200.00, 'Landing Cost (Rs/MT)': 107200.00 },
  { month: 'May', product: 'Jet Fuel', 'CIF (Rs/MT)': 78500.00, 'Duties & Taxes (Rs/MT)': 29300.00, 'Landing Cost (Rs/MT)': 107800.00 },
  { month: 'June', product: 'Jet Fuel', 'CIF (Rs/MT)': 79000.00, 'Duties & Taxes (Rs/MT)': 29400.00, 'Landing Cost (Rs/MT)': 108400.00 },
  { month: 'July', product: 'Jet Fuel', 'CIF (Rs/MT)': 79500.00, 'Duties & Taxes (Rs/MT)': 29500.00, 'Landing Cost (Rs/MT)': 109000.00 },
  { month: 'August', product: 'Jet Fuel', 'CIF (Rs/MT)': 80000.00, 'Duties & Taxes (Rs/MT)': 29600.00, 'Landing Cost (Rs/MT)': 109600.00 },
  { month: 'September', product: 'Jet Fuel', 'CIF (Rs/MT)': 80500.00, 'Duties & Taxes (Rs/MT)': 29700.00, 'Landing Cost (Rs/MT)': 110200.00 },
  { month: 'October', product: 'Jet Fuel', 'CIF (Rs/MT)': 81000.00, 'Duties & Taxes (Rs/MT)': 29800.00, 'Landing Cost (Rs/MT)': 110800.00 },
  { month: 'November', product: 'Jet Fuel', 'CIF (Rs/MT)': 81500.00, 'Duties & Taxes (Rs/MT)': 29900.00, 'Landing Cost (Rs/MT)': 111400.00 },
  { month: 'December', product: 'Jet Fuel', 'CIF (Rs/MT)': 82000.00, 'Duties & Taxes (Rs/MT)': 30000.00, 'Landing Cost (Rs/MT)': 112000.00 },

  // Product: Gas oil 0.05% S
  { month: 'January', product: 'Gas oil 0.05% S', 'CIF (Rs/MT)': 72000.00, 'Duties & Taxes (Rs/MT)': 25000.00, 'Landing Cost (Rs/MT)': 97000.00 },
  { month: 'February', product: 'Gas oil 0.05% S', 'CIF (Rs/MT)': 73000.00, 'Duties & Taxes (Rs/MT)': 25500.00, 'Landing Cost (Rs/MT)': 98500.00 },
  { month: 'March', product: 'Gas oil 0.05% S', 'CIF (Rs/MT)': 74000.00, 'Duties & Taxes (Rs/MT)': 26000.00, 'Landing Cost (Rs/MT)': 100000.00 },
  { month: 'April', product: 'Gas oil 0.05% S', 'CIF (Rs/MT)': 75000.00, 'Duties & Taxes (Rs/MT)': 26200.00, 'Landing Cost (Rs/MT)': 101200.00 },
  { month: 'May', product: 'Gas oil 0.05% S', 'CIF (Rs/MT)': 75500.00, 'Duties & Taxes (Rs/MT)': 26300.00, 'Landing Cost (Rs/MT)': 101800.00 },
  { month: 'June', product: 'Gas oil 0.05% S', 'CIF (Rs/MT)': 76000.00, 'Duties & Taxes (Rs/MT)': 26400.00, 'Landing Cost (Rs/MT)': 102400.00 },
  { month: 'July', product: 'Gas oil 0.05% S', 'CIF (Rs/MT)': 76500.00, 'Duties & Taxes (Rs/MT)': 26500.00, 'Landing Cost (Rs/MT)': 103000.00 },
  { month: 'August', product: 'Gas oil 0.05% S', 'CIF (Rs/MT)': 77000.00, 'Duties & Taxes (Rs/MT)': 26600.00, 'Landing Cost (Rs/MT)': 103600.00 },
  { month: 'September', product: 'Gas oil 0.05% S', 'CIF (Rs/MT)': 77500.00, 'Duties & Taxes (Rs/MT)': 26700.00, 'Landing Cost (Rs/MT)': 104200.00 },
  { month: 'October', product: 'Gas oil 0.05% S', 'CIF (Rs/MT)': 78000.00, 'Duties & Taxes (Rs/MT)': 26800.00, 'Landing Cost (Rs/MT)': 104800.00 },
  { month: 'November', product: 'Gas oil 0.05% S', 'CIF (Rs/MT)': 78500.00, 'Duties & Taxes (Rs/MT)': 26900.00, 'Landing Cost (Rs/MT)': 105400.00 },
  { month: 'December', product: 'Gas oil 0.05% S', 'CIF (Rs/MT)': 79000.00, 'Duties & Taxes (Rs/MT)': 27000.00, 'Landing Cost (Rs/MT)': 106000.00 },
];

// Mock data for 2024 (Simulating a 10% lower price for comparison)
const landedCost2024: LandedCost[] = landedCost2025.map(d => ({
    ...d,
    'CIF (Rs/MT)': d['CIF (Rs/MT)'] * 0.90,
    'Duties & Taxes (Rs/MT)': d['Duties & Taxes (Rs/MT)'] * 0.95,
    'Landing Cost (Rs/MT)': d['Landing Cost (Rs/MT)'] * 0.92,
}));

export const productNames = [
  'Petrol 92 RON', 
  'Petrol 95 RON', 
  'Jet Fuel', 
  'Gas oil 0.05% S', 
];

export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const yearOptions = [
  { value: '2025', label: '2025 (Full Year Mock)' },
  { value: '2024', label: '2024 (Full Year Mock)' },
];

// Mock Fetcher
export async function fetchLandedCost(year: string): Promise<LandedCost[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    if (year === '2025') return landedCost2025;
    if (year === '2024') return landedCost2024;
    return []; 
}