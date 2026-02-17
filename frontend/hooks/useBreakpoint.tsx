import { useMediaQuery, useTheme } from '@mui/material';

interface Breakpoint {
  isSmall: boolean;
  isXL: boolean;
}
export const useBreakpoint: () => Breakpoint = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const isXL = useMediaQuery(theme.breakpoints.up('xl'));
  return { isSmall, isXL };
};
