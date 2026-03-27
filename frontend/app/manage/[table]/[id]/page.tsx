'use client';

import { useQueryClient } from '@tanstack/react-query';

import { Stack } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { pascalCase } from 'text-case';

import DataManagerForm from '@/components/api/DataManagerForm';
import { tableConfigs } from '@/components/api/TableConfigs';
import Padding from '@/components/form/Padding';
import { StyledButton } from '@/components/form/SubmitButton';

export default function UpdateTeams() {
  const { table, id }: { table: string; id: string } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  const destroy = tableConfigs[table].useDestroy();

  return (
    <Stack rowGap={10}>
      <Stack direction="row" width="100%">
        <Padding flex={1} />
        <DataManagerForm config={tableConfigs[table]} mode="update" sx={{ flex: 2 }} id={id} />
        <Padding flex={1} />
      </Stack>

      <Stack direction="row" width="100%">
        <Padding flex={3} />
        <StyledButton
          color="error"
          sx={{ flex: 2 }}
          onClick={() => {
            destroy.mutate(
              { id: parseInt(id) },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: tableConfigs[table].queryKey(),
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
