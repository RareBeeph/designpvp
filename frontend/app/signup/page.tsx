'use client';

import { usePostAuthSignup } from '@/api/allauth';
import { Container, Stack } from '@mui/material';

import AuthForm from '@/components/AuthForm';

export default function Home() {
  const mutation = usePostAuthSignup();

  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <Container sx={{ width: '40%', minWidth: 'min-content' }} maxWidth="sm">
        <AuthForm {...{ name: 'Sign up', mutation }} />
      </Container>
    </Stack>
  );
}
