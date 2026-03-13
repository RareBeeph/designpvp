'use client';

import { Stack } from '@mui/material';

import EventManagerForm from '@/components/EventManagerForm';
import EventsTable from '@/components/EventsTable';
import Padding from '@/components/form/Padding';

export default function Events() {
  return (
    <Stack>
      <Stack direction={'row'}>
        <Padding flex={1} />
        <EventManagerForm sx={{ flex: 2 }} />
        <Padding flex={1} />
      </Stack>
      <Stack direction={'row'}>
        <Padding flex={1} />
        <EventsTable sx={{ flex: 4 }} />
        <Padding flex={1} />
      </Stack>
    </Stack>
  );
}
