import { QueryKey, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';

import { EventsConfig } from './EventsConfig';
import { TeamsConfig } from './TeamsConfig';

export interface TableConfig<T, TProps, TRequest, TValues> {
  name: string;
  columns: MRT_ColumnDef<MRT_RowData>[];
  queryKey: () => QueryKey;
  useList: () => UseQueryResult<T[]>;
  parseRequest: (data: TValues) => TRequest | undefined;
  useCreate: () => UseMutationResult<unknown, Error, { data: TRequest }, unknown>;
  useUpdate: () => UseMutationResult<unknown, Error, { id: number; data: TRequest }, unknown>;
  useDestroy: () => UseMutationResult<unknown, Error, { id: number }, unknown>;
  formFields: React.FC<TProps>; // component rendering the Formik fields
  initialValues: TValues;
}

export type AnyConfig = typeof TeamsConfig | typeof EventsConfig;

export const tableConfigs: Record<string, AnyConfig> = {
  teams: TeamsConfig,
  events: EventsConfig,
};
