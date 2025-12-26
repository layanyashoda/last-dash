import { LandedCost } from './data';

/**
 * Maps raw JSON from Excel to the LandedCost type.
 * Handles slight variations in header naming.
 */
export function mapLandedCostData(rawJson: any[]): LandedCost[] {
  return rawJson.map((row) => ({
    month: row.Month || row.month || '',
    product: row.Product || row.product || 'Unknown',
    'CIF (Rs/MT)': Number(row['CIF (Rs/MT)'] || row.CIF || 0),
    'Duties & Taxes (Rs/MT)': Number(row['Duties & Taxes (Rs/MT)'] || row.Duties || 0),
    'Landing Cost (Rs/MT)': Number(row['Landing Cost (Rs/MT)'] || row.Total || 0),
  }));
}