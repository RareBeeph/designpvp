import StyledForm from '../form/StyledForm';
import { StyledTextField } from '../form/StyledTextField';
import { FormFieldProps, TableConfig } from './TableConfigs';
import {
  Team,
  TeamRequest,
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
  eventId: string;
}

export const TeamsConfig: TableConfig<Team, TeamRequest, TeamValues> = {
  name: 'teams',
  columns: [
    { accessorKey: 'id', header: 'ID', size: 0, grow: true },
    { accessorKey: 'name', header: 'Name', size: 0, grow: true },
    { accessorKey: 'event', header: 'Event', size: 0, grow: true },
  ],
  queryKey: getTeamsListQueryKey,
  useList: useTeamsList,
  parseRequest: data => {
    return {
      name: data.name,
      eventId: parseInt(data.eventId),
    };
  },
  useCreate: useTeamsCreate,
  useUpdate: useTeamsUpdate,
  useDestroy: useTeamsDestroy,
  formFields: ({ isSubmitting, values, mode, id, breakpoint }: FormFieldProps<TeamValues>) => {
    return (
      <StyledForm
        header={mode == 'create' ? 'New Team' : 'Editing Team ' + id}
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
          {useEventsList().data?.map(event => (
            <MenuItem value={event.id} key={event.id}>
              {event.name}
            </MenuItem>
          ))}
        </Field>
      </StyledForm>
    );
  },
  initialValues: { name: '', eventId: '' },
};
