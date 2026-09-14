import { useState } from 'react';

import CrumbButton from './Button';
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  LastPage as LastPageIcon,
} from '@mui/icons-material';
import { Box, BoxProps, Collapse, List } from '@mui/material';
import { useRouter } from 'next/navigation';

import { useSession } from '@/hooks';

// this sucks but it works for now
const GENERAL_ROUTES = ['', 'login', 'signup'];
const ADMIN_ONLY_ROUTES = ['manage', 'manage/events', 'manage/teams', 'manage/profiles'];

// turns out it's nicer to work with these when they're split by '/'
type Crumbs = string[];
const crumbify = (str: string): Crumbs => str.split('/').filter(s => s.length > 0);

const GENERAL_CRUMBS = GENERAL_ROUTES.map(crumbify);
const ADMIN_CRUMBS = GENERAL_CRUMBS.concat(ADMIN_ONLY_ROUTES.map(crumbify));

export default function NavDrawerBreadcrumbs({
  breadcrumbs: currentPage,
  ...props
}: BoxProps & { breadcrumbs: Crumbs }) {
  const authSession = useSession();
  const router = useRouter();
  const [collapseOpen, setCollapseOpen] = useState(true);

  // Moving to another page always reopens the dropdown, so the new page's subroutes show.
  const navigate = (crumbs: Crumbs) => () => {
    setCollapseOpen(true);
    router.push(`/${crumbs.join('/')}`);
  };

  // Determine which links are available to display, given user permissions.
  const availableRoutes =
    authSession.isSuccess && authSession.data?.data.user.is_staff ? ADMIN_CRUMBS : GENERAL_CRUMBS;

  // Determine which of these links should be displayed in addition to the breadcrumbs.
  const subroutes = childrenRoutes(availableRoutes, currentPage);
  const parentPage: Crumbs | undefined =
    currentPage.length > 0 ? currentPage.slice(0, -1) : undefined;
  const siblingRoutes = childrenRoutes(availableRoutes, parentPage);

  // Construct an array of buttons, one for each breadcrumb route.
  const breadcrumbsSection = currentPage.slice(0, -1).map((_crumb, idx) => {
    const crumbs = currentPage.slice(0, idx + 1);
    return (
      <CrumbButton crumbs={crumbs} icon={<ExpandMoreIcon />} onClick={navigate(crumbs)} key={idx} />
    );
  });

  // The current page's button is a dropdown toggle if it has subroutes, a link if not.
  const hasSubroutes = subroutes.length > 0;
  const currentButton = (
    <CrumbButton
      crumbs={currentPage}
      icon={
        !hasSubroutes ? <LastPageIcon />
        : collapseOpen ?
          <ExpandMoreIcon />
        : <ChevronRightIcon />
      }
      onClick={hasSubroutes ? () => setCollapseOpen(!collapseOpen) : navigate(currentPage)}
    />
  );

  // Construct the dropdown for the subroutes of the current page.
  const subrouteDropdown = (
    <Collapse in={collapseOpen || subroutes.length == 0}>
      <List disablePadding>
        {subroutes.map((path, idx) => (
          <CrumbButton
            crumbs={path}
            icon={<ChevronRightIcon />}
            onClick={navigate(path)}
            key={idx}
          />
        ))}
      </List>
    </Collapse>
  );

  // Construct an array of buttons, one for each sibling route.
  const siblingSection = siblingRoutes.map((path, idx) => {
    if (path.join('/') != currentPage.join('/')) {
      return (
        <CrumbButton
          crumbs={path}
          icon={<ChevronRightIcon />}
          onClick={navigate(path)}
          key={`sibling${idx}`}
        />
      );
    }

    return (
      <div key={idx}>
        {currentPage.length != 0 && currentButton}
        {subrouteDropdown}
      </div>
    );
  });

  // Unify the buttons constructed above into a single component.
  return (
    <Box {...props} sx={{ overflow: 'auto', ...props.sx }}>
      <List sx={{ padding: 0 }}>
        <CrumbButton crumbs={[]} icon={<HomeIcon />} onClick={navigate([])} />
        {breadcrumbsSection}
        {siblingSection}
      </List>
    </Box>
  );
}

// Helper func to find routes which are exactly one level deeper than the prefix.
const childrenRoutes = (routes: Crumbs[], prefix: Crumbs | undefined) => {
  return routes.filter(route => {
    return prefix ?
        route.join('/').startsWith(prefix.join('/')) && route.length == prefix.length + 1
      : route.length == 1;
  });
};
