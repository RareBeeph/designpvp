'use client';

import { QueryClient, QueryClientProvider, isServer } from '@tanstack/react-query';

import { ThemeProvider, createTheme } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

const darkTheme = createTheme({
  palette: { mode: 'dark' },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(2),
          [theme.breakpoints.up('xl')]: {
            padding: theme.spacing(2.5),
          },
          // xs: 2, md: 2, xl: 2.5
        }),
      },
    },
    MuiStack: { defaultProps: { spacing: { xs: 1.5, md: 2, xl: 2.5 } } },
    MuiAppBar: { styleOverrides: { root: { padding: 0 } } },
    // MuiDrawer: { styleOverrides: { root: { "& .MuiDrawer-paper": { paddingTop:0 } } } },
  },
});

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = getQueryClient();

  return (
    <AppRouterCacheProvider>
      <QueryClientProvider client={client}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
        </LocalizationProvider>
      </QueryClientProvider>
    </AppRouterCacheProvider>
  );
}
