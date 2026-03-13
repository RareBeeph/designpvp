'use client';

import { MaterialReactTable } from 'material-react-table';

import { useEventsList, useTeamsList } from '@/api/backend';
import { PaperProps } from '@mui/material';

import { useBreakpoint } from '@/hooks/useBreakpoint';

const columns = [
  { accessorKey: 'id', header: 'ID', size: 0, grow: true, maxSize: 100 },
  { accessorKey: 'name', header: 'Name', size: 0, grow: true },
  { accessorKey: 'event', header: 'Event', size: 0, grow: true },
];

export default function TeamsTable({ children: _children, ...props }: PaperProps) {
  const teamsList = useTeamsList();
  const eventsList = useEventsList();
  const breakpoint = useBreakpoint();

  const data =
    teamsList.data?.map(({ id, name, event: eventId }) => {
      const event = eventsList.data?.find(event => event.id === eventId);
      return { id, name, event: event?.name ?? '' };
    }) ?? [];

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      layoutMode="semantic"
      muiTablePaperProps={{
        sx: {
          display: 'block',
          minWidth: 0,
          maxWidth:
            breakpoint.isXS ? 'none'
            : breakpoint.isSmall ? '90vw'
            : '60vw',
          width: '100%',
          overflow: 'auto',
        },
        ...props,
      }}
    />
  );
}
