import { Container, Paper } from '@mui/material';

import LoginForm from '@/components/LoginForm';

export default function Home() {
  return (
    <Container sx={{ justifyContent: 'center', my: 10, width: '50%' }}>
      <LoginForm />
    </Container>
  );
}
