import { ReactElement } from 'react';

import { ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText } from '@mui/material';

type NavButtonProps = ListItemButtonProps & { depth: number; primary: string; icon: ReactElement };
export default function Button({ depth, onClick, primary, icon, ...props }: NavButtonProps) {
  return (
    <ListItemButton sx={{ pl: 2 * (depth + 1), ...props.sx }} onClick={onClick} {...props}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={primary} />
    </ListItemButton>
  );
}
