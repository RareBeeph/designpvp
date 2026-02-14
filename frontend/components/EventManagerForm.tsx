'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { getEventsListQueryKey, useEventsCreate, useEventsList } from '@/api/backend';
import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

interface Props {}

const stackSpacing = { xs: 1.5, md: 2, xl: 2.5 };
const paperPadding = { xs: 2, md: 2, xl: 2.5 };

export default function EventManagerForm({}: Props) {
  const queryClient = useQueryClient();

  const mutation = useEventsCreate();
  const query = useEventsList();

  const [name, setName] = useState('');
  const [starts, setStarts] = useState('');
  const [ends, setEnds] = useState('');

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const isXL = useMediaQuery(theme.breakpoints.up('xl'));

  const headerVariant = isXL ? 'h4' : isSmall ? 'h6' : 'h5';
  const textFieldSize = isSmall ? 'small' : 'medium';
  const buttonSize = isSmall ? 'medium' : 'large';

  const onClick = async () =>
    mutation.mutate(
      { data: { name, starts, ends } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getEventsListQueryKey() });
          setName('');
          setStarts('');
          setEnds('');
        },
      },
    );

  return (
    <Stack spacing={stackSpacing} alignItems="center">
      <Paper sx={{ p: paperPadding, minWidth: 'max-content' }}>
        <DataGrid
          columns={[
            { field: 'id', headerName: 'ID', width: 50 },
            { field: 'name', headerName: 'Name', width: 200 },
            { field: 'starts', headerName: 'Starts', width: 200 },
            { field: 'ends', headerName: 'Ends', width: 200 },
          ]}
          rows={
            query.data
              ?.entries()
              .toArray()
              .map(([_idx, entry]) => entry) ?? []
          }
        />
      </Paper>
      <Paper sx={{ p: paperPadding, minWidth: 'max-content', width: '80%' }}>
        <Stack spacing={stackSpacing}>
          <Typography variant={headerVariant} textAlign={'center'}>
            New Event
          </Typography>
          <TextField
            variant="outlined"
            label="name"
            size={textFieldSize}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <DateTimePicker
            label="starts"
            value={dayjs(starts)}
            onChange={e => setStarts(e?.toISOString() ?? '')}
          />
          <DateTimePicker
            label="ends"
            value={dayjs(ends)}
            onChange={e => setEnds(e?.toISOString() ?? '')}
          />
          <Button variant="contained" size={buttonSize} onClick={onClick}>
            Submit
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
