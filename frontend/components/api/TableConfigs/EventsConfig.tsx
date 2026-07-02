import { FormFieldProps, TableConfig } from './types';
import {
  Event,
  EventRequest,
  getEventsListQueryKey,
  getEventsRetrieveQueryKey,
  useEventsCreate,
  useEventsDestroy,
  useEventsList,
  useEventsRetrieve,
  useEventsUpdate,
} from '@/api/backend';
import dayjs, { Dayjs } from 'dayjs';

import { StyledDateTime } from '@/components/StyledForm';
import { StyledForm } from '@/components/StyledForm/';
import { StyledTextField } from '@/components/StyledForm/';
import { DataManagerForm } from '@/components/api/DataManagerForm';

interface EventValues {
  name: string;
  starts: Dayjs;
  ends: Dayjs;
}

const EventsConfig: TableConfig<Event, EventRequest, EventValues> = {
  name: 'events',
  columns: [
    { accessorKey: 'id', header: 'ID', size: 0, grow: true },
    { accessorKey: 'name', header: 'Name', size: 0, grow: true },
    { accessorKey: 'starts', header: 'Starts', size: 0, grow: true },
    { accessorKey: 'ends', header: 'Ends', size: 0, grow: true },
  ],
  invalidateQueries: (queryClient, id) => {
    queryClient.invalidateQueries({ queryKey: getEventsListQueryKey() });
    queryClient.invalidateQueries({ queryKey: getEventsRetrieveQueryKey(id) });
  },
  useList: useEventsList,
  useRetrieve: useEventsRetrieve,
  parseRequest: data => {
    return {
      name: data.name,
      starts: data.starts.isValid() ? data.starts.toISOString() : '',
      ends: data.ends.isValid() ? data.ends.toISOString() : '',
    };
  },
  useCreate: useEventsCreate,
  useUpdate: useEventsUpdate,
  useDestroy: useEventsDestroy,
  formFields: ({ isSubmitting, mode, id }: FormFieldProps<EventValues>) => {
    return (
      <StyledForm
        header={mode == 'create' ? 'New Event' : `Editing Event ${id}`}
        isSubmitting={isSubmitting}
      >
        <StyledTextField name="name" />
        <StyledDateTime name="starts" />
        <StyledDateTime name="ends" />
      </StyledForm>
    );
  },
  initialValues: instance => ({
    name: instance?.name ?? '',
    starts: dayjs(instance?.starts ?? ''),
    ends: dayjs(instance?.ends ?? ''),
  }),
  dataManagerForm: ({ mode, id, ...props }) => (
    <DataManagerForm config={EventsConfig} mode={mode} id={id} {...props} />
  ),
};

export default EventsConfig;
