import React from 'react';

import StyledForm from '../form/StyledForm';
import DataManagerForm from './DataManagerForm';
import { FormFieldProps, TableConfig } from './TableConfigs';
import {
  Profile,
  ProfileWrite,
  ProfileWriteRequest,
  getProfilesListQueryKey,
  useProfilesDestroy,
  useProfilesList,
  useProfilesUpdate,
} from '@/api/backend';

interface ProfileValues {
  user: number;
  teams: number[];
}

export const ProfilesConfig: TableConfig<
  Profile,
  ProfileWriteRequest,
  ProfileValues,
  ProfileWrite
> = {
  name: 'profiles',
  columns: [
    { accessorKey: 'id', header: 'ID', size: 0, grow: true },
    { accessorKey: 'name', header: 'Name', size: 0, grow: true },
    { accessorKey: 'event.name', header: 'Event', size: 0, grow: true },
  ],
  queryKey: getProfilesListQueryKey,
  useList: useProfilesList,
  parseRequest: data => {
    return data;
  },
  useCreate: undefined, // To create a profile, you should just Sign Up instead.
  useUpdate: useProfilesUpdate,
  useDestroy: useProfilesDestroy,
  formFields: ({
    isSubmitting,
    values: _values,
    id,
    breakpoint: _breakpoint,
  }: FormFieldProps<ProfileValues>) => {
    return (
      <StyledForm header={`Editing Profile ${id}`} isSubmitting={isSubmitting}>
        {/* TODO: implement form ui for editing teams list */}
      </StyledForm>
    );
  },
  initialValues: { user: 0, teams: [] },
  dataManagerForm: ({ mode, id, ...props }) => (
    <DataManagerForm config={ProfilesConfig} mode={mode} id={id} {...props} />
  ),
};
