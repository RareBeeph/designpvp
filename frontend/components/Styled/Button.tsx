import { Button, ButtonProps } from '@mui/material';

import { useBreakpoint } from '@/hooks';

export default function StyledButton({ children, ...props }: ButtonProps) {
  const { isSmall } = useBreakpoint();
  const defaultSize = isSmall ? 'medium' : 'large';
  return (
    <Button variant="contained" size={defaultSize} {...props}>
      {children}
    </Button>
  );
}
