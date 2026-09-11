'use client';

import { useQueryClient } from '@tanstack/react-query';

import { getGetAuthSessionQueryKey, useDeleteAuthSession } from '@/api/allauth';
import { getProfilesMeRetrieveQueryKey } from '@/api/backend';
import { paddingExemptClassName } from '@/app/providers';
import { Paper, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import ProfilePicture from '@/components/Profile/Picture';
import { StyledButton } from '@/components/Styled';

import { useBreakpoint } from '@/hooks';
import useSession from '@/hooks/useSession';

export default function NavUserDisplay() {
  const queryClient = useQueryClient();
  const breakpoint = useBreakpoint();
  const router = useRouter();

  const session = useSession();
  const logout = useDeleteAuthSession({
    mutation: {
      onSettled: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetAuthSessionQueryKey() });
        await queryClient.invalidateQueries({ queryKey: getProfilesMeRetrieveQueryKey() });
      },
    },
  });

  // '.' is a visible placeholder string for debug purposes
  const currentUsername =
    session.isSuccess ?
      (breakpoint.isXS ? 'Logged in as: ' : '') + (session.data?.data.user?.username ?? '.')
    : 'Not logged in';

  const usernameVariant = 'h6';
  const usernameSx = breakpoint.isXS ? { ml: 2, mr: 'auto', mt: 'auto', mb: 2 } : { ml: 2, mr: 2 };

  const pfpSizeLimits = {
    minWidth: '10px',
    minHeight: '10px',
    maxWidth: '30px',
    maxHeight: '30px',
  };

  return (
    <>
      {session.isSuccess ?
        <Link href="/profile/">
          <Paper className={paddingExemptClassName} sx={{ margin: 1, padding: 1 }}>
            <Stack direction="row">
              <Typography variant={usernameVariant} sx={usernameSx}>
                {currentUsername}
              </Typography>

              <ProfilePicture profileId="me" sx={{ ...pfpSizeLimits }} />
            </Stack>
          </Paper>
        </Link>
      : <Paper className={paddingExemptClassName} sx={{ margin: 1, padding: 1 }}>
          <Typography variant={usernameVariant} sx={usernameSx}>
            {currentUsername}
          </Typography>
        </Paper>
      }

      {session.isSuccess ?
        <StyledButton
          onClick={() => {
            logout.mutate();
          }}
        >
          Log out
        </StyledButton> // this whole thing needs a rework
      : <StyledButton
          onClick={() => {
            router.push('/login/');
          }}
        >
          Log in
        </StyledButton>
      }
    </>
  );
}
