'use client';

import { useQueryClient } from '@tanstack/react-query';

import StyledForm from './form/StyledForm';
import { StyledTextField } from './form/StyledTextField';
import { getTeamsListQueryKey, useEventsList, useTeamsCreate, useTeamsUpdate } from '@/api/backend';
import { MenuItem, Paper, PaperProps } from '@mui/material';
import { Field, Formik } from 'formik';
import { Select, SelectProps } from 'formik-mui';
import { useParams, useRouter } from 'next/navigation';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function TeamManagerForm({
  children: _children,
  mode,
  ...props
}: PaperProps & { mode: 'create' | 'update' }) {
  const queryClient = useQueryClient();
  const createTeam = useTeamsCreate();
  const updateTeam = useTeamsUpdate();
  const { slug } = useParams();
  const router = useRouter();
  const eventsList = useEventsList();
  const breakpoint = useBreakpoint();

  const onSubmit = async ({ name, eventId }: { name: string; eventId: number | '' }) => {
    switch (mode) {
      case 'create':
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
        break;
      case 'update':
        if (
          eventId &&
          eventsList.data?.map(event => event.id).includes(Number(eventId)) &&
          slug?.toString()
        ) {
          updateTeam.mutate(
            {
              id: parseInt(slug.toString()),
              data: { name, event: eventId },
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getTeamsListQueryKey() });
                router.push('/manage/teams');
              },
            },
          );
        }
    }
  };

  return (
    <Paper {...props}>
      <Formik initialValues={{ name: '', eventId: '' }} onSubmit={onSubmit}>
        {({ isSubmitting, values }) => {
          return (
            <StyledForm
              header={mode == 'create' ? 'New Team' : 'Editing Team ' + slug}
              isSubmitting={isSubmitting}
            >
              <StyledTextField name="name" />
              <Field
                component={(SelectProps: SelectProps) => (
                  <Select size={breakpoint.isSmall ? 'small' : 'medium'} {...SelectProps} />
                )}
                name="eventId"
                value={values.eventId}
              >
                {eventsList.data?.map(event => (
                  <MenuItem value={event.id} key={event.id}>
                    {event.name}
                  </MenuItem>
                ))}
              </Field>
            </StyledForm>
          );
        }}
      </Formik>
    </Paper>
  );
}
