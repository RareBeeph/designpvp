import { Button, ButtonProps } from '@mui/material';

import { useBreakpoint } from '@/hooks/useBreakpoint';

const StyledButton = ({ children, ...props }: ButtonProps) => {
  const { isSmall } = useBreakpoint();
  const size = (props.size ?? isSmall) ? 'medium' : 'large';
  return (
    <Button variant="contained" {...{ size, ...props }}>
      {children}
    </Button>
  );
};

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
