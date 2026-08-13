import { useProfilesMeRetrieve, useProfilesRetrieve } from '@/api/backend';
import { defaultStackSpacing, paddingExemptClassName } from '@/app/providers';
import { AccountCircle as UserIcon } from '@mui/icons-material';
import { Box, BoxProps, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { AnyError } from '@/components/Data/Configs/types';

export default function ProfileUserDisplay({
  profileId,
  ...props
}: { profileId?: number | 'me' } & BoxProps) {
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

  const pfpSizeLimits = {
    minWidth: '100px',
    minHeight: '100px',
    maxWidth: '200px',
    maxHeight: '200px',
  };

  // header padding equals half of stack spacing so the text appears centered
  const headerPadding = Object.fromEntries(
    Object.entries<number>(defaultStackSpacing).map(([key, value]) => [key, value / 2]),
  );

  return (
    <Box {...props} sx={{ position: 'relative', ...props.sx }}>
      <Paper
        className={paddingExemptClassName} // exempt this paper from the default padding set on the provider so we can set it to something else
        sx={{ padding: headerPadding, width: '100%', position: 'absolute', zIndex: 0 }}
      >
        <Typography variant="h6">
          <br /> {/* size the paper as though there were one line of text */}
        </Typography>
      </Paper>
      <Stack
        direction="row"
        alignItems="flex-start"
        position="relative"
        zIndex={10}
        sx={{ padding: headerPadding }}
      >
        <Paper
          className={paddingExemptClassName}
          sx={{ flex: '1', ...pfpSizeLimits, overflow: 'hidden' }}
          elevation={0} /* for color */
        >
          {profile?.avatar ?
            <Box
              component="img"
              src={profile.avatar}
              alt={`${profile.user.username}'s avatar`}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          : <UserIcon sx={{ width: '100%', height: '100%' }} />}
        </Paper>
        <Stack direction="column" sx={{ flex: 4 }}>
          <Typography variant="h6">{profile?.user.username ?? 'n/a'}</Typography>
          <Typography>
            Last Seen: (not implemented)
            <br />
            Joined:{' '}
            {profile?.user.dateJoined ?
              dayjs(profile?.user.dateJoined).toString()
            : 'undefined'}{' '}
            <br />
            Teams: {profile?.teams.map(t => t.name).join(', ')}
          </Typography>
          {/* Probably use multiple Typographies instead of using br tags */}
        </Stack>
      </Stack>
    </Box>
  );
}
