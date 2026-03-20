'use client';

import { useQueryClient } from '@tanstack/react-query';

import { StyledDateTime } from './form/StyledDateTime';
import StyledForm from './form/StyledForm';
import { StyledTextField } from './form/StyledTextField';
import { getEventsListQueryKey, useEventsCreate, useEventsUpdate } from '@/api/backend';
import { Paper, PaperProps } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { Formik } from 'formik';
import { useParams, useRouter } from 'next/navigation';

export default function EventManagerForm({
  children: _children,
  mode,
  ...props
}: PaperProps & { mode: 'create' | 'update' }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { id }: { id: string } = useParams();
  const createEvent = useEventsCreate();
  const updateEvent = useEventsUpdate();

  const onSubmit = async ({ name, starts, ends }: { name: string; starts: Dayjs; ends: Dayjs }) => {
    switch (mode) {
      case 'create':
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
        break;
      case 'update':
        updateEvent.mutate(
          {
            id: parseInt(id),
            data: { name, starts: starts.toISOString(), ends: ends.toISOString() },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: getEventsListQueryKey() });
              router.push('/manage/events')
            },
          },
        );
    }
  };

  return (
    <Paper {...props}>
      <Formik initialValues={{ name: '', starts: dayjs(''), ends: dayjs('') }} onSubmit={onSubmit}>
        {({ isSubmitting }) => {
          return (
            <StyledForm header={mode == 'create' ? "New Event" : "Editing Event "+id} isSubmitting={isSubmitting}>
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
