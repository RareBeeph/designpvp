'use client';

import { UseMutationResult, useQueryClient } from '@tanstack/react-query';

import FormWrapper from './Wrapper';
import onSubmitError from './onSubmitError';
import { PaperProps } from '@mui/material';
import { FormikHelpers, FormikValues } from 'formik';

import { AnyError, TableConfig } from '@/components/Data/Configs/types';

export default function CreateForm<T, TRequest, TValues extends FormikValues, TWrite = T>({
  children: _children,
  config,
  useCreate, // guarantee it exists
  ...props
}: Omit<PaperProps, 'onSubmit'> & {
  config: TableConfig<T, TRequest, TValues, TWrite>;
  useCreate: () => UseMutationResult<TWrite, AnyError, { data: TRequest }>;
}) {
  const queryClient = useQueryClient();
  const create = useCreate();

  const onSubmit = async (data: TValues, actions: FormikHelpers<TValues>) => {
    const request = config.parseRequest(data);
    if (!request) return;

    create?.mutate(
      {
        data: request,
      },
      {
        onSuccess: () => config.invalidateQueries(queryClient, undefined),
        onError: newError => onSubmitError(actions, newError),
      },
    );
  };

  return (
    <FormWrapper<T, TRequest, TValues, TWrite>
      config={config}
      mode="create"
      id={undefined}
      onSubmit={onSubmit}
      initialValues={config.initialValues()}
      ready
      {...props}
    />
  );
}
