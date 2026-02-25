'use client';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import NavDrawer from './Drawer';
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
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, IconButton, Link, Toolbar, Typography } from '@mui/material';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';

type SessionQueryError = ErrorType<AuthenticationResponse | SessionGoneResponse>;
type RetryFn = (failureCount: number, error: SessionQueryError) => boolean;
type RetryValue = boolean | number | RetryFn;

export default function NavBar() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const breadcrumbs = useSelectedLayoutSegments();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(prevState => !prevState);
  };

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

  const session = useGetAuthSession({
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

  const currentUsername = session.isSuccess
    ? (session.data?.data.user?.username ?? '.')
    : 'Not logged in'; // '.' is a visible placeholder string for debug purposes

  return (
    <Box>
      <AppBar position="relative" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Link variant="h4" underline="none" color="inherit" href="/">
            DesignPVP
          </Link>
          <Typography variant="h6" sx={{ ml: 'auto', mr: 2 }}>
            {currentUsername}
          </Typography>
          {session.isSuccess ? (
            <Button
              variant="contained"
              onClick={() => {
                logout.mutate(undefined, {
                  onSettled: () => {
                    queryClient.invalidateQueries({ queryKey: getGetAuthSessionQueryKey() });
                  },
                });
              }}
            >
              Log out
            </Button> // this whole thing needs a rework
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                router.push('/login');
              }}
            >
              Log in
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <NavDrawer open={drawerOpen} onClose={handleDrawerToggle} {...{ breadcrumbs }} />
    </Box>
  );
}
