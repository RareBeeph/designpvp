'use client';

import { paddingExemptClassName } from '../providers';
import { Box, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';

import { ProfileUserDisplay } from '@/components/Profile';

export default function Profile() {
  const bannerImageHeight = '15vh';
  const bannerImageMinHeight = '100px';

  return (
    <Stack direction="column">
      <Paper
        className={paddingExemptClassName}
        sx={{ height: bannerImageHeight, minHeight: bannerImageMinHeight }}
      />
      <Stack direction="column" sx={{ px: 2 }}>
        <ProfileUserDisplay profileId="me" />
        <Box>
          {/* This will probably be a separate component later */}
          <Tabs value={0}>
            <Tab label="Profile" />
            <Tab label="Statistics" />
            <Tab label="Characters" />
            <Tab label="Attacks" />
            <Tab label="Defenses" />
          </Tabs>
          <Paper>
            <Typography>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti obcaecati
              voluptatum eos recusandae numquam. Delectus consectetur beatae natus in labore
              excepturi debitis qui eius facere, inventore mollitia recusandae, eum nisi.
            </Typography>
          </Paper>
        </Box>
        <Stack direction="row" sx={{ display: 'flex' }}>
          {/* This will probably be a separate component later */}
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
