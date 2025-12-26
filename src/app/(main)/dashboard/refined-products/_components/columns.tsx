import { ColumnDef } from '@tanstack/react-table';
import { RefinedProductImport } from './data';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

const formatMT = (value: any) => {
  const num = Number(value) || 0;
  return num.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) + ' MT';
};

export const columns: ColumnDef<RefinedProductImport>[] = [
  {
    accessorKey: 'month',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Month" />,
    cell: ({ row }) => <div className="font-medium">{row.original.month}</div>,
  },
  { accessorKey: 'Pet 92', header: 'Petrol 92', cell: ({ row }) => <div className="text-right">{formatMT(row.original['Pet 92'])}</div> },
  { accessorKey: 'Pet 95', header: 'Petrol 95', cell: ({ row }) => <div className="text-right">{formatMT(row.original['Pet 95'])}</div> },
  { accessorKey: 'Jet A-1', header: 'Jet / AV Gas', cell: ({ row }) => <div className="text-right">{formatMT(row.original['Jet A-1'])}</div> },
  { accessorKey: 'Gas Oil 0.05% M.S.', header: 'Auto Diesel', cell: ({ row }) => <div className="text-right">{formatMT(row.original['Gas Oil 0.05% M.S.'])}</div> },
  { accessorKey: 'Gas Oil 0.001% M.S.', header: 'Super Diesel', cell: ({ row }) => <div className="text-right">{formatMT(row.original['Gas Oil 0.001% M.S.'])}</div> },
  { accessorKey: 'LSFO', header: 'LSFO', cell: ({ row }) => <div className="text-right">{formatMT(row.original['LSFO'])}</div> },
  { accessorKey: 'HSFO', header: 'HSFO (180)', cell: ({ row }) => <div className="text-right">{formatMT(row.original['HSFO'])}</div> },
  { accessorKey: 'Naphtha', header: 'Naphtha', cell: ({ row }) => <div className="text-right">{formatMT(row.original['Naphtha'])}</div> },
  {
    accessorKey: 'total',
    header: 'Total Volume',
    cell: ({ row }) => <div className="text-right font-bold text-primary border-l pl-2">{formatMT(row.original.total)}</div>,
  },
];