import StyledHeader from './StyledHeader';
import SubmitButton from './SubmitButton';
import { Stack } from '@mui/material';
import { Form, FormikFormProps } from 'formik';

export function StyledForm({
  header,
  isSubmitting,
  children,
  ...props
}: FormikFormProps & { header?: string; isSubmitting: boolean }) {
  return (
    <Form {...props}>
      <Stack>
        {header && <StyledHeader>{header}</StyledHeader>}
        {children}
        <SubmitButton isSubmitting={isSubmitting}>Submit</SubmitButton>
      </Stack>
    </Form>
  );
}

export { default as Padding } from './Padding';
export { default as StyledDateTime } from './StyledDateTime';
export { default as StyledSelectField } from './StyledSelectField';
export { default as StyledTextField } from './StyledTextField';
export { StyledButton } from './SubmitButton';
export { StyledHeader, SubmitButton };
