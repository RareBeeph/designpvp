import { Container, ContainerProps } from '@mui/material';

import { useBreakpoint } from '@/hooks';

export default function Padding({
  flex,
  isXSExempt,
  ...props
}: ContainerProps & { flex: number; isXSExempt?: boolean }) {
  const breakpoint = useBreakpoint();

  return (
    <Container
      {...props}
      disableGutters
      sx={{
        flex: breakpoint.isXS && !isXSExempt ? 0 : flex,
        ...props.sx,
      }}
    />
  );
}
