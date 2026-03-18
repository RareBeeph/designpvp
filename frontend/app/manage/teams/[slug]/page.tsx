'use client';

import { useQueryClient } from '@tanstack/react-query';

import { getTeamsListQueryKey, useTeamsDestroy } from '@/api/backend';
import { Stack } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';

import TeamManagerForm from '@/components/TeamManagerForm';
import Padding from '@/components/form/Padding';
import { StyledButton } from '@/components/form/SubmitButton';

export default function UpdateTeams() {
  const deleteTeam = useTeamsDestroy();
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <Stack rowGap={10}>
      <Stack direction={'row'} width={'100%'}>
        <Padding flex={1} />
        <TeamManagerForm mode={'update'} sx={{ flex: 2 }} />
        <Padding flex={1} />
      </Stack>

      <Stack direction={'row'} width={'100%'}>
        <Padding flex={3} />
        <StyledButton
          color="error"
          sx={{ flex: 2 }}
          onClick={() => {
            if (typeof slug == 'string') {
              deleteTeam.mutate(
                { id: parseInt(slug) },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: getTeamsListQueryKey() });
                    router.push('/manage/teams');
                  },
                },
              );
            }
          }}
        >
          Delete Team
        </StyledButton>
        <Padding flex={3} />
      </Stack>
    </Stack>
  );
}
