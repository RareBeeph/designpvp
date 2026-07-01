'use client';

import { useQueryClient } from '@tanstack/react-query';

import { onSubmitError } from '.';
import FormWrapper from './FormWrapper';
import { PaperProps } from '@mui/material';
import { FormikHelpers, FormikValues } from 'formik';
import { useRouter } from 'next/navigation';

import { TableConfig } from '@/components/api/TableConfigs';

export default function UpdateForm<T, TRequest, TValues extends FormikValues, TWrite = T>({
  children: _children,
  config,
  id,
  ...props
}: Omit<PaperProps, 'onSubmit'> & {
  id: string;
  config: TableConfig<T, TRequest, TValues, TWrite>;
}) {
  const queryClient = useQueryClient();
  const update = config.useUpdate();
  const router = useRouter();
  const thisEntry = config.useRetrieve(parseInt(id), { query: {} });

  const onSubmit = async (data: TValues, actions: FormikHelpers<TValues>) => {
    const request = config.parseRequest(data);
    if (!request) return;

    update.mutate(
      {
        id: parseInt(id),
        data: request,
      },
      {
        onSuccess: () => {
          config.invalidateQueries(queryClient, id ? parseInt(id) : undefined);
          router.push('/manage/' + config.name);
        },
        onError: newError => onSubmitError(actions, newError),
      },
    );
  };

  return (
    <FormWrapper<T, TRequest, TValues, TWrite>
      config={config}
      mode="update"
      id={id}
      onSubmit={onSubmit}
      initialValues={config.initialValues(thisEntry.data)}
      ready={!thisEntry?.isLoading && thisEntry.isSuccess}
      {...props}
    />
  );
}
