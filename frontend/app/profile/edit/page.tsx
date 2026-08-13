'use client';

import { useQueryClient } from '@tanstack/react-query';

import {
  getProfilesMeRetrieveQueryKey,
  useProfilesMePartialUpdate,
  useProfilesMeRetrieve,
} from '@/api/backend';
import { Paper, Stack } from '@mui/material';
import { Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';

import onSubmitError from '@/components/Data/Form/onSubmitError';
import { StyledFileField, StyledForm } from '@/components/Styled';

interface ProfileEditValues {
  avatar: File | null;
}

/**
 * Self-service profile editing.
 *
 * Deliberately not built on the `TableConfig` machinery under `components/Data`: that is
 * keyed on list/retrieve-by-id and redirects into `/manage/<name>` afterwards, none of
 * which fits an endpoint that resolves the record from the session. It still reuses the
 * same form primitives and the same `onSubmitError` mapping, so validation errors surface
 * per-field exactly as they do in the admin area.
 */
export default function EditProfile() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const profile = useProfilesMeRetrieve();
  const update = useProfilesMePartialUpdate();

  const onSubmit = async (values: ProfileEditValues, actions: FormikHelpers<ProfileEditValues>) => {
    // PATCH, so an untouched picker means "leave the avatar alone" rather than "clear it"
    if (!values.avatar) {
      router.push('/profile');
      return;
    }

    update.mutate(
      { data: { avatar: values.avatar } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getProfilesMeRetrieveQueryKey() });
          router.push('/profile');
        },
        onError: newError => onSubmitError(actions, newError),
      },
    );
  };

  return (
    <Stack direction="column">
      <Paper>
        {profile.isSuccess && (
          <Formik<ProfileEditValues> initialValues={{ avatar: null }} onSubmit={onSubmit}>
            {({ isSubmitting }) => (
              <StyledForm header="Edit Profile" isSubmitting={isSubmitting}>
                <StyledFileField name="avatar" label="Choose avatar" accept="image/*" />
              </StyledForm>
            )}
          </Formik>
        )}
      </Paper>
    </Stack>
  );
}
