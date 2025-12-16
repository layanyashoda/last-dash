// src/app/(main)/dashboard/oil-balance/page.tsx
import { fetchOilBalance } from './_components/data';
import { OilBalanceDashboard } from './_components/dashboard-client';

// SERVER COMPONENT (Async function for initial data fetching)
export default async function OilBalancePage() {
    // Fetch the default year data (2025) on the server
    const initialData = await fetchOilBalance('2025');

    // Pass the initial data to the client component wrapper
    return <OilBalanceDashboard initialData={initialData} />;
}