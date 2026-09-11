import { useProfilesMeRetrieve, useProfilesRetrieve } from '@/api/backend';

import { AnyError } from '@/components/Data/Configs/types';

export default function useGetProfile(profileId?: number | 'me') {
  // Both hooks must run on every render, so the one that isn't wanted is disabled
  // rather than skipped - swapping which hook gets called breaks hook ordering.
  const isMe = profileId === 'me';
  const id = typeof profileId === 'number' ? profileId : NaN;

  // 403 (signed out) and 404 (signed in, but no profile row) are both settled answers, so
  // retrying them just delays rendering the fallback
  const retryUnlessAnswered = (failureCount: number, error: AnyError) =>
    [403, 404].includes(error.response?.status ?? 0) ? false : failureCount < 3;

  const meQuery = useProfilesMeRetrieve({
    query: { enabled: isMe, retry: retryUnlessAnswered },
  });
  const byIdQuery = useProfilesRetrieve(id, { query: { enabled: !isMe && !isNaN(id) } });

  const profileQuery = isMe ? meQuery : byIdQuery;
  const profile =
    profileQuery.isSuccess && !profileQuery.isFetching ? profileQuery.data : undefined;

  return profile;
}
