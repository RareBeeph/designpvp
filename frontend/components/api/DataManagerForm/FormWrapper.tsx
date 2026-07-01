'use client';

import { Paper, PaperProps, Stack } from '@mui/material';
import { Formik, FormikHelpers, FormikValues } from 'formik';

import { ModeProps, TableConfig } from '@/components/api/TableConfigs';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function FormWrapper<T, TRequest, TValues extends FormikValues, TWrite = T>({
  children: _children,
  config,
  mode,
  id,
  onSubmit,
  initialValues,
  ready,
  ...props
}: Omit<PaperProps, 'onSubmit'> &
  ModeProps & {
    config: TableConfig<T, TRequest, TValues, TWrite>;
    onSubmit: (data: TValues, actions: FormikHelpers<TValues>) => Promise<void>;
    initialValues: TValues;
    ready: boolean;
  }) {
  const breakpoint = useBreakpoint();

  return (
    <Stack {...props}>
      <Paper>
        {ready && (
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {formikProps => (
              <config.formFields mode={mode} id={id} breakpoint={breakpoint} {...formikProps} />
            )}
          </Formik>
        )}
      </Paper>
    </Stack>
  );
}
