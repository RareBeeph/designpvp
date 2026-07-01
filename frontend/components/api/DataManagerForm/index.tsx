'use client';

import CreateForm from './CreateForm';
import UpdateForm from './UpdateForm';
import { PaperProps } from '@mui/material';
import { FormikHelpers, FormikValues } from 'formik';

import { AnyError, ModeProps, TableConfig } from '@/components/api/TableConfigs';

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
  return config.useCreate && mode == 'create' ?
      <CreateForm config={config} useCreate={config.useCreate} {...props} />
    : <UpdateForm config={config} id={id ?? '-1'} {...props} />;
}

// i don't want to export this globally, but i also don't want to hand it around as a prop or write it twice
export function onSubmitError<TValues>(
  actions: FormikHelpers<TValues>,
  newError: AnyError | undefined,
) {
  newError?.response?.data.errors?.forEach(fieldError => {
    if (fieldError.attr) actions.setFieldError(fieldError.attr, fieldError.detail);
  });
}
