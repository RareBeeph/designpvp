import { Container } from '@mui/material';

export default function Home() {
  return (
    <Container sx={{ justifyContent: 'center', lineHeight: 2 }}>
      <p>This page intentionally left blank</p>
      <p>
        Try{' '}
        <a href="/login" style={{ color: 'blue' }}>
          here
        </a>
      </p>
    </Container>
  );
}
