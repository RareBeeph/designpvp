'use client';

import { useQueryClient } from '@tanstack/react-query';

import { Paper, PaperProps, Stack } from '@mui/material';
import { Formik, FormikHelpers, FormikValues } from 'formik';
import { useRouter } from 'next/navigation';

import { AnyError, ModeProps, TableConfig } from '@/components/api/TableConfigs';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function DataManagerForm<
  T,
  TRequest,
  TListError extends AnyError,
  TCreateError extends AnyError,
  TUpdateError extends AnyError,
  TDestroyError extends AnyError,
  TValues extends FormikValues,
  TWrite = T,
>({
  children: _children,
  config,
  mode,
  id,
  ...props
}: PaperProps &
  ModeProps & {
    config: TableConfig<
      T,
      TRequest,
      TListError,
      TCreateError,
      TUpdateError,
      TDestroyError,
      TValues,
      TWrite
    >;
  }) {
  const queryClient = useQueryClient();
  const create = config.useCreate();
  const update = config.useUpdate();
  const router = useRouter();
  const breakpoint = useBreakpoint();

  const onSubmit = async (data: TValues, actions: FormikHelpers<TValues>) => {
    const request = config.parseRequest(data);

    const onSubmitError = (
      newError: TListError | TCreateError | TUpdateError | TDestroyError | undefined,
    ) => {
      newError?.response?.data.errors?.forEach(fieldError => {
        if (fieldError.attr) actions.setFieldError(fieldError.attr, fieldError.detail);
      });
    };

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
              onError: onSubmitError,
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
                onError: onSubmitError,
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
          {formikProps => (
            <config.formFields mode={mode} id={id} breakpoint={breakpoint} {...formikProps} />
          )}
        </Formik>
      </Paper>
    </Stack>
  );
}
