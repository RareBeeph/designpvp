'use client';

import CreateForm from './Create';
import UpdateForm from './Update';
import { PaperProps } from '@mui/material';
import { FormikValues } from 'formik';

import { ModeProps, TableConfig } from '@/components/Data/Configs/types';

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
  return (
    config.useCreate && mode == 'create' ?
      <CreateForm config={config} useCreate={config.useCreate} {...props} />
    : id ? <UpdateForm config={config} id={id} {...props} />
    : <p>This text should not appear.</p>
  );
}
