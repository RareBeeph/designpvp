import StyledStack from './StyledStack';
import SubmitButton from './SubmitButton';
import { Typography, TypographyProps } from '@mui/material';
import { Form, FormikFormProps } from 'formik';

import { useBreakpoint } from '@/hooks/useBreakpoint';

const StyledHeader = ({ children, ...props }: TypographyProps) => {
  const { isSmall, isXL } = useBreakpoint();
  const variant = isXL ? 'h4' : isSmall ? 'h6' : 'h5';
  return (
    <Typography textAlign="center" {...{ variant, ...props }}>
      {children}
    </Typography>
  );
};

export default function StyledForm({
  header,
  isSubmitting,
  children,
  ...props
}: FormikFormProps & { header?: string; isSubmitting: boolean }) {
  return (
    <Form {...props}>
      <StyledStack>
        {(() => {
          if (header) return <StyledHeader>{header}</StyledHeader>;
        })()}
        {children}
        <SubmitButton {...{ isSubmitting }}>Submit</SubmitButton>
      </StyledStack>
    </Form>
  );
}
