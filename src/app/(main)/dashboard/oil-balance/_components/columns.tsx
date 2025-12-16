// src/app/(main)/dashboard/oil-balance/_components/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { OilBalanceEntry } from './data';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

const formatMT = (value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 0 }) + ' MT';

export const columns: ColumnDef<OilBalanceEntry>[] = [
  {
    accessorKey: 'month',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Month" />),
    cell: ({ row }) => <div className="font-medium">{row.original.month}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'Crude Oil Input (MT)',
    id: 'CrudeInput',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Crude Input" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatMT(row.original['Crude Oil Input (MT)'])}</div>,
  },
  {
    accessorKey: 'Refinery Production (MT)',
    id: 'RefineryProduction',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Production" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatMT(row.original['Refinery Production (MT)'])}</div>,
  },
  {
    accessorKey: 'Refined Product Imports (MT)',
    id: 'Imports',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Imports" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatMT(row.original['Refined Product Imports (MT)'])}</div>,
  },
  {
    accessorKey: 'Total Sales (MT)',
    id: 'Sales',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Total Sales" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums text-primary">{formatMT(row.original['Total Sales (MT)'])}</div>,
  },
  {
    accessorKey: 'Total Own Use & Loss (MT)',
    id: 'Loss',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Own Use & Loss" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatMT(row.original['Total Own Use & Loss (MT)'])}</div>,
  },
  {
    accessorKey: 'Stock Change (MT)',
    id: 'StockChange',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Stock Change" />),
    cell: ({ row }) => {
        const value = row.original['Stock Change (MT)'];
        return <div className={`text-right font-mono tabular-nums ${value < 0 ? 'text-red-500' : 'text-green-500'}`}>{formatMT(value)}</div>
    },
  },
];