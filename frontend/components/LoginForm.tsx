'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { getGetAuthSessionQueryKey, usePostAuthLogin, usePostAuthSignup } from '@/api/allauth';
import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { redirect } from 'next/navigation';

interface Props {
  name: string;
  mutation: ReturnType<typeof usePostAuthLogin> | ReturnType<typeof usePostAuthSignup>;
  onSuccess?: () => Promise<void>;
  onError?: () => Promise<void>;
}

export default function LoginForm({ name, mutation, onSuccess, onError }: Props) {
  const queryClient = useQueryClient();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const isXL = useMediaQuery(theme.breakpoints.up('xl'));

  const headerVariant = isXL ? 'h4' : isSmall ? 'h6' : 'h5';
  const textFieldSize = isSmall ? 'small' : 'medium';
  const buttonSize = isSmall ? 'medium' : 'large';

  const onClick = async () =>
    mutation.mutate(
      { data: { username, password } },
      {
        onSuccess: async () => {
          await onSuccess?.();
          await queryClient.invalidateQueries({ queryKey: getGetAuthSessionQueryKey() });
          redirect('/');
        },
        onError,
      },
    );

  return (
    <Paper sx={{ p: { xs: 2, md: 2, xl: 2.5 }, minWidth: 'max-content' }}>
      <Stack spacing={{ xs: 1.5, md: 2, xl: 2.5 }}>
        <Typography variant={headerVariant} textAlign={'center'}>
          {name}
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
          type="password"
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
