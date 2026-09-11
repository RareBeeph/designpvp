'use client';

import NavDrawerBreadcrumbs from './Breadcrumbs';
import { paddingExemptClassName } from '@/app/providers';
import { Close as CloseIcon } from '@mui/icons-material';
import { Drawer, DrawerProps, IconButton, Stack, Toolbar } from '@mui/material';

import { NavUserDisplay } from '@/components/Nav';
import { Padding } from '@/components/Styled';

import { useBreakpoint } from '@/hooks';

export default function NavDrawer({
  open,
  onClose,
  breadcrumbs,
  ...props
}: DrawerProps & { breadcrumbs: string[] }) {
  const breakpoint = useBreakpoint();

  return (
    <Drawer
      variant={breakpoint.isSmall ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      slotProps={{
        paper: { className: paddingExemptClassName },
      }}
      sx={{
        '& .MuiDrawer-paper': { width: breakpoint.isXS ? 1 : 320 }, // TODO: change
        flexDirection: 'column',
      }}
      {...props}
    >
      <Stack direction="column" flex={1} spacing={0}>
        {!breakpoint.isSmall && <Toolbar />} {/* Match spacing of nav bar */}
        <Stack direction="column" flex={1} padding={1}>
          {breakpoint.isXS && (
            <IconButton
              onClick={() => {
                onClose?.({}, 'backdropClick');
              }}
              sx={{ width: 'min-content' }}
            >
              <CloseIcon />
            </IconButton>
          )}

          <NavDrawerBreadcrumbs breadcrumbs={breadcrumbs} />

          {breakpoint.isXS && <Padding flex={1} isXSExempt />}
          {breakpoint.isXS && <NavUserDisplay />}
        </Stack>
      </Stack>
    </Drawer>
  );
}

export { default as NavDrawerBreadcrumbs } from './Breadcrumbs';
