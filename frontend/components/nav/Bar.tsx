'use client';
import { useState } from 'react';

import NavDrawer from './Drawer';
import UserDisplay from './UserDisplay';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, IconButton, Link, Toolbar } from '@mui/material';
import { useSelectedLayoutSegments } from 'next/navigation';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function NavBar() {
  const breadcrumbs = useSelectedLayoutSegments();
  const breakpoint = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(prevState => !prevState);
  };

  const headerVariant = 'h4';

  return (
    <Box>
      <AppBar
        position="absolute"
        sx={{ zIndex: theme => theme.zIndex.drawer + (breakpoint.isSmall ? -1 : 1) }}
      >
        <Toolbar>
          {breakpoint.isSmall && (
            <IconButton edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Link variant={headerVariant} underline="none" color="inherit" href="/">
            DesignPVP
          </Link>
          {!breakpoint.isXS && <UserDisplay />}
        </Toolbar>
      </AppBar>
      <NavDrawer open={drawerOpen} onClose={handleDrawerToggle} {...{ breadcrumbs }} />
    </Box>
  );
}
