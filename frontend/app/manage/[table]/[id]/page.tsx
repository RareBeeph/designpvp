'use client';

import { useQueryClient } from '@tanstack/react-query';

import { Stack } from '@mui/material';
import { notFound, useParams, useRouter } from 'next/navigation';
import { pascalCase } from 'text-case';

import { dataConfigs } from '@/components/Data';
import { AnyConfig } from '@/components/Data/Configs/types';
import { Padding, StyledButton } from '@/components/Styled';

// See the note in ../page.tsx: the config has to exist before its hooks are called.
function UpdateTableEntryContents({
  config,
  table,
  id,
}: {
  config: AnyConfig;
  table: string;
  id: string;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const destroy = config.useDestroy();

  return (
    <Stack rowGap={10} paddingTop={2}>
      <Stack direction="row" width="100%">
        <Padding flex={1} />
        <config.dataManagerForm mode="update" sx={{ flex: 2 }} id={id} />
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
                  config.invalidateQueries(queryClient);
                  router.push('/manage/' + table);
                },
              },
            );
          }}
        >
          Delete {pascalCase(table.slice(0, -1))}
        </StyledButton>
        <Padding flex={3} />
      </Stack>
    </Stack>
  );
}

export default function UpdateTableEntry() {
  const { table, id }: { table: string; id: string } = useParams();
  const config = dataConfigs[table];

  if (!config) notFound();

  return <UpdateTableEntryContents config={config} table={table} id={id} key={table} />;
}
