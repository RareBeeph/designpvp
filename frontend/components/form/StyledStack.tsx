import { Stack, StackProps } from '@mui/material';

export default function StyledStack({ children, ...props }: StackProps) {
  return (
    <Stack spacing={{ xs: 1.5, md: 2, xl: 2.5 }} {...props}>
      {children}
    </Stack>
  );
}
