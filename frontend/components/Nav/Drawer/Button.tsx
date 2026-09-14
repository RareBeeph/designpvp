import { ReactElement } from 'react';

import { ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText } from '@mui/material';
import { pascalCase } from 'text-case';

type CrumbButtonProps = ListItemButtonProps & { crumbs: string[]; icon: ReactElement };

export default function NavDrawerBreadcrumbsButton({ crumbs, icon, ...props }: CrumbButtonProps) {
  return (
    <ListItemButton {...props} sx={{ pl: 2 * (crumbs.length + 1), ...props.sx }}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={crumbs.length > 0 ? pascalCase(crumbs[crumbs.length - 1]) : 'Home'} />
    </ListItemButton>
  );
}
