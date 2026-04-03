'use client';

import { UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import StyledForm from './form/StyledForm';
import { StyledTextField } from './form/StyledTextField';
import {
  AuthenticatedResponse,
  LoginBody,
  SignupBody,
  getGetAuthSessionQueryKey,
} from '@/api/allauth';
import { ErrorType } from '@/api/mutator/custom-instance';
import { Alert, Paper, PaperProps, Stack } from '@mui/material';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';

type AuthMutation<T> = () => UseMutationResult<
  AuthenticatedResponse,
  ErrorType<unknown>,
  { data: T }
>;

interface Props extends PaperProps {
  name: string;
  usePostAuth: AuthMutation<LoginBody> | AuthMutation<SignupBody>;
  onSuccess?: () => Promise<void>;
  onError?: () => Promise<void>;
}

export default function AuthForm({
  name,
  usePostAuth,
  onSuccess,
  onError,
  children: _children,
  ...props
}: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [error, setError] = useState<ErrorType<unknown>>();
  const mutation = usePostAuth();

  const onSubmit = async (data: { username: string; password: string }) =>
    mutation.mutate(
      { data },
      {
        onSuccess: async () => {
          await onSuccess?.();
          await queryClient.invalidateQueries({ queryKey: getGetAuthSessionQueryKey() });
          router.push('/'); // redirect
        },
        onError: async (error: ErrorType<unknown>) => {
          await onError?.();
          setError(error);
        },
      },
    );

  return (
    <Stack sx={{ minWidth: 'max-content' }} {...props}>
      <Paper>
        <Formik initialValues={{ username: '', password: '' }} onSubmit={onSubmit}>
          {({ isSubmitting }) => {
            return (
              <StyledForm header={name} isSubmitting={isSubmitting}>
                <StyledTextField name="username" />
                <StyledTextField name="password" type="password" />
              </StyledForm>
            );
          }}
        </Formik>
      </Paper>
      {error && (
        <Alert severity="error">
          {`${error.message}: ${error.response?.statusText}.`}
          <br />
          {`${JSON.stringify(error.response?.data)}`}
        </Alert>
      )}
    </Stack>
  );
}
