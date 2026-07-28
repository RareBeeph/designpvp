'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useSession } from '@/hooks';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = useSession();
  const router = useRouter();

  const status = session.error?.response?.status;

  // Navigating is a side effect, so it has to happen after the render commits -
  // pushing during render makes Next complain about an unfinished render
  useEffect(() => {
    if ((session.isSuccess && !session.data?.data.user.is_staff) || status == 401) router.push('/');
  }, [session.isSuccess, session.data?.data.user.is_staff, status, router]);

  return <>{session.isSuccess && session.data?.data.user.is_staff ? children : undefined}</>;
}
