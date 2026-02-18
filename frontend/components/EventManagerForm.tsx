'use client';

import { useQueryClient } from '@tanstack/react-query';

import { StyledDateTime } from './form/StyledDateTime';
import StyledForm from './form/StyledForm';
import { StyledTextField } from './form/StyledTextField';
import { getEventsListQueryKey, useEventsCreate } from '@/api/backend';
import { Paper, PaperProps } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { Formik } from 'formik';

export default function EventManagerForm({ children: _children, ...props }: PaperProps) {
  const queryClient = useQueryClient();
  const createEvent = useEventsCreate();

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
    <Paper {...props}>
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
    </Paper>
  );
}
