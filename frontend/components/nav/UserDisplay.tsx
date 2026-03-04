import { useQueryClient } from '@tanstack/react-query';

import { StyledButton } from '../form/SubmitButton';
import {
  AuthenticationResponse,
  AuthenticationResponseStatus,
  GetAuthSessionQueryError,
  SessionGoneResponse,
  SessionGoneResponseStatus,
  getGetAuthSessionQueryKey,
  useDeleteAuthSession,
  useGetAuthSession,
} from '@/api/allauth';
import { ErrorType } from '@/api/mutator/custom-instance';
import { Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import { useBreakpoint } from '@/hooks/useBreakpoint';

type SessionQueryError = ErrorType<AuthenticationResponse | SessionGoneResponse>;
type RetryFn = (failureCount: number, error: SessionQueryError) => boolean;
type RetryValue = boolean | number | RetryFn;

export default function UserDisplay() {
  const queryClient = useQueryClient();
  const breakpoint = useBreakpoint();
  const router = useRouter();

  const retrySessionQuery = (failureCount: number, error: GetAuthSessionQueryError) => {
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
