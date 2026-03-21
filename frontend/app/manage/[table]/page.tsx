'use client';

import { JSX, useState } from 'react';

import { useEventsList, useTeamsList } from '@/api/backend';
import AddIcon from '@mui/icons-material/Add';
import { Button, Container, Fab, Modal, Stack } from '@mui/material';
import { useParams } from 'next/navigation';
import { pascalCase } from 'text-case';

import TeamManagerForm from '@/components/TeamManagerForm';
import DataTable from '@/components/api/DataTable';
import Padding from '@/components/form/Padding';

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

export default function Teams() {
  const breakpoint = useBreakpoint();
  const [open, setOpen] = useState(false);
  const { table }: { table: 'events' | 'teams' } = useParams();
  const eventsList = useEventsList();
  const teamsList = useTeamsList();

  let dataTable: JSX.Element;
  switch (table) {
    case 'teams':
      dataTable = (
        <DataTable
          data={
            teamsList.data
              ?.map(({ id, name, event: eventId }) => {
                const event = (eventsList.data ?? []).find(event => event.id === eventId);
                return { id, name, event: event?.name ?? '' };
              })
              .toSorted(({ id: idA }, { id: idB }) => idA - idB) ?? []
          }
          columns={teamsColumns}
          sx={{ flex: 4 }}
        />
      );
      break;
    case 'events':
      dataTable = (
        <DataTable data={eventsList.data ?? []} columns={eventsColumns} sx={{ flex: 4 }} />
      );
  }

  return (
    <Container disableGutters>
      <Modal
        open={open}
        onClose={() => {
          setOpen(!open);
        }}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <Stack direction={'row'} width={'100%'}>
          <Padding flex={1} />
          <TeamManagerForm mode={'create'} sx={{ flex: 2 }} />
          <Padding flex={1} />
        </Stack>
      </Modal>
      <Stack>
        <Stack direction={'row'} height={breakpoint.isXS ? 0 : 'auto'}>
          <Padding flex={1} />
          {!breakpoint.isXS ?
            <Button
              variant="contained"
              sx={{ flex: 1 }}
              onClick={() => {
                setOpen(!open);
              }}
            >
              Add New {pascalCase(table.slice(0, -1))}
            </Button>
          : <Fab
              color="primary"
              size="small"
              sx={{ position: 'relative', top: 16, left: 16 }}
              onClick={() => {
                setOpen(!open);
              }}
            >
              <AddIcon />
            </Fab>
          }
          <Padding flex={1} />
        </Stack>
        <Stack direction={'row'}>
          <Padding flex={1} />
          {dataTable}
          <Padding flex={1} />
        </Stack>
      </Stack>
    </Container>
  );
}
