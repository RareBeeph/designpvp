import { useState } from 'react';

import { FormFieldProps, TableConfig } from './types';
import {
  Event,
  EventWrite,
  EventWriteRequest,
  Team,
  TeamNestedWrite,
  getEventsListQueryKey,
  getEventsRetrieveQueryKey,
  useEventsCreate,
  useEventsDestroy,
  useEventsList,
  useEventsRetrieve,
  useEventsUpdate,
} from '@/api/backend';
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { FieldArray } from 'formik';

import { DataManagerForm } from '@/components/Data';
import { Padding, StyledButton, StyledDateTime } from '@/components/Styled';
import { StyledForm } from '@/components/Styled';
import { StyledTextField } from '@/components/Styled';

interface EventValues {
  name: string;
  starts: Dayjs;
  ends: Dayjs;
  teams: TeamNestedWrite[];
}

const EventsConfig: TableConfig<Event, EventWriteRequest, EventValues, EventWrite> = {
  name: 'events',
  columns: [
    { accessorKey: 'id', header: 'ID', size: 0, grow: true },
    { accessorKey: 'name', header: 'Name', size: 0, grow: true },
    { accessorKey: 'starts', header: 'Starts', size: 0, grow: true },
    { accessorKey: 'ends', header: 'Ends', size: 0, grow: true },
    {
      accessorKey: 'teams',
      header: 'Teams',
      size: 0,
      grow: true,
      Cell: ({ cell }) => {
        const value = cell.getValue<Team[]>();
        return value.length > 0 ? value.map(t => t.name).reduce((p, n) => `${p}, ${n}`) : '';
      },
    },
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
      teams: data.teams,
    };
  },
  useCreate: useEventsCreate,
  useUpdate: useEventsUpdate,
  useDestroy: useEventsDestroy,
  FormFields: ({ isSubmitting, mode, values }: FormFieldProps<EventValues>) => {
    const [expanded, setExpanded] = useState<number>(0);

    const handleChange =
      (panel: number) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
        newExpanded ? setExpanded(panel) : setExpanded(-1);
      };

    return (
      <StyledForm
        header={mode.name == 'create' ? 'New Event' : `Editing Event ${mode.id}`}
        isSubmitting={isSubmitting}
      >
        <StyledTextField name="name" />
        <StyledDateTime name="starts" />
        <StyledDateTime name="ends" />
        <FieldArray
          name="teams"
          render={arrayHelpers =>
            values.teams.length > 0 ?
              values.teams.map((_team, idx) => (
                <Accordion expanded={expanded === idx} onChange={handleChange(idx)} key={idx}>
                  <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                    <Typography component="span">{`Team #${idx + 1}`}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <StyledTextField name={`teams.${idx}.name`} />
                    <Stack direction="row">
                      <Padding flex={1} />
                      <StyledButton
                        onClick={() => {
                          arrayHelpers.remove(idx);
                        }}
                      >
                        Remove Team
                      </StyledButton>
                      <StyledButton
                        onClick={event => {
                          arrayHelpers.insert(idx, '');
                          handleChange(idx + 1)(event, true);
                        }}
                      >
                        Add Team After
                      </StyledButton>
                      <Padding flex={1} />
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))
            : <Stack direction="row">
                <Padding flex={1} />
                <StyledButton
                  onClick={() => {
                    arrayHelpers.push('');
                    handleChange(0);
                  }}
                >
                  Add Team
                </StyledButton>
                <Padding flex={1} />
              </Stack>
          }
        />
      </StyledForm>
    );
  },
  initialValues: instance => {
    return {
      name: instance?.name ?? '',
      starts: dayjs(instance?.starts ?? ''),
      ends: dayjs(instance?.ends ?? ''),
      teams: instance?.teams ?? [],
    };
  },
  dataManagerForm: props => <DataManagerForm config={EventsConfig} {...props} />,
};

export default EventsConfig;
