'use client';

import { Stack } from '@mui/material';

import TeamManagerForm from '@/components/TeamManagerForm';
import TeamsTable from '@/components/TeamsTable';
import Padding from '@/components/form/Padding';

export default function Teams() {
  return (
    <Stack>
      <Stack direction={'row'}>
        <Padding flex={1} />
        <TeamManagerForm sx={{ flex: 2 }} />
        <Padding flex={1} />
      </Stack>
      <Stack direction={'row'}>
        <Padding flex={1} />
        <TeamsTable sx={{ flex: 4 }} />
        <Padding flex={1} />
      </Stack>
    </Stack>
  );
}
