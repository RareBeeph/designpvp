'use client';

import { useQueryClient } from '@tanstack/react-query';

import { usePostAuthLogin } from '@/api/allauth';
import { Container, Stack } from '@mui/material';

import LoginForm from '@/components/LoginForm';

export default function Home() {
  const queryclient = useQueryClient();
  const mutation = usePostAuthLogin({
    mutation: { onSuccess: async () => queryclient.invalidateQueries({ queryKey: ['session'] }) },
  });

  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <Container sx={{ width: '40%', minWidth: 'min-content' }} maxWidth="sm">
        <LoginForm mutation={mutation} />
      </Container>
    </Stack>
  );
}
