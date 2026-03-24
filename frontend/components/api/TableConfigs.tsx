import { QueryKey, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';

import { StyledDateTime } from '../form/StyledDateTime';
import StyledForm from '../form/StyledForm';
import { StyledTextField } from '../form/StyledTextField';
import {
  Team,
  getEventsListQueryKey,
  getTeamsListQueryKey,
  useEventsCreate,
  useEventsDestroy,
  useEventsList,
  useEventsUpdate,
  useTeamsCreate,
  useTeamsDestroy,
  useTeamsList,
  useTeamsUpdate,
} from '@/api/backend';
import { MenuItem } from '@mui/material';
import dayjs from 'dayjs';
import { Field } from 'formik';
import { Select, SelectProps } from 'formik-mui';

import { Breakpoint } from '@/hooks/useBreakpoint';

export interface TableConfig {
  name: string;
  columns: MRT_ColumnDef<MRT_RowData>[];
  queryKey: () => QueryKey;
  useList: () => UseQueryResult<any[]>;
  resolveForeignKeys?: (query: UseQueryResult<any[]>) => Object[];
  useCreate: () => UseMutationResult<unknown, Error, any, unknown>;
  useUpdate: () => UseMutationResult<unknown, Error, any, unknown>;
  useDestroy: () => UseMutationResult<unknown, Error, any, unknown>;
  formFields: React.FC<any>; // component rendering the Formik fields
  initialValues: Record<string, any>;
}

export const tableConfigs: Record<string, TableConfig> = {
  teams: {
    name: 'teams',
    columns: [
      { accessorKey: 'id', header: 'ID', size: 0, grow: true },
      { accessorKey: 'name', header: 'Name', size: 0, grow: true },
      { accessorKey: 'event', header: 'Event', size: 0, grow: true },
    ],
    queryKey: getTeamsListQueryKey,
    useList: useTeamsList,
    resolveForeignKeys: (query: UseQueryResult<Team[]>) => {
      const eventsList = useEventsList();
      return (
        query.data
          ?.map(({ id, name, event: eventId }) => {
            const event = (eventsList.data ?? []).find(event => event.id === eventId);
            return { id, name, event: event?.name ?? '' };
          })
          .toSorted(({ id: idA }, { id: idB }) => idA - idB) ?? []
      );
    },
    useCreate: useTeamsCreate,
    useUpdate: useTeamsUpdate,
    useDestroy: useTeamsDestroy,
    formFields: ({
      isSubmitting,
      values,
      mode,
      id,
      breakpoint,
    }: {
      isSubmitting: boolean;
      values: { event: number | '' };
      mode: 'create' | 'update';
      id: string;
      breakpoint: Breakpoint;
    }) => {
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
  },
  events: {
    name: 'events',
    columns: [
      { accessorKey: 'id', header: 'ID', size: 0, grow: true },
      { accessorKey: 'name', header: 'Name', size: 0, grow: true },
      { accessorKey: 'starts', header: 'Starts', size: 0, grow: true },
      { accessorKey: 'ends', header: 'Ends', size: 0, grow: true },
    ],
    queryKey: getEventsListQueryKey,
    useList: useEventsList,
    useCreate: useEventsCreate,
    useUpdate: useEventsUpdate,
    useDestroy: useEventsDestroy,
    formFields: ({
      isSubmitting,
      mode,
      id,
    }: {
      isSubmitting: boolean;
      mode: 'create' | 'update';
      id: string;
    }) => {
      return (
        <StyledForm
          header={mode == 'create' ? 'New Event' : 'Editing Event ' + id}
          isSubmitting={isSubmitting}
        >
          <StyledTextField name="name" />
          <StyledDateTime name="starts" />
          <StyledDateTime name="ends" />
        </StyledForm>
      );
    },
    initialValues: { name: '', starts: dayjs(''), ends: dayjs('') },
  },
};
