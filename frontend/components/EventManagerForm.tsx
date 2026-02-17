'use client';

import { useQueryClient } from '@tanstack/react-query';

import { StyledDateTime } from './form/StyledDateTime';
import StyledForm from './form/StyledForm';
import StyledPaper from './form/StyledPaper';
import StyledStack from './form/StyledStack';
import { StyledTextField } from './form/StyledTextField';
import { getEventsListQueryKey, useEventsCreate, useEventsList } from '@/api/backend';
import { DataGrid } from '@mui/x-data-grid';
import dayjs, { Dayjs } from 'dayjs';
import { Formik } from 'formik';

export default function EventManagerForm() {
  const queryClient = useQueryClient();
  const createEvent = useEventsCreate();
  const eventsList = useEventsList();

  const onSubmit = async ({ name, starts, ends }: { name: string; starts: Dayjs; ends: Dayjs }) =>
    createEvent.mutate(
      {
        data: { name, starts: starts.toISOString(), ends: ends.toISOString() },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getEventsListQueryKey() });
        },
      },
    );

  return (
    <StyledStack alignItems="center">
      <StyledPaper sx={{ minWidth: 'max-content' }}>
        <DataGrid
          columns={[
            { field: 'id', headerName: 'ID', width: 50 },
            { field: 'name', headerName: 'Name', width: 200 },
            { field: 'starts', headerName: 'Starts', width: 200 },
            { field: 'ends', headerName: 'Ends', width: 200 },
          ]}
          rows={
            eventsList.data
              ?.entries()
              .toArray()
              .map(([_idx, entry]) => entry) ?? []
          }
        />
      </StyledPaper>
      <StyledPaper sx={{ minWidth: 'max-content', width: '80%' }}>
        <Formik initialValues={{ name: '', starts: dayjs(''), ends: dayjs('') }} {...{ onSubmit }}>
          {({ isSubmitting }) => {
            return (
              <StyledForm header="New Event" {...{ isSubmitting }}>
                <StyledTextField name="name" />
                <StyledDateTime name="starts" />
                <StyledDateTime name="ends" />
              </StyledForm>
            );
          }}
        </Formik>
      </StyledPaper>
    </StyledStack>
  );
}
