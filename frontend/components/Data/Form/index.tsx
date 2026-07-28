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
  ...props
}: PaperProps &
  ModeProps & {
    config: TableConfig<T, TRequest, TValues, TWrite>;
  }) {
  switch (mode.name) {
    case 'create':
      if (!config.useCreate) throw "Can't create that!";
      return <CreateForm config={config} useCreate={config.useCreate} {...props} />;
    case 'update':
      return <UpdateForm config={config} id={mode.id} {...props} />;
  }
}
