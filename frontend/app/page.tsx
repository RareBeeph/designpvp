import { Container, Link, Typography } from '@mui/material';

export default function Home() {
  return (
    <Container sx={{ lineHeight: 2 }}>
      <Typography>This page intentionally left blank</Typography>
      <Typography>
        Try <Link href="/login">here</Link>
      </Typography>
    </Container>
  );
}
