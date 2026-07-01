import React from 'react';

import StyledForm from '../form/StyledForm';
import StyledSelectField from '../form/StyledSelectField';
import { StyledTextField } from '../form/StyledTextField';
import DataManagerForm from './DataManagerForm';
import { FormFieldProps, TableConfig } from './TableConfigs';
import {
  Profile,
  ProfileWrite,
  ProfileWriteRequest,
  Team,
  getProfilesListQueryKey,
  getProfilesRetrieveQueryKey,
  useProfilesDestroy,
  useProfilesList,
  useProfilesRetrieve,
  useProfilesUpdate,
  useTeamsList,
} from '@/api/backend';

interface ProfileValues {
  user: string; // numeric id
  teams: string[]; // list of numeric ids
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
    { accessorKey: 'user.username', header: 'User', size: 0, grow: true },
    {
      accessorKey: 'teams',
      header: 'Teams',
      size: 0,
      grow: true,
      Cell: ({ cell }) => {
        const value = cell.getValue<Team[]>();
        return value.length > 0 ? value.map(t => t.name).reduce((p, n) => `${p}, ${n}`) : '';
      },
    },
  ],
  invalidateQueries: (queryClient, id) => {
    queryClient.invalidateQueries({ queryKey: getProfilesListQueryKey() });
    queryClient.invalidateQueries({ queryKey: getProfilesRetrieveQueryKey(id) });
  },
  useList: useProfilesList,
  useRetrieve: useProfilesRetrieve,
  parseRequest: data => {
    return {
      user: data.user,
      teams: data.teams.map(t => parseInt(t)),
    };
  },
  useCreate: undefined, // To create a profile, you should just Sign Up instead.
  useUpdate: useProfilesUpdate,
  useDestroy: useProfilesDestroy,
  formFields: ({
    isSubmitting,
    values,
    id,
    breakpoint: _breakpoint,
  }: FormFieldProps<ProfileValues>) => {
    return (
      <StyledForm header={`Editing Profile ${id}`} isSubmitting={isSubmitting}>
        <StyledTextField name="user" disabled />
        <StyledSelectField
          name="teams"
          value={values.teams}
          multiple
          data={useTeamsList().data ?? []}
        />
      </StyledForm>
    );
  },
  initialValues: instance => ({
    user: instance?.user.username ?? '',
    teams: instance?.teams.map(t => t.id.toString()) ?? [],
  }),
  dataManagerForm: ({ mode, id, ...props }) => (
    <DataManagerForm config={ProfilesConfig} mode={mode} id={id} {...props} />
  ),
};
