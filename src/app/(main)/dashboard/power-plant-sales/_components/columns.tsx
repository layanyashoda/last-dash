// src/app/(main)/dashboard/power-plant-sales/_components/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { PowerPlantSalesEntry } from './data';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

const formatMT = (value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 0 }) + ' MT';

export const columns: ColumnDef<PowerPlantSalesEntry>[] = [
  {
    accessorKey: 'month',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Month" />),
    cell: ({ row }) => <div className="font-medium">{row.original.month}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'plant',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Power Plant" />),
    cell: ({ row }) => <div className="font-medium">{row.original.plant}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'sales_mt',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Sales Volume (MT)" />),
    cell: ({ row }) => {
      const isTotal = row.original.month === 'Total';
      return (
        <div className={`text-right font-mono tabular-nums ${isTotal ? 'font-bold text-primary' : ''}`}>
          {formatMT(row.original.sales_mt)}
        </div>
      );
    },
  },
];