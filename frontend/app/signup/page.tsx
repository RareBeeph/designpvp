'use client';

import { usePostAuthSignup } from '@/api/allauth';
import { Container, Stack } from '@mui/material';

import AuthForm from '@/components/AuthForm';

export default function Signup() {
  // const oauth = () => postAuthProviderRedirect({provider: 'discord', callback_url: '/', process: 'login'})

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
        <AuthForm name="Sign up" usePostAuth={usePostAuthSignup} />
        {/* <Button variant="contained" onClick={oauth}>Discord</Button> */}
      </Container>
    </Stack>
  );
}
