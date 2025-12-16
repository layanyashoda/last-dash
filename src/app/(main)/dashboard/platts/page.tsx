// src/app/(main)/dashboard/platts/page.tsx
import { fetchPlattsPrices } from './_components/data';
import { PlattsDashboard } from './_components/dashboard-client';

// SERVER COMPONENT (Async function for initial data fetching)
export default async function PlattsPage() {
    // Fetch the default year data (2025) on the server
    const initialData = await fetchPlattsPrices('2025');

    // Pass the initial data to the client component wrapper
    return <PlattsDashboard initialData={initialData} />;
}