import { AccountCircle as UserIcon } from '@mui/icons-material';
import { Box, BoxProps } from '@mui/material';

import { useGetProfile } from '@/hooks';

export default function ProfilePicture({
  profileId,
  ...props
}: { profileId?: number | 'me' } & BoxProps) {
  const profile = useGetProfile(profileId);

  return profile?.avatar ?
      <Box
        component="img"
        src={profile.avatar}
        alt={`${profile.user.username}'s avatar`}
        {...props}
      />
    : <Box {...props}>
        <UserIcon sx={{ width: '100%', height: '100%' }} />
      </Box>;
}
