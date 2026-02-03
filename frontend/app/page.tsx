'use client';

import { QueryClient } from '@tanstack/react-query';

import styles from './page.module.css';
import { Button, Paper, TextField } from '@mui/material';
import { useState } from 'react';
import { postAuthLogin } from '@/api/allauth';

const queryClient = new QueryClient();

export default function Home() {
  let [fuck, setFuck] = useState("")
  let [shit, setShit] = useState("")

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Paper>
          <TextField variant='outlined' label='username' onChange={(e) => setFuck(e.target.value)}/>
          <TextField variant='outlined' label='password' onChange={(e) => setShit(e.target.value)}/>
        <Button variant="contained" onClick={() => postAuthLogin("browser", {username: fuck, password: shit})}>Submit</Button>
        </Paper>
      </main>
    </div>
  );
}
