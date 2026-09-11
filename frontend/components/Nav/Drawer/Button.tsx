import { Dispatch, SetStateAction } from 'react';

import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  LastPage as LastPageIcon,
} from '@mui/icons-material';
import { ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText } from '@mui/material';
import { useRouter } from 'next/navigation';
import { pascalCase } from 'text-case';

type BreadcrumbVariant =
  | 'home'
  | 'breadcrumb'
  | 'current-last'
  | 'current-expanded'
  | 'current-unexpanded'
  | 'sibling'
  | 'subroute';
type BreadcrumbProps = ListItemButtonProps & {
  crumbs: string[];
  variant: BreadcrumbVariant;
  setCollapseOpen: Dispatch<SetStateAction<boolean>>;
};

export default function NavDrawerBreadcrumbsButton({
  crumbs,
  variant,
  setCollapseOpen,
  ...props
}: BreadcrumbProps) {
  const router = useRouter();
  const path = `/${crumbs.join('/')}`;
  const onClick = () => {
    setCollapseOpen(true); // default to open when navigating between pages

    variant == 'current-expanded' ? setCollapseOpen(false)
    : variant == 'current-unexpanded' ?
      undefined // we already set it to open in this case
    : router.push(path);
  };

  const icon =
    variant == 'home' ? <HomeIcon />
    : variant == 'breadcrumb' ? <ExpandMoreIcon />
    : variant == 'current-last' ? <LastPageIcon />
    : variant == 'current-expanded' ? <ExpandMoreIcon />
    : <ChevronRightIcon />;

  return (
    <ListItemButton sx={{ pl: 2 * (crumbs.length + 1), ...props.sx }} onClick={onClick} {...props}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={crumbs.length > 0 ? pascalCase(crumbs[crumbs.length - 1]) : 'Home'} />
    </ListItemButton>
  );
}
