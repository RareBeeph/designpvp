import { Container, Stack } from '@mui/material';

import EventManagerForm from '@/components/EventManagerForm';

export default function Events() {
  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <Container sx={{ width: '40%', minWidth: 'min-content' }} maxWidth="sm">
        <EventManagerForm />
      </Container>
    </Stack>
  );
}
