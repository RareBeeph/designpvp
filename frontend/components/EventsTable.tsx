'use client';

import { useEventsList } from '@/api/backend';
import { Paper, PaperProps } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function EventsTable({ children: _children, ...props }: PaperProps) {
  const eventsList = useEventsList();

  return (
    <Paper style={{ minWidth: 'max-content' }} {...props}>
      <DataGrid
        columns={[
          { field: 'id', headerName: 'ID', width: 50 },
          { field: 'name', headerName: 'Name', width: 200 },
          { field: 'starts', headerName: 'Starts', width: 200 },
          { field: 'ends', headerName: 'Ends', width: 200 },
        ]}
        rows={eventsList.data ?? []}
      />
    </Paper>
  );
}
