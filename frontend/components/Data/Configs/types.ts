import { QueryClient, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { ReactNode } from 'react';

import { ErrorType } from '@/api/mutator/custom-instance';
import { PaperProps } from '@mui/material';
import { FormikProps, FormikValues } from 'formik';

export interface ModeProps {
  mode: 'create' | 'update';
  id?: string;
}

export type FormFieldProps<TValues> = FormikProps<TValues> & ModeProps;

export type AnyError = ErrorType<{
  type: 'validation_error' | 'client_error' | 'server_error';
  errors: {
    attr: string | null;
    code: string;
    detail: string;
  }[];
}>;

export interface TableConfig<T, TRequest, TValues extends FormikValues, TWrite = T> {
  name: string;
  columns: MRT_ColumnDef<MRT_RowData>[];
  invalidateQueries: (queryClient: QueryClient, id?: number) => void;
  useList: () => UseQueryResult<T[], AnyError>;
  useRetrieve: (id: number, options: { query: object }) => UseQueryResult<T, AnyError>;
  parseRequest: (data: TValues) => TRequest | undefined;
  useCreate?: () => UseMutationResult<TWrite, AnyError, { data: TRequest }, unknown>;
  useUpdate: () => UseMutationResult<TWrite, AnyError, { id: number; data: TRequest }, unknown>;
  useDestroy: () => UseMutationResult<void, AnyError, { id: number }, unknown>;
  formFields: React.FC<FormFieldProps<TValues>>;
  initialValues: (instance?: T) => TValues;
  dataManagerForm: (props: PaperProps & ModeProps) => ReactNode;
}

export type AnyConfig = TableConfig<any, any, any, any>;

// an int in string form, due to the DOM's limitation on <option> values
export type PrimaryKeyOption = string;
