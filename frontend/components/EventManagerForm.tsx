'use client';

import { useQueryClient } from '@tanstack/react-query';

import { getEventsListQueryKey, useEventsCreate, useEventsList } from '@/api/backend';
import { Button, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import dayjs, { Dayjs } from 'dayjs';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { DateTimePicker } from 'formik-mui-x-date-pickers';

interface Props {}

const stackSpacing = { xs: 1.5, md: 2, xl: 2.5 };
const paperPadding = { xs: 2, md: 2, xl: 2.5 };

export default function EventManagerForm({}: Props) {
  const queryClient = useQueryClient();

  const mutation = useEventsCreate();
  const query = useEventsList();

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const isXL = useMediaQuery(theme.breakpoints.up('xl'));

  const headerVariant = isXL ? 'h4' : isSmall ? 'h6' : 'h5';
  const textFieldSize = isSmall ? 'small' : 'medium';
  const buttonSize = isSmall ? 'medium' : 'large';

  const onSubmit = async (data: { name: string; starts: Dayjs; ends: Dayjs }) =>
    mutation.mutate(
      {
        data: { name: data.name, starts: data.starts.toISOString(), ends: data.ends.toISOString() },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getEventsListQueryKey() });
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
        <Formik
          initialValues={{ name: '', starts: dayjs(''), ends: dayjs('') }}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => {
            return (
              <Form>
                <Stack spacing={stackSpacing}>
                  <Typography variant={headerVariant} textAlign={'center'}>
                    New Event
                  </Typography>
                  <Field name="name" component={TextField} size={textFieldSize} label="name" />
                  <Field name="starts" component={DateTimePicker} label="starts" />
                  <Field name="ends" component={DateTimePicker} label="ends" />
                  <Button
                    variant="contained"
                    size={buttonSize}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </Stack>
              </Form>
            );
          }}
        </Formik>
      </Paper>
    </Stack>
  );
}
