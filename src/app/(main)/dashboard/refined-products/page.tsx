// src/app/(main)/dashboard/refined-products/page.tsx

import { fetchRefinedProductImports } from './_components/data';
import { RefinedProductsDashboard } from './_components/dashboard-client'; // Import the new client component

// SERVER COMPONENT (Async function for initial data fetching)
export default async function RefinedProductsPage() {
    // 1. Fetch the default year data (2025) on the server
    const initialData = await fetchRefinedProductImports('2025');

    // 2. Pass the initial data to the client component wrapper
    return <RefinedProductsDashboard initialData={initialData} />;
}