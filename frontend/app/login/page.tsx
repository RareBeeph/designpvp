import { Container } from '@mui/material';

import LoginForm from '@/components/LoginForm';

export default function Home() {
  return (
    <Container sx={{ justifyContent: 'center', my: 10, width: { xs: 300, md: 400, xl: 500 } }}>
      <LoginForm />
    </Container>
  );
}
