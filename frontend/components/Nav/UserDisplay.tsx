'use client';

import { useQueryClient } from '@tanstack/react-query';

import { getGetAuthSessionQueryKey, useDeleteAuthSession } from '@/api/allauth';
import { Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import { StyledButton } from '@/components/Styled';

import { useBreakpoint } from '@/hooks';
import useSession from '@/hooks/useSession';

export default function UserDisplay() {
  const queryClient = useQueryClient();
  const breakpoint = useBreakpoint();
  const router = useRouter();

  const session = useSession();
  const logout = useDeleteAuthSession({
    mutation: {
      onSettled: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetAuthSessionQueryKey() });
      },
    },
  });

  // '.' is a visible placeholder string for debug purposes
  const currentUsername =
    session.isSuccess ?
      (breakpoint.isXS ? 'Logged in as: ' : '') + (session.data?.data.user?.username ?? '.')
    : 'Not logged in';

  const usernameVariant = breakpoint.isXS ? 'h6' : 'h6';
  const usernameSx =
    breakpoint.isXS ? { ml: 2, mr: 'auto', mt: 'auto', mb: 2 } : { ml: 'auto', mr: 2 };

  return (
    <>
      <Typography variant={usernameVariant} sx={usernameSx}>
        {currentUsername}
      </Typography>

      {session.isSuccess ?
        <StyledButton
          onClick={() => {
            logout.mutate(undefined, {
              onSettled: () => {
                queryClient.invalidateQueries({ queryKey: getGetAuthSessionQueryKey() });
              },
            });
          }}
        >
          Log out
        </StyledButton> // this whole thing needs a rework
      : <StyledButton
          onClick={() => {
            router.push('/login');
          }}
        >
          Log in
        </StyledButton>
      }
    </>
  );
}
