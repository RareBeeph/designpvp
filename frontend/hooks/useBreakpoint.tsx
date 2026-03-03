import { useMediaQuery, useTheme } from '@mui/material';

interface Breakpoint {
  isXS: boolean;
  isSmall: boolean;
  isXL: boolean;
}
export const useBreakpoint: () => Breakpoint = () => {
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const isXL = useMediaQuery(theme.breakpoints.up('xl'));
  return { isXS, isSmall, isXL };
};
