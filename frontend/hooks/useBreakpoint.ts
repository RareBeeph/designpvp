import { useMediaQuery, useTheme } from '@mui/material';

export interface Breakpoint {
  isXS: boolean;
  isSmall: boolean;
  isXL: boolean;
}
export default function useBreakpoint() {
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const isXL = useMediaQuery(theme.breakpoints.up('xl'));

  const out: Breakpoint = { isXS, isSmall, isXL };
  return out;
}
