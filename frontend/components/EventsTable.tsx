'use client';

import { MaterialReactTable } from 'material-react-table';

import { useEventsList } from '@/api/backend';
import { PaperProps } from '@mui/material';

import { useBreakpoint } from '@/hooks/useBreakpoint';

const columns = [
  { accessorKey: 'id', header: 'ID', size: 50 },
  { accessorKey: 'name', header: 'Name', size: 200 },
  { accessorKey: 'starts', header: 'Starts', size: 200 },
  { accessorKey: 'ends', header: 'Ends', width: 200 },
];

export default function EventsTable({ children: _children, ...props }: PaperProps) {
  const { data } = useEventsList({
    query: { placeholderData: [] },
  });

  const breakpoint = useBreakpoint();

  return (
    <MaterialReactTable
      columns={columns}
      data={data ?? []}
      muiTablePaperProps={{
        sx: {
          display: 'block',
          minWidth: 0,
          maxWidth: breakpoint.isSmall ? '90vw' : '60vw',
          overflow: 'scroll',
        },
        ...props,
      }}
    />
  );
}
