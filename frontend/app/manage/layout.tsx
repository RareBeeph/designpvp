'use client';

import { useGetAuthSession } from '@/api/allauth';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = useGetAuthSession();
  const router = useRouter();

  if ((session.isSuccess && !session.data?.data.user.is_staff) || session.error?.status == 401)
    router.push('/');

  return <>{session.isSuccess && session.data?.data.user.is_staff ? children : undefined}</>;
}
