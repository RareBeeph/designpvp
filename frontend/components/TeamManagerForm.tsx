'use client';

import { useQueryClient } from '@tanstack/react-query';

import StyledForm from './form/StyledForm';
import { StyledTextField } from './form/StyledTextField';
import { getTeamsListQueryKey, useEventsList, useTeamsCreate } from '@/api/backend';
import { MenuItem, Paper, PaperProps } from '@mui/material';
import { Field, Formik } from 'formik';
import { Select, SelectProps } from 'formik-mui';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function TeamManagerForm({ children: _children, ...props }: PaperProps) {
  const queryClient = useQueryClient();
  const createTeam = useTeamsCreate();
  const eventsList = useEventsList();
  const breakpoint = useBreakpoint();

  const onSubmit = async ({ name, eventId }: { name: string; eventId: number | '' }) => {
    if (eventId && eventsList.data?.map(event => event.id).includes(Number(eventId))) {
      createTeam.mutate(
        {
          data: { name, event: eventId },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getTeamsListQueryKey() });
          },
        },
      );
    }
  };

  return (
    <Paper {...props}>
      <Formik initialValues={{ name: '', eventId: '' }} onSubmit={onSubmit}>
        {({ isSubmitting, values }) => {
          return (
            <StyledForm header="New Team" isSubmitting={isSubmitting}>
              <StyledTextField name="name" />
              <Field
                component={({ ...props }: SelectProps) => (
                  <Select size={breakpoint.isSmall ? 'small' : 'medium'} {...props} />
                )}
                name="eventId"
                value={values.eventId}
              >
                {eventsList.data?.map(event => (
                  <MenuItem value={event.id}>{event.name}</MenuItem>
                ))}
              </Field>
            </StyledForm>
          );
        }}
      </Formik>
    </Paper>
  );
}
