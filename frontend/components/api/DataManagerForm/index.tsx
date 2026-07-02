'use client';

import CreateForm from './CreateForm';
import UpdateForm from './UpdateForm';
import { PaperProps } from '@mui/material';
import { FormikValues } from 'formik';

import { ModeProps, TableConfig } from '@/components/api/TableConfigs/types';

export function DataManagerForm<T, TRequest, TValues extends FormikValues, TWrite = T>({
  children: _children,
  config,
  mode,
  id,
  ...props
}: PaperProps &
  ModeProps & {
    config: TableConfig<T, TRequest, TValues, TWrite>;
  }) {
  return (
    config.useCreate && mode == 'create' ?
      <CreateForm config={config} useCreate={config.useCreate} {...props} />
    : id ? <UpdateForm config={config} id={id} {...props} />
    : <p>This text should not appear.</p>
  );
}
