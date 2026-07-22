import { useProfilesRetrieve } from '@/api/backend';
import { defaultStackSpacing, paddingExemptClassName } from '@/app/providers';
import { AccountCircle as UserIcon } from '@mui/icons-material';
import { Box, Paper, Stack, StackProps, Typography } from '@mui/material';
import dayjs from 'dayjs';

export default function ProfileUserDisplay({ userid, ...props }: { userid: string } & StackProps) {
  const user = useProfilesRetrieve(parseInt(userid)); // what if parseInt returns NaN

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
    <Box sx={{ position: 'relative', ...props.sx }} {...props}>
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
        display="flex"
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
          <Typography variant="h6">{user.data?.user.username ?? 'n/a'}</Typography>
          <Typography>
            {/* ditto */}
            Last Seen: {dayjs(user.data?.user.lastLogin).toString()} <br />
            Joined: {dayjs(user.data?.user.dateJoined).toString()} <br />
            Teams: {user.data?.teams.reduce((p, t) => p + `, ${t.name}`, '').slice(2)}
          </Typography>
          {/* Probably use multiple Typographies instead of using br tags */}
        </Stack>
      </Stack>
    </Box>
  );
}
