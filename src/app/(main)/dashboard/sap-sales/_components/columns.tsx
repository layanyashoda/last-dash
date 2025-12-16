// src/app/(main)/dashboard/sap-sales/_components/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { SapSalesEntry } from './data';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

const formatMT = (value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' MT';

export const columns: ColumnDef<SapSalesEntry>[] = [
  {
    accessorKey: 'month',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Month" />),
    cell: ({ row }) => <div className="font-medium">{row.original.month}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'product',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Product" />),
    cell: ({ row }) => <div className="font-medium">{row.original.product}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'sales_mt',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Sales Volume (MT)" />),
    cell: ({ row }) => {
      return (
        <div className="text-right font-mono tabular-nums text-primary">
          {formatMT(row.original.sales_mt)}
        </div>
      );
    },
  },
];