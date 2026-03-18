'use client';
import { useState } from 'react';

import { NavButton } from '.';
import UserDisplay from './UserDisplay';
import { useGetAuthSession } from '@/api/allauth';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Box, Collapse, Drawer, DrawerProps, IconButton, List, Toolbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import { pascalCase } from 'text-case';

import { useBreakpoint } from '@/hooks/useBreakpoint';

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
  const breakpoint = useBreakpoint();
  const [collapseOpen, setCollapseOpen] = useState(true);

  // Determine which links are available to display, given user permissions.
  const routes =
    authSession.isSuccess && authSession.data?.data.user.is_staff ?
      ROUTES.concat(ADMIN_ROUTES)
    : ROUTES;

  // Helper func to find routes which are exactly one level deeper than the prefix.
  const routeFilter = (prefix: string | false) => {
    return routes.filter(route => {
      if (typeof prefix == 'boolean') return route == '';
      return (
        route.startsWith(prefix) &&
        route.replace(prefix, '').length > 0 &&
        route.replace(prefix, '').lastIndexOf('/') <= 0
      );
    });
  };

  // Which available links are children of the current page.
  const currentPage = breadcrumbs.join('/');
  const subroutes = routeFilter(currentPage);
  // Which available links are siblings of the current page.
  const parentPage =
    currentPage != '' && currentPage.slice(0, Math.max(currentPage.lastIndexOf('/'), 0));
  const siblingRoutes = routeFilter(parentPage);

  return (
    <Drawer
      variant={breakpoint.isSmall ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '& .MuiDrawer-paper': { width: breakpoint.isXS ? 1 : 320 }, // TODO: change
      }}
      {...props}
    >
      {!breakpoint.isSmall && <Toolbar />}
      {breakpoint.isXS && (
        <IconButton
          onClick={() => {
            onClose?.({}, 'backdropClick');
          }}
          sx={{ width: 'min-content', marginLeft: 'auto' }}
        >
          <CloseIcon />
        </IconButton>
      )}
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {/* Home link */}
          <NavButton
            depth={0}
            icon={<HomeIcon />}
            primary={'Home'}
            onClick={() => router.push('/')}
            key={'Home'}
          />

          {/* Breadcrumb links */}
          {...breadcrumbs.slice(0, -1).map((_crumb, idx) => {
            const path = breadcrumbs.slice(0, idx + 1).join('/');
            return (
              <NavButton
                depth={idx + 1}
                icon={<ExpandMoreIcon />}
                primary={pascalCase(path.includes('/') ? path.slice(path.lastIndexOf('/')) : path)}
                onClick={() => {
                  setCollapseOpen(true);
                  router.push('/' + path);
                }}
                key={'Breadcrumb' + idx}
              />
            );
          })}

          {/* Current and sibling page links */}
          {siblingRoutes.map((path, idx) => {
            const currentPageIcon =
              subroutes.length == 0 ? <LastPageIcon />
              : collapseOpen ? <ExpandMoreIcon />
              : <ChevronRightIcon />;

            if (path != currentPage)
              return (
                // Sibling page button
                <NavButton
                  depth={breadcrumbs.length}
                  icon={<ChevronRightIcon />}
                  primary={pascalCase(path.replace(parentPage + '/', ''))}
                  onClick={() => {
                    setCollapseOpen(true);
                    router.push('/' + path);
                  }}
                  key={'Sibling' + idx}
                />
              );
            return (
              <div key={idx}>
                {/* Current page button (unless already Home) */}
                {path != '' && (
                  <NavButton
                    depth={breadcrumbs.length}
                    icon={currentPageIcon}
                    primary={pascalCase(breadcrumbs[breadcrumbs.length - 1])}
                    onClick={() => {
                      if (subroutes.length > 0) setCollapseOpen(!collapseOpen);
                    }}
                    key={'CurrentPage'}
                  />
                )}
                {/* Immediate subroutes dropdown */}
                <Collapse in={collapseOpen || breadcrumbs.length == 0}>
                  <List disablePadding>
                    {...subroutes.map((path, idx) => (
                      <NavButton
                        depth={breadcrumbs.length + 1}
                        icon={<ChevronRightIcon />}
                        primary={pascalCase(path.replace(currentPage + '/', ''))}
                        onClick={() => {
                          setCollapseOpen(true);
                          router.push('/' + path);
                        }}
                        key={'Subroute' + idx}
                      />
                    ))}
                  </List>
                </Collapse>
              </div>
            );
          })}
        </List>
      </Box>
      {breakpoint.isXS && <UserDisplay />}
      <Toolbar />
    </Drawer>
  );
}
