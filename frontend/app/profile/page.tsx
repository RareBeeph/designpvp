'use client'

import { useGetAuthSession } from "@/api/allauth";
import { useProfilesList } from "@/api/backend";
import { Typography } from "@mui/material";

export default function Profile() {
  const session = useGetAuthSession()
  const profiles = useProfilesList()
  const currentProfile = profiles.data?.find(p => p.user == session.data?.data.user.id)



  return <Typography>
    This page intentionally left blank
  </Typography>
}
