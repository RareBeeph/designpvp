import { StyledDateTime } from '../form/StyledDateTime';
import StyledForm from '../form/StyledForm';
import { StyledTextField } from '../form/StyledTextField';
import DataManagerForm from './DataManagerForm';
import { FormFieldProps, TableConfig } from './TableConfigs';
import {
  Event,
  EventRequest,
  EventsCreateMutationError,
  EventsDestroyMutationError,
  EventsListQueryError,
  EventsUpdateMutationError,
  getEventsListQueryKey,
  useEventsCreate,
  useEventsDestroy,
  useEventsList,
  useEventsUpdate,
} from '@/api/backend';
import dayjs, { Dayjs } from 'dayjs';

interface EventValues {
  name: string;
  starts: Dayjs;
  ends: Dayjs;
}

export const EventsConfig: TableConfig<
  Event,
  EventRequest,
  EventsListQueryError,
  EventsCreateMutationError,
  EventsUpdateMutationError,
  EventsDestroyMutationError,
  EventValues
> = {
  name: 'events',
  columns: [
    { accessorKey: 'id', header: 'ID', size: 0, grow: true },
    { accessorKey: 'name', header: 'Name', size: 0, grow: true },
    { accessorKey: 'starts', header: 'Starts', size: 0, grow: true },
    { accessorKey: 'ends', header: 'Ends', size: 0, grow: true },
  ],
  queryKey: getEventsListQueryKey,
  useList: useEventsList,
  parseRequest: data => {
    return {
      name: data.name,
      starts: data.starts.isValid() ? data.starts.toISOString() : '',
      ends: data.starts.isValid() ? data.ends.toISOString() : '',
    };
  },
  useCreate: useEventsCreate,
  useUpdate: useEventsUpdate,
  useDestroy: useEventsDestroy,
  formFields: ({ isSubmitting, mode, id }: FormFieldProps<EventValues>) => {
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
  dataManagerForm: ({ mode, id, ...props }) => (
    <DataManagerForm config={EventsConfig} mode={mode} id={id} {...props} />
  ),
};
