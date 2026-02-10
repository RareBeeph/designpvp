'use client';

import { useState } from 'react';

import { usePostAuthLogin, usePostAuthSignup } from '@/api/allauth';
import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

type MutationType = ReturnType<typeof usePostAuthLogin> | ReturnType<typeof usePostAuthSignup>;

export default function LoginForm(props: {
  mutation: MutationType;
  onSuccess?: () => Promise<void>;
  onError?: () => Promise<void>;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const isXL = useMediaQuery(theme.breakpoints.up('xl'));

  const headerVariant = isXL ? 'h4' : isSmall ? 'h6' : 'h5';
  const textFieldSize = isSmall ? 'small' : 'medium';
  const buttonSize = isSmall ? 'medium' : 'large';

  const onClick = async () =>
    props.mutation.mutate(
      { data: { username, password } },
      { onSuccess: props.onSuccess, onError: props.onError },
    );

  return (
    <Paper sx={{ p: { xs: 2, md: 2, xl: 2.5 }, minWidth: 'max-content' }}>
      <Stack spacing={{ xs: 1.5, md: 2, xl: 2.5 }}>
        <Typography variant={headerVariant} textAlign={'center'}>
          Login
        </Typography>
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
        <Button variant="contained" size={buttonSize} onClick={onClick}>
          Submit
        </Button>
      </Stack>
    </Paper>
  );
}
