'use client';

import { useState } from 'react';

import styles from './page.module.css';
import { usePostAuthLogin } from '@/api/allauth';
import { Button, Paper, TextField } from '@mui/material';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = usePostAuthLogin();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Paper>
          <TextField
            variant="outlined"
            label="username"
            onChange={e => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            label="password"
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => login.mutate({ data: { username, password } })}
          >
            Submit
          </Button>
        </Paper>
      </main>
    </div>
  );
}
