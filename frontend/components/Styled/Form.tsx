import StyledHeader from './Header';
import SubmitButton from './SubmitButton';
import { Stack } from '@mui/material';
import { Form, FormikFormProps } from 'formik';

export default function StyledForm({
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
