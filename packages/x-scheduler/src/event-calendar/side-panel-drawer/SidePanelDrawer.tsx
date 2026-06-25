'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui/utils/store';
import { Drawer } from '@base-ui/react/drawer';
import { styled } from '@mui/material/styles';
import Close from '@mui/icons-material/Close';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ChevronRight from '@mui/icons-material/ChevronRight';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import CalendarViewMonthOutlined from '@mui/icons-material/CalendarViewMonthOutlined';
import CalendarViewWeekOutlined from '@mui/icons-material/CalendarViewWeekOutlined';
import CalendarViewDayOutlined from '@mui/icons-material/CalendarViewDayOutlined';
import ViewAgendaOutlined from '@mui/icons-material/ViewAgendaOutlined';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { eventCalendarViewSelectors } from '@mui/x-scheduler-internals/event-calendar-selectors';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { ResourcesTree } from '../resources-tree';
import { usePreferencesMenuItems } from '../header-toolbar/preferences-menu';
import { useEventCalendarStyledContext } from '../EventCalendarStyledContext';
import { SidePanelDrawerProps } from './SidePanelDrawer.types';

const SidePanelDrawerBackdrop = styled(Drawer.Backdrop, {
  name: 'MuiEventCalendar',
  slot: 'SidePanelDrawerBackdrop',
})(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  zIndex: theme.zIndex.drawer,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  // Fades out as the popup is swiped away, then in/out with the open transition.
  opacity: 'calc(1 - var(--drawer-swipe-progress, 0))',
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.enteringScreen,
  }),
  '&[data-starting-style], &[data-ending-style]': {
    opacity: 0,
  },
  '&[data-swiping]': {
    transition: 'none',
  },
}));

const SidePanelDrawerViewport = styled(Drawer.Viewport, {
  name: 'MuiEventCalendar',
  slot: 'SidePanelDrawerViewport',
})(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  zIndex: theme.zIndex.drawer,
  display: 'flex',
  justifyContent: 'flex-start',
}));

const SidePanelDrawerPopup = styled(Drawer.Popup, {
  name: 'MuiEventCalendar',
  slot: 'SidePanelDrawerPopup',
})(({ theme }) => ({
  boxSizing: 'border-box',
  width: 'min(20rem, 85%)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: (theme.vars || theme).palette.background.paper,
  borderRight: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  outline: 0,
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  willChange: 'transform',
  // Follows the finger while swiping; the open/close transition animates from
  // the off-screen position declared in the starting/ending styles below.
  transform: 'translateX(var(--drawer-swipe-movement-x, 0px))',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.enteringScreen,
  }),
  '&[data-starting-style], &[data-ending-style]': {
    transform: 'translateX(-100%)',
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

const SidePanelDrawerTitle = styled(Drawer.Title, {
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
  flexGrow: 1,
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
 * Mobile-only side panel built on the Base UI `Drawer`. It mirrors the desktop
 * side panel actions (view switching, resources, preferences) but is laid out
 * for touch, and slides in from the leading edge with focus trapping, Escape /
 * backdrop dismissal, and swipe-to-dismiss handled by the primitive.
 *
 * It is portaled into the calendar root (`container`) rather than `document.body`,
 * so it stays scoped to the calendar's root container query (mobile-only, since
 * its only trigger — the header menu button — is hidden on wider screens) and is
 * positioned relative to the calendar instead of the viewport. It is SSR-safe:
 * closed on first paint and only mounted while open.
 *
 * The preferences options live in a nested `Drawer` that stacks over the main
 * one and is dismissed with the back button (or a swipe), replacing the previous
 * in-place layer swap.
 */
export const SidePanelDrawer = React.forwardRef(function SidePanelDrawer(
  props: SidePanelDrawerProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { open, onClose, container, className, ...other } = props;

  const store = useEventCalendarStoreContext();
  const adapter = useAdapterContext();
  const { classes, localeText } = useEventCalendarStyledContext();

  const views = useStore(store, eventCalendarViewSelectors.views);
  const view = useStore(store, eventCalendarViewSelectors.view);
  const visibleDate = useStore(store, schedulerOtherSelectors.visibleDate);

  const { hasAnyOption, items: preferencesItems } = usePreferencesMenuItems();

  const [preferencesOpen, setPreferencesOpen] = React.useState(false);

  const showViewSwitcher = views.length > 1;

  // Close the preferences layer when the drawer closes, so the next open always
  // starts on the main layer.
  React.useEffect(() => {
    if (!open) {
      setPreferencesOpen(false);
    }
  }, [open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  return (
    <Drawer.Provider>
      <Drawer.Root
        open={open}
        onOpenChange={handleOpenChange}
        swipeDirection="left"
        modal="trap-focus"
      >
        <Drawer.Portal container={container}>
          <SidePanelDrawerBackdrop className={classes.sidePanelDrawerBackdrop} />
          <SidePanelDrawerViewport className={classes.sidePanelDrawerViewport}>
            <SidePanelDrawerPopup
              ref={forwardedRef}
              {...other}
              className={clsx(className, classes.sidePanelDrawer)}
            >
              <SidePanelDrawerHeader className={classes.sidePanelDrawerHeader}>
                <SidePanelDrawerTitle className={classes.sidePanelDrawerTitle}>
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
                  <MenuList
                    className={classes.sidePanelDrawerPreferences}
                    aria-label={localeText.preferencesMenu}
                  >
                    <MenuItem
                      className={classes.sidePanelDrawerPreferencesButton}
                      role="button"
                      onClick={() => setPreferencesOpen(true)}
                    >
                      <ListItemIcon>
                        <SettingsOutlined />
                      </ListItemIcon>
                      <ListItemText>{localeText.preferencesMenu}</ListItemText>
                      <ListItemIcon>
                        <ChevronRight />
                      </ListItemIcon>
                    </MenuItem>
                  </MenuList>

                  <Drawer.Root
                    open={preferencesOpen}
                    onOpenChange={setPreferencesOpen}
                    swipeDirection="left"
                    modal="trap-focus"
                  >
                    <Drawer.Portal container={container}>
                      <SidePanelDrawerBackdrop className={classes.sidePanelDrawerBackdrop} />
                      <SidePanelDrawerViewport className={classes.sidePanelDrawerViewport}>
                        <SidePanelDrawerPopup className={classes.sidePanelDrawerPreferencesPopup}>
                          <SidePanelDrawerHeader className={classes.sidePanelDrawerHeader}>
                            <IconButton
                              className={classes.sidePanelDrawerBackButton}
                              aria-label={localeText.back}
                              onClick={() => setPreferencesOpen(false)}
                            >
                              <ArrowBack />
                            </IconButton>
                            <SidePanelDrawerTitle className={classes.sidePanelDrawerTitle}>
                              {localeText.preferencesMenu}
                            </SidePanelDrawerTitle>
                          </SidePanelDrawerHeader>
                          <MenuList
                            className={classes.sidePanelDrawerPreferencesList}
                            aria-label={localeText.preferencesMenu}
                          >
                            {preferencesItems}
                          </MenuList>
                        </SidePanelDrawerPopup>
                      </SidePanelDrawerViewport>
                    </Drawer.Portal>
                  </Drawer.Root>
                </React.Fragment>
              )}
            </SidePanelDrawerPopup>
          </SidePanelDrawerViewport>
        </Drawer.Portal>
      </Drawer.Root>
    </Drawer.Provider>
  );
});
