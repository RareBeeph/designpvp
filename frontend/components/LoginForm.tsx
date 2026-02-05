'use client';

import { useState } from 'react';

import { usePostAuthLogin } from '@/api/allauth';
import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = usePostAuthLogin();

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const isXL = useMediaQuery(theme.breakpoints.up('xl'));

  const headerVariant = isXL ? 'h4' : isSmall ? 'h6' : 'h5';
  const textFieldSize = isSmall ? 'small' : 'medium';
  const buttonSize = isSmall ? 'medium' : 'large';

  return (
    <Paper sx={{ p: { xs: 2, md: 2, xl: 2.5 } }}>
      <Stack spacing={{ xs: 1.5, md: 2, xl: 2.5 }}>
        <Typography variant={headerVariant}>Login</Typography>
        <TextField
          variant="outlined"
          label="username"
          size={textFieldSize}
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          variant="outlined"
          label="password"
          size={textFieldSize}
          onChange={e => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          size={buttonSize}
          sx={{ maxWidth: 'min-content' }}
          onClick={() => login.mutate({ data: { username, password } })}
        >
          Submit
        </Button>
      </Stack>
    </Paper>
  );
}
