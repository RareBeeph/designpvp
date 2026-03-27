'use client';

import { useQueryClient } from '@tanstack/react-query';

import { Paper, PaperProps } from '@mui/material';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';

import { AnyConfig } from '@/components/api/TableConfigs';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function DataManagerForm({
  children: _children,
  config,
  mode,
  id,
  ...props
}: PaperProps & { config: AnyConfig; mode: 'create' | 'update'; id?: string }) {
  const queryClient = useQueryClient();
  const create = config.useCreate();
  const update = config.useUpdate();
  const router = useRouter();
  const breakpoint = useBreakpoint();

  const onSubmit = async (data: Parameters<typeof config.parseRequest>[0]) => {
    const request = config.parseRequest(data as any);

    if (request) {
      switch (mode) {
        case 'create':
          create.mutate(
            {
              data: request as any,
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: config.queryKey() });
              },
              // would be nice to have an onError
            },
          );
          break;
        case 'update':
          if (id) {
            update.mutate(
              {
                id: parseInt(id),
                data: request as any,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: config.queryKey() });
                  router.push('/manage/' + config.name);
                },
              },
            );
          }
      }
    }
  };

  return (
    <Paper {...props}>
      <Formik initialValues={config.initialValues} onSubmit={onSubmit}>
        {({ isSubmitting, values }) => (
          <config.formFields
            isSubmitting={isSubmitting}
            values={values as any}
            mode={mode}
            id={id}
            breakpoint={breakpoint}
          />
        )}
      </Formik>
    </Paper>
  );
}
