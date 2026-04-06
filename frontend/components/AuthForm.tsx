'use client';

import { UseMutationResult, useQueryClient } from '@tanstack/react-query';

import StyledForm from './form/StyledForm';
import { StyledTextField } from './form/StyledTextField';
import {
  AuthenticatedResponse,
  LoginBody,
  PostAuthLoginMutationError,
  PostAuthSignupMutationError,
  SignupBody,
  getGetAuthSessionQueryKey,
} from '@/api/allauth';
import { Paper, PaperProps, Stack } from '@mui/material';
import { Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';

type AuthMutation<T, TError> = () => UseMutationResult<AuthenticatedResponse, TError, { data: T }>;

interface Props extends PaperProps {
  name: string;
  usePostAuth:
    | AuthMutation<LoginBody, PostAuthLoginMutationError>
    | AuthMutation<SignupBody, PostAuthSignupMutationError>;
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
  const mutation = usePostAuth();

  const onSubmit = async (
    data: { username: string; password: string },
    actions: FormikHelpers<{ username: string; password: string }>,
  ) =>
    mutation.mutate(
      { data },
      {
        onSuccess: async () => {
          await onSuccess?.();
          await queryClient.invalidateQueries({ queryKey: getGetAuthSessionQueryKey() });
          router.push('/'); // redirect
        },
        onError: async (newError: PostAuthLoginMutationError | PostAuthSignupMutationError) => {
          await onError?.();
          const data = newError?.response?.data ?? {};
          if ('errors' in data) {
            data.errors?.forEach(fieldError => {
              if (fieldError.param) actions.setFieldError(fieldError.param, fieldError.message);
            });
          }
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
    </Stack>
  );
}
