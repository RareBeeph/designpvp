'use client';
import { useGetAuthSession } from '@/api/allauth';
import { Box, Drawer, DrawerProps, List, ListItem, Toolbar } from '@mui/material';
import Link from 'next/link';

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
  const routes =
    authSession.isSuccess && authSession.data?.data.user.is_staff
      ? ROUTES.concat(ADMIN_ROUTES)
      : ROUTES;
  const subroutes = routes.filter(
    route => route.startsWith(breadcrumbs.join('/')) && !(route == breadcrumbs.join('/')),
  );

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '& .MuiDrawer-paper': { width: 240 }, // TODO: change
      }}
      {...props}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem>
            <Link href="/">home</Link>
          </ListItem>
          {...breadcrumbs.map((_crumb, idx) => {
            const ref = breadcrumbs.slice(0, idx + 1).join('/');
            return (
              <ListItem>
                <Link href={'/' + ref}>{ref}</Link>
              </ListItem>
            );
          })}
          {...subroutes.map(path => (
            <ListItem>
              <Link href={'/' + path}>{'+ ' + path}</Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
