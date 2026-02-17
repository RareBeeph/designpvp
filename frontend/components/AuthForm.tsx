'use client';

import { useQueryClient } from '@tanstack/react-query';

import StyledForm from './form/StyledForm';
import StyledPaper from './form/StyledPaper';
import { StyledTextField } from './form/StyledTextField';
import { getGetAuthSessionQueryKey, usePostAuthLogin, usePostAuthSignup } from '@/api/allauth';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';

interface Props {
  name: string;
  mutation: ReturnType<typeof usePostAuthLogin> | ReturnType<typeof usePostAuthSignup>;
  onSuccess?: () => Promise<void>;
  onError?: () => Promise<void>;
}

export default function AuthForm({ name, mutation, onSuccess, onError }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const onSubmit = async (data: { username: string; password: string }) =>
    mutation.mutate(
      { data },
      {
        onSuccess: async () => {
          await onSuccess?.();
          await queryClient.invalidateQueries({ queryKey: getGetAuthSessionQueryKey() });
          router.push('/'); // redirect
        },
        onError,
      },
    );

  return (
    <StyledPaper sx={{ minWidth: 'max-content' }}>
      <Formik initialValues={{ username: '', password: '' }} {...{ onSubmit }}>
        {({ isSubmitting }) => {
          return (
            <StyledForm header={name} {...{ isSubmitting }}>
              <StyledTextField name="username" />
              <StyledTextField name="password" type="password" />
            </StyledForm>
          );
        }}
      </Formik>
    </StyledPaper>
  );
}
