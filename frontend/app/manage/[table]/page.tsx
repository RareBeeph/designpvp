'use client';

import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { Button, Container, Fab, Modal, Stack } from '@mui/material';
import { useParams } from 'next/navigation';

import TeamManagerForm from '@/components/TeamManagerForm';
import DataTable from '@/components/api/DataTable';
import Padding from '@/components/form/Padding';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function Teams() {
  const breakpoint = useBreakpoint();
  const [open, setOpen] = useState(false);
  const { table }: { table: 'events' | 'teams' } = useParams();

  return (
    <Container disableGutters>
      <Modal
        open={open}
        onClose={() => {
          setOpen(!open);
        }}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <Stack direction={'row'} width={'100%'}>
          <Padding flex={1} />
          <TeamManagerForm mode={'create'} sx={{ flex: 2 }} />
          <Padding flex={1} />
        </Stack>
      </Modal>
      <Stack>
        <Stack direction={'row'} height={breakpoint.isXS ? 0 : 'auto'}>
          <Padding flex={1} />
          {!breakpoint.isXS ?
            <Button
              variant="contained"
              sx={{ flex: 1 }}
              onClick={() => {
                setOpen(!open);
              }}
            >
              Add New Team
            </Button>
          : <Fab
              color="primary"
              size="small"
              sx={{ position: 'relative', top: 16, left: 16 }}
              onClick={() => {
                setOpen(!open);
              }}
            >
              <AddIcon />
            </Fab>
          }
          <Padding flex={1} />
        </Stack>
        <Stack direction={'row'}>
          <Padding flex={1} />
          <DataTable table={table} sx={{ flex: 4 }} />
          <Padding flex={1} />
        </Stack>
      </Stack>
    </Container>
  );
}
