// src/app/(main)/dashboard/jet-a1-sales/page.tsx
import { fetchJetA1Sales } from './_components/data';
import { JetA1SalesDashboard } from './_components/dashboard-client';

// SERVER COMPONENT (Async function for initial data fetching)
export default async function JetA1SalesPage() {
    // Fetch the default year data (2025) on the server
    const initialData = await fetchJetA1Sales('2025');

    // Pass the initial data to the client component wrapper
    return <JetA1SalesDashboard initialData={initialData} />;
}