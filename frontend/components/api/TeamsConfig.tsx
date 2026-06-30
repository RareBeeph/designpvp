import React from 'react';

import StyledForm from '../form/StyledForm';
import StyledSelectField from '../form/StyledSelectField';
import { StyledTextField } from '../form/StyledTextField';
import DataManagerForm from './DataManagerForm';
import { FormFieldProps, TableConfig } from './TableConfigs';
import {
  Team,
  TeamWrite,
  TeamWriteRequest,
  getTeamsListQueryKey,
  getTeamsRetrieveQueryKey,
  useEventsList,
  useTeamsCreate,
  useTeamsDestroy,
  useTeamsList,
  useTeamsRetrieve,
  useTeamsUpdate,
} from '@/api/backend';

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
  invalidateQueries: (queryClient, id) => {
    queryClient.invalidateQueries({ queryKey: getTeamsListQueryKey() });
    queryClient.invalidateQueries({ queryKey: getTeamsRetrieveQueryKey(id) });
  },
  useList: useTeamsList,
  useRetrieve: useTeamsRetrieve,
  parseRequest: data => {
    return {
      name: data.name,
      event: parseInt(data.event),
    };
  },
  useCreate: useTeamsCreate,
  useUpdate: useTeamsUpdate,
  useDestroy: useTeamsDestroy,
  formFields: ({ isSubmitting, values, mode, id }: FormFieldProps<TeamValues>) => {
    return (
      <StyledForm
        header={mode == 'create' ? 'New Team' : `Editing Team ${id}`}
        isSubmitting={isSubmitting}
      >
        <StyledTextField name="name" />
        <StyledSelectField name="event" value={values.event} data={useEventsList().data ?? []} />
      </StyledForm>
    );
  },
  initialValues: instance => ({
    name: instance?.name ?? '',
    event: instance?.event.id.toString() ?? '',
  }),
  dataManagerForm: ({ mode, id, ...props }) => (
    <DataManagerForm config={TeamsConfig} mode={mode} id={id} {...props} />
  ),
};
