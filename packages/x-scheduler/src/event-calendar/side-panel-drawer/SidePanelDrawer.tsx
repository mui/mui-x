'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import Close from '@mui/icons-material/Close';
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlined from '@mui/icons-material/ExpandLessOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import CalendarViewMonthOutlined from '@mui/icons-material/CalendarViewMonthOutlined';
import CalendarViewWeekOutlined from '@mui/icons-material/CalendarViewWeekOutlined';
import CalendarViewDayOutlined from '@mui/icons-material/CalendarViewDayOutlined';
import ViewAgendaOutlined from '@mui/icons-material/ViewAgendaOutlined';
import Collapse from '@mui/material/Collapse';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { eventCalendarViewSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { ResourcesTree } from '../resources-tree';
import { usePreferencesMenuItems } from '../header-toolbar/preferences-menu';
import { useEventCalendarStyledContext } from '../EventCalendarStyledContext';
import type { SidePanelDrawerProps } from './SidePanelDrawer.types';

const SidePanelDrawerRoot = styled(Drawer, {
  name: 'MuiEventCalendar',
  slot: 'SidePanelDrawerViewport',
})(({ theme }) => ({
  // Scope the modal to the calendar root (which is `position: relative` and owns the
  // root container query), instead of the default fixed, full-viewport overlay.
  position: 'absolute',
  zIndex: theme.zIndex.drawer,
  '& .MuiBackdrop-root': {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  '& .MuiDrawer-paper': {
    position: 'absolute',
    boxSizing: 'border-box',
    width: 'min(20rem, 85%)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: (theme.vars || theme).palette.background.paper,
    borderRight: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    overflowY: 'auto',
    overscrollBehavior: 'contain',
  },
}));

const SidePanelDrawerHeader = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'SidePanelDrawerHeader',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  borderBottom: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  padding: theme.spacing(2),
}));

const SidePanelDrawerTitle = styled('h2', {
  name: 'MuiEventCalendar',
  slot: 'SidePanelDrawerTitle',
})(({ theme }) => ({
  flex: 1,
  margin: 0,
  ...theme.typography.h6,
  fontWeight: theme.typography.fontWeightBold,
}));

const SidePanelDrawerViewList = styled(MenuList, {
  name: 'MuiEventCalendar',
  slot: 'SidePanelDrawerViewList',
})(({ theme }) => ({
  borderBottom: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
}));

const SidePanelDrawerResources = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'SidePanelDrawerResources',
})(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  borderBottom: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
}));

const VIEW_ICONS = {
  day: <CalendarViewDayOutlined fontSize="small" />,
  week: <CalendarViewWeekOutlined fontSize="small" />,
  month: <CalendarViewMonthOutlined fontSize="small" />,
  agenda: <ViewAgendaOutlined fontSize="small" />,
};

/**
 * Mobile-only side panel (MUI temporary `Drawer`) with view switching, resources, and
 * preferences (inline `Collapse`). Portaled into the calendar root to stay container-scoped.
 */
export const SidePanelDrawer = React.forwardRef(function SidePanelDrawer(
  props: SidePanelDrawerProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { open, onClose, container, className, ...other } = props;

  const store = useEventCalendarStoreContext();
  const adapter = useAdapterContext();
  const { schedulerId, classes, localeText } = useEventCalendarStyledContext();

  const views = useStore(store, eventCalendarViewSelectors.views);
  const view = useStore(store, eventCalendarViewSelectors.view);
  const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);

  const { hasAnyOption, items: preferencesItems } = usePreferencesMenuItems();

  const [preferencesOpen, setPreferencesOpen] = React.useState(false);

  const showViewSwitcher = views.length > 1;

  const titleId = `${schedulerId}-side-panel-drawer-title`;

  // Scope the drawer to the calendar root so it renders inside its bounds and
  // container query rather than portaling to `document.body`.
  const portalContainer = container?.current ?? undefined;

  // Collapse the preferences section when the drawer closes, so the next open
  // always starts with it collapsed.
  React.useEffect(() => {
    if (!open) {
      setPreferencesOpen(false);
    }
  }, [open]);

  return (
    <SidePanelDrawerRoot
      anchor="left"
      open={open}
      onClose={onClose}
      className={classes.sidePanelDrawerViewport}
      // Hide the drawer on the desktop layout via the root container query, so an
      // open mobile drawer can never linger over the desktop calendar after a resize.
      data-mobile-only=""
      slotProps={{
        root: { container: portalContainer, disableScrollLock: true },
        backdrop: { className: classes.sidePanelDrawerBackdrop },
        paper: {
          ref: forwardedRef,
          ...other,
          className: clsx(className, classes.sidePanelDrawer),
          role: 'dialog',
          'aria-modal': true,
          'aria-labelledby': titleId,
        },
      }}
    >
      <SidePanelDrawerHeader className={classes.sidePanelDrawerHeader}>
        <SidePanelDrawerTitle id={titleId} className={classes.sidePanelDrawerTitle}>
          {adapter.format(visibleDate, 'monthFullLetter')}{' '}
          {adapter.format(visibleDate, 'yearPadded')}
        </SidePanelDrawerTitle>
        <IconButton
          className={classes.sidePanelDrawerCloseButton}
          aria-label={localeText.closeSidePanel}
          onClick={onClose}
        >
          <Close />
        </IconButton>
      </SidePanelDrawerHeader>

      {showViewSwitcher && (
        <SidePanelDrawerViewList className={classes.sidePanelDrawerViewList} role="listbox">
          {views.map((viewItem) => (
            <MenuItem
              key={viewItem}
              className={classes.sidePanelDrawerViewItem}
              role="option"
              selected={view === viewItem}
              aria-selected={view === viewItem}
              onClick={(event) => store.setView(viewItem, event.nativeEvent)}
            >
              <ListItemIcon>{VIEW_ICONS[viewItem]}</ListItemIcon>
              <ListItemText>{localeText[viewItem]}</ListItemText>
            </MenuItem>
          ))}
        </SidePanelDrawerViewList>
      )}

      <SidePanelDrawerResources>
        <ResourcesTree />
      </SidePanelDrawerResources>

      {hasAnyOption && (
        <React.Fragment>
          <div className={classes.sidePanelDrawerPreferences}>
            <ListItemButton
              className={classes.sidePanelDrawerPreferencesButton}
              aria-expanded={preferencesOpen}
              onClick={() => setPreferencesOpen((prev) => !prev)}
            >
              <ListItemIcon>
                <SettingsOutlined />
              </ListItemIcon>
              <ListItemText>{localeText.preferencesMenu}</ListItemText>
              <ListItemIcon>
                {preferencesOpen ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
              </ListItemIcon>
            </ListItemButton>
          </div>
          <Collapse in={preferencesOpen} unmountOnExit>
            <MenuList
              className={classes.sidePanelDrawerPreferencesList}
              aria-label={localeText.preferencesMenu}
            >
              {preferencesItems}
            </MenuList>
          </Collapse>
        </React.Fragment>
      )}
    </SidePanelDrawerRoot>
  );
});
