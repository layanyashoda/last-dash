// src/app/(main)/dashboard/power-plant-sales/page.tsx
import { fetchPowerPlantSales } from './_components/data';
import { PowerPlantSalesDashboard } from './_components/dashboard-client';

// SERVER COMPONENT (Async function for initial data fetching)
export default async function PowerPlantSalesPage() {
    // Fetch the default year data (2025) on the server
    const initialData = await fetchPowerPlantSales('2025');

    // Pass the initial data to the client component wrapper
    return <PowerPlantSalesDashboard initialData={initialData} />;
}