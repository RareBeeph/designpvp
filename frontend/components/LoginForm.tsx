'use client';

import { useState } from 'react';

import { usePostAuthLogin } from '@/api/allauth';
import { Button, Paper, Stack, TextField } from '@mui/material';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = usePostAuthLogin();

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <h2>Login</h2>
        <TextField
          variant="outlined"
          label="username"
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          variant="outlined"
          label="password"
          onChange={e => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={() => login.mutate({ data: { username, password } })}>
          Submit
        </Button>
      </Stack>
    </Paper>
  );
}
