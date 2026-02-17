import { Paper, PaperProps } from '@mui/material';

export default function StyledPaper({ children, sx, ...props }: PaperProps) {
  return (
    <Paper sx={{ p: { xs: 2, md: 2, xl: 2.5 }, ...sx }} {...props}>
      {children}
    </Paper>
  );
}
