'use client';

import { useGetAuthSession } from '@/api/allauth';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = useGetAuthSession();

  return <>{session.isSuccess && session.data?.data.user.is_staff ? children : undefined}</>;
}
