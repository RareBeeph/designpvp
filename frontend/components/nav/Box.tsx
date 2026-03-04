'use client';

import { Box, BoxProps, Toolbar } from '@mui/material';

import { useBreakpoint } from '@/hooks/useBreakpoint';

// Kinda a hack, I just had to pull this styling out of layout.tsx so it could be a client component
export default function NavBox({ children, ...props }: BoxProps) {
  const breakpoint = useBreakpoint();
  // TODO: change
  return (
    <Box flexGrow={1} paddingLeft={!breakpoint.isSmall ? '320px' : 0} {...props}>
      <Toolbar />
      {children}
    </Box>
  );
}
