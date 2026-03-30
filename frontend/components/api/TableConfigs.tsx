import { QueryKey, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { ReactNode } from 'react';

import { EventsConfig } from './EventsConfig';
import { TeamsConfig } from './TeamsConfig';
import { PaperProps } from '@mui/material';
import { FormikValues } from 'formik';

import { Breakpoint } from '@/hooks/useBreakpoint';

export interface ModeProps {
  mode: 'create' | 'update';
  id?: string;
}

export type FormFieldProps<TValues> = {
  isSubmitting: boolean;
  values: TValues;
  breakpoint: Breakpoint;
} & ModeProps;

export interface TableConfig<T, TRequest, TValues extends FormikValues> {
  name: string;
  columns: MRT_ColumnDef<MRT_RowData>[];
  queryKey: () => QueryKey;
  useList: () => UseQueryResult<T[]>;
  parseRequest: (data: TValues) => TRequest | undefined;
  useCreate: () => UseMutationResult<unknown, Error, { data: TRequest }, unknown>;
  useUpdate: () => UseMutationResult<unknown, Error, { id: number; data: TRequest }, unknown>;
  useDestroy: () => UseMutationResult<unknown, Error, { id: number }, unknown>;
  formFields: React.FC<FormFieldProps<TValues>>;
  initialValues: TValues;
  dataManagerForm: (props: PaperProps & ModeProps) => ReactNode;
}

export type AnyConfig = TableConfig<any, any, any>;

export const tableConfigs: Record<string, AnyConfig> = {
  teams: TeamsConfig,
  events: EventsConfig,
};
