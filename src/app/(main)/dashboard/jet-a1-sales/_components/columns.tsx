// src/app/(main)/dashboard/jet-a1-sales/_components/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { JetA1SalesData } from './data';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

// Helper function to format liters
const formatLiters = (value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 0 });

export const columns: ColumnDef<JetA1SalesData>[] = [
  {
    accessorKey: 'month',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Month" />),
    cell: ({ row }) => <div className="font-medium">{row.original.month}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'airline',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Airline" />),
    cell: ({ row }) => <div className="font-medium">{row.original.airline}</div>,
  },
  {
    accessorKey: 'sale_liters',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Sale (LITERS)" />),
    cell: ({ row }) => {
      const amount = row.original.sale_liters;
      return (
        <div className="text-right font-mono tabular-nums">
          {formatLiters(amount)}
        </div>
      );
    },
    meta: { filterable: true },
  },
];