'use client';

import { useQueryClient } from '@tanstack/react-query';

import { Paper, PaperProps } from '@mui/material';
import { Formik, FormikValues } from 'formik';
import { useRouter } from 'next/navigation';

import { ModeProps, TableConfig } from '@/components/api/TableConfigs';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function DataManagerForm<T, TRequest, TValues extends FormikValues>({
  children: _children,
  config,
  mode,
  id,
  ...props
}: PaperProps & ModeProps & { config: TableConfig<T, TRequest, TValues> }) {
  const queryClient = useQueryClient();
  const create = config.useCreate();
  const update = config.useUpdate();
  const router = useRouter();
  const breakpoint = useBreakpoint();

  const onSubmit = async (data: TValues) => {
    const request = config.parseRequest(data);

    if (request) {
      switch (mode) {
        case 'create':
          create.mutate(
            {
              data: request,
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
                data: request,
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
            values={values}
            mode={mode}
            id={id}
            breakpoint={breakpoint}
          />
        )}
      </Formik>
    </Paper>
  );
}
