import { useQueryClient } from '@tanstack/react-query';

import {
  AuthenticationResponse,
  AuthenticationResponseStatus,
  GetAuthSessionQueryError,
  SessionGoneResponse,
  SessionGoneResponseStatus,
  getGetAuthSessionQueryKey,
  useGetAuthSession,
} from '@/api/allauth';
import { ErrorType } from '@/api/mutator/custom-instance';

type SessionQueryError = ErrorType<AuthenticationResponse | SessionGoneResponse>;
type RetryFn = (failureCount: number, error: SessionQueryError) => boolean;
type RetryValue = boolean | number | RetryFn;

export default function useSession() {
  const queryClient = useQueryClient();

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

  return useGetAuthSession({
    query: {
      retry: retrySessionQuery,
    },
  });
}
