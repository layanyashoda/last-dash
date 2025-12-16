// src/app/(main)/dashboard/sap-sales/page.tsx
import { fetchSapSales } from './_components/data';
import { SapSalesDashboard } from './_components/dashboard-client';

// SERVER COMPONENT (Async function for initial data fetching)
export default async function SapSalesPage() {
    // Fetch the default year data (2025) on the server
    const initialData = await fetchSapSales('2025');

    // Pass the initial data to the client component wrapper
    return <SapSalesDashboard initialData={initialData} />;
}