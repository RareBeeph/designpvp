import { Container, Stack } from '@mui/material';

import TeamManagerForm from '@/components/TeamManagerForm';
import TeamsTable from '@/components/TeamsTable';

export default function Teams() {
  return (
    <Container sx={{ width: '40%', minWidth: 'min-content' }} maxWidth="sm">
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        <TeamManagerForm sx={{ width: '80%' }} />
        <TeamsTable />
      </Stack>
    </Container>
  );
}
