import { useProfilesMeRetrieve, useProfilesRetrieve } from '@/api/backend';
import { defaultStackSpacing, paddingExemptClassName } from '@/app/providers';
import { AccountCircle as UserIcon } from '@mui/icons-material';
import { Box, BoxProps, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

export default function ProfileUserDisplay({
  profileId,
  ...props
}: { profileId?: number | 'me' } & BoxProps) {
  const profileQuery =
    profileId === 'me' ? useProfilesMeRetrieve() : (
      useProfilesRetrieve(profileId ?? NaN, { query: { enabled: !isNaN(profileId ?? NaN) } })
    );
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
          sx={{ flex: '1', ...pfpSizeLimits }}
          elevation={0} /* for color */
        >
          <UserIcon sx={{ width: '100%', height: '100%' }} />
        </Paper>
        <Stack direction="column" sx={{ flex: 4 }}>
          <Typography variant="h6">{profile?.user.username ?? 'n/a'}</Typography>
          <Typography>
            Last Seen:{' '}
            {profile?.user.lastLogin ? dayjs(profile?.user.lastLogin).toString() : 'undefined'}{' '}
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
