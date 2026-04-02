'use client';

import { usePostAuthLogin } from '@/api/allauth';
import { Container, Stack } from '@mui/material';

import AuthForm from '@/components/AuthForm';

export default function Login() {
  return (
    <Stack
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 'calc(100% - 70px)', // bluh
      }}
    >
      <Container sx={{ width: '40%', minWidth: 'min-content' }} maxWidth="sm">
        <AuthForm name="Login" usePostAuth={usePostAuthLogin} />
      </Container>
    </Stack>
  );
}
