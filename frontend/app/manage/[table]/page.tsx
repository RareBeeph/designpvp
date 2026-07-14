'use client';

import { useState } from 'react';

import { Add as AddIcon } from '@mui/icons-material';
import { Button, Container, Fab, Modal, Stack } from '@mui/material';
import { useParams } from 'next/navigation';
import { pascalCase } from 'text-case';

import { DataTable } from '@/components/Data';
import { dataConfigs } from '@/components/Data';
import { Padding } from '@/components/Styled';

import { useBreakpoint } from '@/hooks';

export default function ManageTable() {
  const breakpoint = useBreakpoint();
  const [open, setOpen] = useState(false);
  const { table }: { table: string } = useParams();
  const config = dataConfigs[table];
  const listData = config?.useList().data ?? [];

  return (
    <Container disableGutters sx={{ paddingTop: 2 }}>
      {config?.useCreate && (
        <Modal
          open={open}
          onClose={() => {
            setOpen(!open);
          }}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Stack direction="row" width="100%">
            <Padding flex={1} />
            {config && <config.dataManagerForm mode="create" sx={{ flex: 2 }} />}
            <Padding flex={1} />
          </Stack>
        </Modal>
      )}
      <Stack>
        {config?.useCreate && (
          <Stack direction="row" height={breakpoint.isXS ? 0 : 'auto'}>
            <Padding flex={1} />
            {!breakpoint.isXS ?
              <Button
                variant="contained"
                sx={{ flex: 1 }}
                onClick={() => {
                  setOpen(!open);
                }}
              >
                Add New {pascalCase(table.slice(0, -1))}
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
        )}
        <Stack direction="row">
          <Padding flex={1} />
          <DataTable data={listData} columns={config?.columns ?? []} sx={{ flex: 4 }} />
          <Padding flex={1} />
        </Stack>
      </Stack>
    </Container>
  );
}
