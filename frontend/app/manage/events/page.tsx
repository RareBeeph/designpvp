'use client';

import { Container, Stack } from '@mui/material';

import EventManagerForm from '@/components/EventManagerForm';
import EventsTable from '@/components/EventsTable';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function Events() {
  const breakpoint = useBreakpoint();

  return (
    <Container sx={{ width: '40%', minWidth: 'min-content' }} maxWidth="sm">
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        <EventManagerForm sx={{ width: breakpoint.isXS ? '100%' : '80%' }} />
        <EventsTable />
      </Stack>
    </Container>
  );
}
