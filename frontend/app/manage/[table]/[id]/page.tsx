'use client';

import { useQueryClient } from '@tanstack/react-query';

import {
  getEventsListQueryKey,
  getTeamsListQueryKey,
  useEventsDestroy,
  useTeamsDestroy,
} from '@/api/backend';
import { Stack } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { pascalCase } from 'text-case';

import EventManagerForm from '@/components/EventManagerForm';
import TeamManagerForm from '@/components/TeamManagerForm';
import Padding from '@/components/form/Padding';
import { StyledButton } from '@/components/form/SubmitButton';

export default function UpdateTeams() {
  const deleteTeam = useTeamsDestroy();
  const deleteEvent = useEventsDestroy();
  const { table, id }: { table: string; id: string } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <Stack rowGap={10}>
      <Stack direction={'row'} width={'100%'}>
        <Padding flex={1} />
        {table == 'teams' ?
          <TeamManagerForm mode={'update'} sx={{ flex: 2 }} />
        : <EventManagerForm mode={'update'} sx={{ flex: 2 }} />}
        <Padding flex={1} />
      </Stack>

      <Stack direction={'row'} width={'100%'}>
        <Padding flex={3} />
        <StyledButton
          color="error"
          sx={{ flex: 2 }}
          onClick={() => {
            (table == 'teams' ? deleteTeam : deleteEvent).mutate(
              { id: parseInt(id) },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: table == 'teams' ? getTeamsListQueryKey() : getEventsListQueryKey(),
                  });
                  router.push('/manage/' + table);
                },
              },
            );
          }}
        >
          Delete {pascalCase(table).slice(0, -1)}
        </StyledButton>
        <Padding flex={3} />
      </Stack>
    </Stack>
  );
}
