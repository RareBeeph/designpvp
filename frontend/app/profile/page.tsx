'use client';

import { useProfilesList } from '@/api/backend';
import { Box, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';

import { ProfileUserDisplay } from '@/components/Profile';

import useSession from '@/hooks/useSession';

export default function Profile() {
  const session = useSession();
  const profiles = useProfilesList();
  const currentProfile = profiles.data?.find(p => p.user.id == session.data?.data.user.id);

  return (
    <Stack direction="column">
      <Paper className="no-padding" sx={{ height: '15vh' }} />
      <Stack direction="column" sx={{ px: 2 }}>
        <ProfileUserDisplay userid={String(currentProfile?.id) ?? 'undefined'} />
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
