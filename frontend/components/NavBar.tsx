'use client';
import { useQueryClient } from '@tanstack/react-query';

import { useDeleteAuthSession, useGetAuthSession } from '@/api/allauth';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';

export default function NavBar() {
  const queryClient = useQueryClient();
  const { data, error } = useGetAuthSession({ query: { queryKey: ['session'], retry: false } });
  const logout = useDeleteAuthSession({
    mutation: {
      onSettled: async () => {
        await queryClient.invalidateQueries({ queryKey: ['session'] });
      },
    },
  });

  const currentUsername = error ? 'Not logged in' : (data?.data.user?.username ?? '.'); // '.' is a visible placeholder string for debug purposes

  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h4">DesignPVP</Typography>
        <Typography variant="h6" sx={{ ml: 'auto', mr: 2 }}>
          {currentUsername}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            logout.mutate();
          }}
        >
          Log out
        </Button>
      </Toolbar>
    </AppBar>
  );
}
