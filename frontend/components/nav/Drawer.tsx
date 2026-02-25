'use client';
import { useState } from 'react';

import { useGetAuthSession } from '@/api/allauth';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import LastPageIcon from '@mui/icons-material/LastPage';
import {
  Box,
  Collapse,
  Drawer,
  DrawerProps,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { useRouter } from 'next/navigation';

// this sucks but it works for now
const ROUTES = ['', 'login', 'signup'];
const ADMIN_ROUTES = ['manage', 'manage/events', 'manage/teams'];

export default function NavDrawer({
  open,
  onClose,
  breadcrumbs,
  ...props
}: DrawerProps & { breadcrumbs: string[] }) {
  const authSession = useGetAuthSession();
  const router = useRouter();
  const [collapseOpen, setCollapseOpen] = useState(true);

  const routes =
    authSession.isSuccess && authSession.data?.data.user.is_staff
      ? ROUTES.concat(ADMIN_ROUTES)
      : ROUTES;
  const subroutes = routes.filter(route => {
    if (breadcrumbs.length == 0) return !route.includes('/') && route != '';
    return (
      route.startsWith(breadcrumbs.join('/') + '/') &&
      !route.replace(breadcrumbs.join('/') + '/', '').includes('/')
    );
  });

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '& .MuiDrawer-paper': { width: 320 }, // TODO: change
      }}
      {...props}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItemButton onClick={() => router.push('/')}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
          {...breadcrumbs.slice(0, -1).map((_crumb, idx) => {
            const ref = breadcrumbs.slice(0, idx + 1).join('/');
            return (
              <ListItemButton
                onClick={() => {
                  setCollapseOpen(true);
                  router.push('/' + ref);
                }}
                sx={{ pl: idx + 4 }}
              >
                <ListItemIcon>
                  <ExpandMoreIcon />
                </ListItemIcon>
                <ListItemText primary={ref}></ListItemText>
              </ListItemButton>
            );
          })}
          {breadcrumbs.length > 0 ? (
            <ListItemButton
              onClick={() => {
                if (subroutes.length > 0) setCollapseOpen(!collapseOpen);
              }}
              sx={{ pl: 2 * (breadcrumbs.length + 1) }}
            >
              <ListItemIcon>
                {subroutes.length > 0 ? <ExpandMoreIcon /> : <LastPageIcon />}
              </ListItemIcon>
              <ListItemText primary={breadcrumbs[breadcrumbs.length - 1]} />
            </ListItemButton>
          ) : undefined}
          <Collapse in={collapseOpen || breadcrumbs.length == 0}>
            <List disablePadding>
              {...subroutes.map(path => (
                <ListItemButton
                  onClick={() => {
                    setCollapseOpen(true);
                    router.push('/' + path);
                  }}
                  sx={{ pl: 2 * (breadcrumbs.length + 2) }}
                >
                  <ListItemIcon>
                    <ChevronRightIcon />
                  </ListItemIcon>
                  <ListItemText primary={path.replace(breadcrumbs.join('/') + '/', '')} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </Box>
    </Drawer>
  );
}
