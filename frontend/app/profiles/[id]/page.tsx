'use client';

import { useParams } from 'next/navigation';

import { ProfileBase } from '@/components/Profile';

export default function Profile() {
  const { id } = useParams();

  // NaN, not undefined, for a malformed route param: undefined would default
  // ProfileBase to 'me' and silently show the viewer their own profile
  return <ProfileBase id={typeof id === 'string' ? parseInt(id) : NaN} />;
}
