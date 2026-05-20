'use client'

import { useProfilesList } from "@/api/backend";
import { Typography } from "@mui/material";
import { useParams } from "next/navigation";

export default function Profile() {
  const profiles = useProfilesList()
  // Using id for now because pulling the username from the User is the same pain point I had with Teams and Event names
  const { id } = useParams()
  const targetProfile = typeof id === "string" ? profiles.data?.find(p => p.id == parseInt(id)) : undefined

  console.log(`Profile: ${targetProfile}`)
  console.log(`All profiles: ${profiles.data}`)

  return <Typography>
    This page intentionally left blank
  </Typography>
}
