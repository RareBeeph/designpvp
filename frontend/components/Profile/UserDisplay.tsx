import { useProfilesRetrieve } from '@/api/backend';
import { AccountCircle as UserIcon } from '@mui/icons-material';
import { Box, Paper, Stack, StackProps, Typography } from '@mui/material';
import dayjs from 'dayjs';

export default function ProfileUserDisplay({ userid, ...props }: { userid: string } & StackProps) {
  const user = useProfilesRetrieve(parseInt(userid));

  return (
    <Stack direction="column" sx={{ position: 'relative' }} {...props}>
      <Paper className="no-padding" sx={{ padding: 1 }}>
        <Typography sx={{ ml: '132px' }} variant="h6">
          {user.data?.user.username ?? 'n/a'}
        </Typography>
      </Paper>
      <Paper
        className="no-padding"
        sx={{ position: 'absolute', width: '100px', height: '100px', left: '16px' }}
        elevation={0}
      >
        {/* TODO: implement file store, associate profiles with profile pictures */}
        <UserIcon sx={{ width: '100px', height: '100px', left: 0, top: 0 }} />
      </Paper>
      <Box>
        <Typography sx={{ ml: '132px' }}>
          Last Seen: {dayjs(user.data?.user.lastLogin).toString()} <br />
          Joined: {dayjs(user.data?.user.dateJoined).toString()} <br />
          Teams: {user.data?.teams.reduce((p, t) => p + `, ${t.name}`, '').slice(2)}
        </Typography>
      </Box>
    </Stack>
  );
}
