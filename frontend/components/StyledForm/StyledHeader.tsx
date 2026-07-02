import { Typography, TypographyProps } from '@mui/material';

import { useBreakpoint } from '@/hooks';

export default function StyledHeader({ children, ...props }: TypographyProps) {
  const { isSmall, isXL } = useBreakpoint();
  const variant =
    isXL ? 'h4'
    : isSmall ? 'h6'
    : 'h5';
  return (
    <Typography textAlign="center" variant={variant} {...props}>
      {children}
    </Typography>
  );
}
