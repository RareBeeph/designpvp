import StyledButton from './Button';
import { ButtonProps } from '@mui/material';

export default function SubmitButton({
  isSubmitting,
  children,
  ...props
}: ButtonProps & { isSubmitting: boolean }) {
  return (
    <StyledButton type="submit" disabled={isSubmitting} {...props}>
      {children}
    </StyledButton>
  );
}
