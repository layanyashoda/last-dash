// src/app/(main)/dashboard/landed-cost/_components/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { LandedCost } from './data';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

const formatRs = (value: number) => `Rs ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const columns: ColumnDef<LandedCost>[] = [
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
    accessorKey: 'CIF (Rs/MT)',
    id: 'CIF',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="CIF (Rs/MT)" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatRs(row.original['CIF (Rs/MT)'])}</div>,
  },
  {
    accessorKey: 'Duties & Taxes (Rs/MT)',
    id: 'DutiesAndTaxes',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Duties & Taxes (Rs/MT)" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatRs(row.original['Duties & Taxes (Rs/MT)'])}</div>,
  },
  {
    accessorKey: 'Landing Cost (Rs/MT)',
    id: 'LandedCost',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Final Landed Cost (Rs/MT)" />),
    cell: ({ row }) => <div className="text-right font-bold font-mono tabular-nums text-primary">{formatRs(row.original['Landing Cost (Rs/MT)'])}</div>,
  },
];