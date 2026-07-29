'use client';

import CreateForm from './Create';
import UpdateForm from './Update';
import { PaperProps } from '@mui/material';
import { FormikValues } from 'formik';

import { ModeProps, TableConfig } from '@/components/Data/Configs/types';

export default function DataManagerForm<T, TRequest, TValues extends FormikValues, TWrite = T>({
  children: _children,
  mode,
  ...props
}: PaperProps &
  ModeProps & {
    config: TableConfig<T, TRequest, TValues, TWrite>;
    onSuccess?: () => void;
  }) {
  switch (mode.name) {
    case 'create':
      if (!props.config.useCreate) throw new Error(`${props.config.name} cannot be created.`);
      return <CreateForm useCreate={props.config.useCreate} {...props} />;
    case 'update':
      return <UpdateForm id={mode.id} {...props} />;
  }
}
