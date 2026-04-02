'use client';

import { useQueryClient } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

import { ErrorType } from '@/api/mutator/custom-instance';
import { Alert, Paper, PaperProps, Stack } from '@mui/material';
import { Formik, FormikValues } from 'formik';
import { useRouter } from 'next/navigation';

import { ModeProps, TableConfig } from '@/components/api/TableConfigs';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function DataManagerForm<T, TRequest, TValues extends FormikValues, TWrite = T>({
  children: _children,
  config,
  mode,
  id,
  ...props
}: PaperProps &
  ModeProps & {
    config: TableConfig<T, TRequest, TValues, TWrite>;
  }) {
  const queryClient = useQueryClient();
  const create = config.useCreate();
  const update = config.useUpdate();
  const router = useRouter();
  const breakpoint = useBreakpoint();
  const [alert, setAlert] = useState<ReactNode>(<></>);

  const onError = (error: ErrorType<unknown>) => {
    setAlert(
      <Alert severity="error">
        {`${error.message}: ${error.response?.statusText}.`}
        <br />
        {`${JSON.stringify(error.response?.data)}`}
      </Alert>,
    );
  };

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
              onError,
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
                onError,
              },
            );
          }
      }
    }
  };

  return (
    <Stack {...props}>
      <Paper>
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
      {alert}
    </Stack>
  );
}
