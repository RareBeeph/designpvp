'use client';

import { useParams } from 'next/navigation';

import { ProfileBase } from '@/components/Profile';

export default function Profile() {
  const { id } = useParams();

  return <ProfileBase id={typeof id === 'string' ? parseInt(id) : NaN} />;
}
