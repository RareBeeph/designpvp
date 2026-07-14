'use client';

import { useGetAuthSession } from '@/api/allauth';
import { useProfilesList } from '@/api/backend';
import { AccountCircle as UserIcon } from '@mui/icons-material';
import { Box, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';

export default function Profile() {
  const session = useGetAuthSession();
  const profiles = useProfilesList();
  const _currentProfile = profiles.data?.find(p => p.user.id == session.data?.data.user.id);

  return (
    <Stack direction="column">
      <Paper className="no-padding" sx={{ height: '15vh' }} />
      <Stack direction="column" sx={{ px: 2 }}>
        <Stack direction="column" sx={{ position: 'relative' }}>
          <Paper className="no-padding" sx={{ padding: 1 }}>
            <Typography sx={{ ml: '132px' }} variant="h6">
              Lorem ipsum
            </Typography>
          </Paper>
          <Paper
            className="no-padding"
            sx={{ position: 'absolute', width: '100px', height: '100px', left: '16px' }}
            elevation={0}
          >
            <UserIcon sx={{ width: '100px', height: '100px', left: 0, top: 0 }} />
          </Paper>
          <Box>
            <Typography sx={{ ml: '132px' }}>
              Lorem ipsum dolor sit amet <br /> consectetur adipisicing elit. <br /> Consequuntur
              corporis nostrum <br /> maxime ipsam quia totam
            </Typography>
          </Box>
        </Stack>
        <Box>
          <Tabs value={0}>
            <Tab label="Profile" />
            <Tab label="Statistics" />
            <Tab label="Characters" />
            <Tab label="Attacks" />
            <Tab label="Defenses" />
          </Tabs>
          <Paper>
            <Typography>
              {' '}
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti obcaecati
              voluptatum eos recusandae numquam. Delectus consectetur beatae natus in labore
              excepturi debitis qui eius facere, inventore mollitia recusandae, eum nisi.
            </Typography>
          </Paper>
        </Box>
        <Stack direction="row" sx={{ display: 'flex' }}>
          <Paper sx={{ flex: 1 }}>
            <Typography> Links </Typography>
          </Paper>
          <Paper sx={{ flex: 1 }}>
            <Typography> Followers </Typography>
          </Paper>
        </Stack>
      </Stack>
    </Stack>
  );
}
