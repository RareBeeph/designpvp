'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const client = new QueryClient();

// This apparently needed to be 'use client' so that it could pass the QueryClient down to page.tsx
export function ClientProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
