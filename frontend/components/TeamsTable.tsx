'use client';

import { useEventsList, useTeamsList } from '@/api/backend';
import { Paper, PaperProps } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function TeamsTable({ children: _children, ...props }: PaperProps) {
  const teamsList = useTeamsList();
  const eventsList = useEventsList();

  return (
    <Paper style={{ minWidth: 'max-content' }} {...props}>
      <DataGrid
        columns={[
          { field: 'id', headerName: 'ID', width: 50 },
          { field: 'name', headerName: 'Name', width: 200 },
          { field: 'event', headerName: 'Event', width: 200 },
        ]}
        rows={
          teamsList.data?.map(({ id, name, event: eventId }) => {
            const event = eventsList.data?.find(event => event.id === eventId);
            return { id, name, event: event?.name };
          }) ?? []
        }
      />
    </Paper>
  );
}
