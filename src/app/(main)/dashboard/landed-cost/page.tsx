// src/app/(main)/dashboard/landed-cost/page.tsx
import { fetchLandedCost } from './_components/data';
import { LandedCostDashboard } from './_components/dashboard-client';

// SERVER COMPONENT (Async function for initial data fetching)
export default async function LandedCostPage() {
    // Fetch the default year data (2025) on the server
    const initialData = await fetchLandedCost('2025');

    // Pass the initial data to the client component wrapper
    return <LandedCostDashboard initialData={initialData} />;
}