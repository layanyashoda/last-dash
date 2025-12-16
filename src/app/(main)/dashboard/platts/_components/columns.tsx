// src/app/(main)/dashboard/platts/_components/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { PlattsPrice } from './data';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

const formatUSD = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const columns: ColumnDef<PlattsPrice>[] = [
  {
    accessorKey: 'month',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Month" />),
    cell: ({ row }) => <div className="font-medium">{row.original.month}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'Jet Kero (USD/BBL)',
    id: 'JetKero',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Jet Kero ($/BBL)" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatUSD(row.original['Jet Kero (USD/BBL)'])}</div>,
  },
  {
    accessorKey: 'Gasoline 92 (USD/BBL)',
    id: 'Gas92',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Gas 92 ($/BBL)" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatUSD(row.original['Gasoline 92 (USD/BBL)'])}</div>,
  },
  {
    accessorKey: 'Gasoline 95 (USD/BBL)',
    id: 'Gas95',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Gas 95 ($/BBL)" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatUSD(row.original['Gasoline 95 (USD/BBL)'])}</div>,
  },
  {
    accessorKey: 'Gasoil 0.05% (USD/BBL)',
    id: 'Gasoil005',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Gasoil 0.05% ($/BBL)" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatUSD(row.original['Gasoil 0.05% (USD/BBL)'])}</div>,
  },
  {
    accessorKey: 'Naphtha (USD/BBL)',
    id: 'Naphtha',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Naphtha ($/BBL)" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatUSD(row.original['Naphtha (USD/BBL)'])}</div>,
  },
  {
    accessorKey: 'FO 380 CST (USD/MT)',
    id: 'FO380CST',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="FO 380 CST ($/MT)" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatUSD(row.original['FO 380 CST (USD/MT)'])}</div>,
  },
];