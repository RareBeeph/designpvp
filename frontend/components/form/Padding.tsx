import { Container, ContainerProps } from '@mui/material';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function Padding({ flex, ...props }: ContainerProps & { flex: number }) {
  const breakpoint = useBreakpoint();

  return (
    <Container sx={{ flex: breakpoint.isXS ? 0 : flex, ...props.sx }} disableGutters {...props} />
  );
}
