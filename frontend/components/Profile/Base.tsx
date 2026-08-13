import ProfileUserDisplay from './UserDisplay';
import { paddingExemptClassName } from '@/app/providers';
import { Box, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import Link from 'next/link';

import { StyledButton } from '@/components/Styled';

export default function ProfileBase({ id = 'me' }: { id?: number | 'me' }) {
  const bannerImageHeight = '15vh';
  const bannerImageMinHeight = '100px';

  return (
    <Stack direction="column">
      <Paper
        className={paddingExemptClassName}
        sx={{ height: bannerImageHeight, minHeight: bannerImageMinHeight }}
      />
      <Stack direction="column" sx={{ px: 2 }}>
        <ProfileUserDisplay profileId={id} />
        {/* Only your own profile is editable, and `me` is the only id that is
            guaranteed to be yours without fetching the session to compare */}
        {id === 'me' && (
          <Box sx={{ alignSelf: 'flex-end' }}>
            <StyledButton component={Link} href="/profile/edit">
              Edit Profile
            </StyledButton>
          </Box>
        )}
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
