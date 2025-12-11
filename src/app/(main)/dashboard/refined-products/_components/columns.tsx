// src/app/(main)/dashboard/refined-products/_components/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { RefinedProductImport } from './data';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

// Helper function to format currency-like numbers
const formatMT = (value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const columns: ColumnDef<RefinedProductImport>[] = [
  {
    accessorKey: 'month',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Month" />),
    cell: ({ row }) => <div className={`font-medium ${row.getValue('month') === 'Total' ? 'font-bold text-lg text-secondary-foreground' : ''}`}>{row.getValue('month')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  // Column: Jet A-1 (Fixed complex key)
  {
    id: 'JetA1',
    accessorFn: (row) => row['Jet A-1'],
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Jet A-1 (MT)" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatMT(row.getValue('JetA1'))}</div>,
  },
  // Column: Pet 92
  {
    accessorKey: 'Pet 92',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Pet 92 (MT)" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatMT(row.getValue('Pet 92'))}</div>,
  },
  // Column: Pet 95
  {
    accessorKey: 'Pet 95',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Pet 95 (MT)" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatMT(row.getValue('Pet 95'))}</div>,
  },
  // Column: Gas Oil 0.05% M.S. (Fixed problematic complex key)
  {
    id: 'GasOil005MS', 
    accessorFn: (row) => row['Gas Oil 0.05% M.S.'],
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Gas Oil 0.05% (MT)" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatMT(row.getValue('GasOil005MS'))}</div>,
  },
  // Column: Gas Oil 0.001% M.S. (Added missing column and fixed key)
  {
    id: 'GasOil0001MS', 
    accessorFn: (row) => row['Gas Oil 0.001% M.S.'],
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Gas Oil 0.001% (MT)" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatMT(row.getValue('GasOil0001MS'))}</div>,
  },
  // Column: LSFO
  {
    accessorKey: 'LSFO',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="LSFO (MT)" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatMT(row.getValue('LSFO'))}</div>,
  },
  // Column: Naphtha
  {
    accessorKey: 'Naphtha',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Naphtha (MT)" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatMT(row.getValue('Naphtha'))}</div>,
  },
  // Column: HSFO (Added missing column)
  {
    accessorKey: 'HSFO',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="HSFO (MT)" />),
    cell: ({ row }) => <div className="text-right font-mono tabular-nums">{formatMT(row.getValue('HSFO'))}</div>,
  },
  // Column: Total
  {
    accessorKey: 'total',
    header: ({ column }) => (<DataTableColumnHeader column={column} title="TOTAL (MT)" />),
    cell: ({ row }) => {
      const isTotalRow = row.getValue('month') === 'Total';
      const amount = parseFloat(row.getValue('total'));
      return (
        <div className={`text-right font-mono tabular-nums ${isTotalRow ? 'font-extrabold text-primary' : ''}`}>
          {formatMT(amount)}
        </div>
      );
    },
  },
];