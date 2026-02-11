'use client';

import { usePostAuthLogin } from '@/api/allauth';
import { Container, Stack } from '@mui/material';

import LoginForm from '@/components/LoginForm';

export default function Home() {
  const mutation = usePostAuthLogin();

  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <Container sx={{ width: '40%', minWidth: 'min-content' }} maxWidth="sm">
        <LoginForm {...{ name: 'Login', mutation }} />
      </Container>
    </Stack>
  );
}
