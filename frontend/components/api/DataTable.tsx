'use client';

import { MaterialReactTable } from 'material-react-table';
import { JSX } from 'react';

import { useEventsList, useTeamsList } from '@/api/backend';
import { PaperProps } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

import { useBreakpoint } from '@/hooks/useBreakpoint';

const eventsColumns = [
  { accessorKey: 'id', header: 'ID', size: 0, grow: true },
  { accessorKey: 'name', header: 'Name', size: 0, grow: true },
  { accessorKey: 'starts', header: 'Starts', size: 0, grow: true },
  { accessorKey: 'ends', header: 'Ends', size: 0, grow: true },
];

const teamsColumns = [
  { accessorKey: 'id', header: 'ID', size: 0, grow: true },
  { accessorKey: 'name', header: 'Name', size: 0, grow: true },
  { accessorKey: 'event', header: 'Event', size: 0, grow: true },
];

export default function DataTable({
  table,
  children: _children,
  ...props
}: PaperProps & { table: 'teams' | 'events' }) {
  const teamsList = useTeamsList();
  const eventsList = useEventsList();

  const breakpoint = useBreakpoint();
  const router = useRouter();
  const pathName = usePathname();

  const tableProps = {
    layoutMode: 'semantic' as 'semantic',
    muiTablePaperProps: {
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
    },
  };

  let tableComponent: JSX.Element;
  switch (table) {
    case 'teams':
      const teamsData =
        teamsList.data
          ?.map(({ id, name, event: eventId }) => {
            const event = eventsList.data?.find(event => event.id === eventId);
            return { id, name, event: event?.name ?? '' };
          })
          .toSorted(({ id: idA }, { id: idB }) => idA - idB) ?? [];
      tableComponent = (
        <MaterialReactTable
          columns={teamsColumns}
          data={teamsData}
          muiTableBodyCellProps={({ row }) => ({
            onClick: () => {
              router.push(pathName + '/' + row.getValue('id'));
            },
          })}
          {...tableProps}
        />
      );
      break;
    case 'events':
      const eventsData = eventsList.data ?? [];
      tableComponent = (
        <MaterialReactTable
          columns={eventsColumns}
          data={eventsData}
          muiTableBodyCellProps={({ row }) => ({
            onClick: () => {
              router.push(pathName + '/' + row.getValue('id'));
            },
          })}
          {...tableProps}
        />
      );
      break;
    default:
      // probably should like. 404 or something idk
      tableComponent = <></>;
  }

  return tableComponent;
}
