'use client';

import { MaterialReactTable } from 'material-react-table';

import { useEventsList, useTeamsList } from '@/api/backend';
import { PaperProps, useTheme } from '@mui/material';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function TeamsTable({ children: _children, ...props }: PaperProps) {
  const teamsList = useTeamsList();
  const eventsList = useEventsList();
  const theme = useTheme();
  const breakpoint = useBreakpoint();

  const columns = [
    { accessorKey: 'id', header: 'ID', size: parseInt(theme.spacing(6)) },
    { accessorKey: 'name', header: 'Name', size: parseInt(theme.spacing(25)) },
    { accessorKey: 'event', header: 'Event', size: parseInt(theme.spacing(25)) },
  ];

  const data =
    teamsList.data?.map(({ id, name, event: eventId }) => {
      const event = eventsList.data?.find(event => event.id === eventId);
      return { id, name, event: event?.name ?? '' };
    }) ?? [];

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
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
