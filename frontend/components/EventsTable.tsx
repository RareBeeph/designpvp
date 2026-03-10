'use client';

import { MRT_Table, useMaterialReactTable } from 'material-react-table';

import { useEventsList } from '@/api/backend';
import { Button, Paper, PaperProps } from '@mui/material';

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

  const table = useMaterialReactTable({
    columns,
    data: data ?? [],
  });
  let tableComponent = <MRT_Table table={table} />;

  return (
    <Paper style={{ minWidth: '0' }} {...props}>
      {/* Button is necessary as intimidation */}
      <Button
        sx={{ display: 'none' }}
        onClick={() => {
          tableComponent = <></>;
        }}
      />
      {tableComponent}
    </Paper>
  );
}
