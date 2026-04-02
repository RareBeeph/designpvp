import React from 'react';

import StyledForm from '../form/StyledForm';
import { StyledTextField } from '../form/StyledTextField';
import DataManagerForm from './DataManagerForm';
import { FormFieldProps, TableConfig } from './TableConfigs';
import {
  Team,
  TeamWrite,
  TeamWriteRequest,
  getTeamsListQueryKey,
  useEventsList,
  useTeamsCreate,
  useTeamsDestroy,
  useTeamsList,
  useTeamsUpdate,
} from '@/api/backend';
import { MenuItem } from '@mui/material';
import { Field } from 'formik';
import { Select, SelectProps } from 'formik-mui';

interface TeamValues {
  name: string;
  event: string;
}

export const TeamsConfig: TableConfig<Team, TeamWriteRequest, TeamValues, TeamWrite> = {
  name: 'teams',
  columns: [
    { accessorKey: 'id', header: 'ID', size: 0, grow: true },
    { accessorKey: 'name', header: 'Name', size: 0, grow: true },
    { accessorKey: 'event.name', header: 'Event', size: 0, grow: true },
  ],
  queryKey: getTeamsListQueryKey,
  useList: useTeamsList,
  parseRequest: data => {
    return {
      name: data.name,
      event: parseInt(data.event),
    };
  },
  useCreate: useTeamsCreate,
  useUpdate: useTeamsUpdate,
  useDestroy: useTeamsDestroy,
  formFields: ({ isSubmitting, values, mode, id, breakpoint }: FormFieldProps<TeamValues>) => {
    return (
      <StyledForm
        header={mode == 'create' ? 'New Team' : `Editing Team ${id}`}
        isSubmitting={isSubmitting}
      >
        <StyledTextField name="name" />
        <Field
          component={(SelectProps: SelectProps) => (
            <Select size={breakpoint.isSmall ? 'small' : 'medium'} {...SelectProps} />
          )}
          name="event"
          value={values.event}
        >
          {useEventsList().data?.map(event => (
            <MenuItem value={event.id} key={event.id}>
              {event.name}
            </MenuItem>
          ))}
        </Field>
      </StyledForm>
    );
  },
  initialValues: { name: '', event: '' },
  dataManagerForm: ({ mode, id, ...props }) => (
    <DataManagerForm config={TeamsConfig} mode={mode} id={id} {...props} />
  ),
};
