import { Container, Link, Stack, Typography } from '@mui/material';

export default function Manage() {
  return (
    <Container sx={{ lineHeight: 2 }}>
      <Typography>This page intentionally left blank</Typography>
      <Stack spacing={0}>
        <Link href="/manage/events">events</Link>
        <Link href="/manage/teams">teams</Link>
      </Stack>
    </Container>
  );
}
