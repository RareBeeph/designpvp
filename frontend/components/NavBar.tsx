'use client';
import { useQueryClient } from '@tanstack/react-query';

import {
  AuthenticationResponse,
  AuthenticationResponseStatus,
  SessionGoneResponse,
  SessionGoneResponseStatus,
  getGetAuthSessionQueryKey,
  useDeleteAuthSession,
  useGetAuthSession,
} from '@/api/allauth';
import { ErrorType } from '@/api/mutator/custom-instance';
import { AppBar, Button, Link, Toolbar, Typography } from '@mui/material';

type SessionQueryError = ErrorType<AuthenticationResponse | SessionGoneResponse>;
type RetryFn = (failureCount: number, error: SessionQueryError) => boolean;
type RetryValue = boolean | number | RetryFn;

export default function NavBar() {
  const queryClient = useQueryClient();

  const retrySessionQuery = (failureCount: number, error: SessionQueryError) => {
    const allowedCodes = [
      AuthenticationResponseStatus.number401 as number,
      SessionGoneResponseStatus.number410 as number,
    ];
    if (allowedCodes.includes(error.response?.status ?? 0)) return false;

    const { retry }: { retry?: RetryValue } = queryClient.getQueryDefaults(
      getGetAuthSessionQueryKey(),
    );
    switch (typeof retry) {
      case 'boolean':
        return retry;
      case 'number':
        return failureCount < retry;
      case 'function':
        return retry(failureCount, error);
      default:
        return failureCount < 4; // fallback
    }
  };

  const { data, error } = useGetAuthSession({
    query: {
      retry: retrySessionQuery,
    },
  });
  const logout = useDeleteAuthSession({
    mutation: {
      onSettled: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetAuthSessionQueryKey() });
      },
    },
  });

  const currentUsername = error ? 'Not logged in' : (data?.data.user?.username ?? '.'); // '.' is a visible placeholder string for debug purposes

  return (
    <AppBar position="relative">
      <Toolbar>
        <Link variant="h4" underline="none" color="inherit" href="/">
          DesignPVP
        </Link>
        <Typography variant="h6" sx={{ ml: 'auto', mr: 2 }}>
          {currentUsername}
        </Typography>
        {error ? (
          <></>
        ) : (
          <Button
            variant="contained"
            onClick={() => {
              logout.mutate();
            }}
          >
            Log out
          </Button> // this whole thing needs a rework
        )}
      </Toolbar>
    </AppBar>
  );
}
