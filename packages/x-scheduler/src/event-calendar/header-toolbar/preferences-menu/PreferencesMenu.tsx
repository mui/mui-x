'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { useStore } from '@base-ui/utils/store';
import CheckIcon from '@mui/icons-material/Check';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import {
  CalendarView,
  EventCalendarPreferences,
  EventCalendarPreferencesMenuConfig,
} from '@mui/x-scheduler-headless/models';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import {
  eventCalendarPreferenceSelectors,
  eventCalendarViewSelectors,
} from '@mui/x-scheduler-headless/event-calendar-selectors';
import clsx from 'clsx';
import { useEventCalendarStyledContext } from '../../EventCalendarStyledContext';

const PreferencesMenuRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'PreferencesMenu',
})({});

const PreferencesListSubheader = styled(ListSubheader, {
  name: 'MuiEventCalendar',
  slot: 'PreferencesListSubheader',
})(({ theme }) => ({
  ...theme.typography.button,
  color: theme.palette.text.disabled,
  paddingBottom: theme.spacing(1),
  backgroundColor: 'transparent',
}));

export const PreferencesMenu = React.forwardRef(function PreferencesMenu(
  props: React.HTMLAttributes<HTMLDivElement>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // Context hooks
  const { classes, localeText } = useEventCalendarStyledContext();
  const store = useEventCalendarStoreContext();

  // Ref hooks
  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);

  // Selector hooks
  const currentView = useStore(store, eventCalendarViewSelectors.view);
  const preferences = useStore(store, eventCalendarPreferenceSelectors.all);
  const preferencesMenuConfig = useStore(store, eventCalendarPreferenceSelectors.menuConfig);

  // State hooks (must come before any early returns)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleToggle = (key: keyof EventCalendarPreferences, checked: boolean, event: Event) => {
    store.setPreferences({ [key]: checked }, event);
  };

  const handleTimeFormatChange = (value: '12' | '24', event: Event) => {
    store.setPreferences({ ampm: value === '12' }, event);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Early return if config is false
  if (preferencesMenuConfig === false) {
    return null;
  }

  const preferenceOptions: {
    configKey: keyof EventCalendarPreferencesMenuConfig;
    preferenceKey: keyof EventCalendarPreferences;
    label: string;
  }[] = [
    {
      configKey: 'toggleWeekendVisibility',
      preferenceKey: 'showWeekends',
      label: localeText.showWeekends,
    },
    {
      configKey: 'toggleWeekNumberVisibility',
      preferenceKey: 'showWeekNumber',
      label: localeText.showWeekNumber,
    },
  ];

  const viewSpecificPreferenceOptions: {
    configKey: keyof EventCalendarPreferencesMenuConfig;
    preferenceKey: keyof EventCalendarPreferences;
    view: CalendarView;
    label: string;
  }[] = [
    {
      configKey: 'toggleEmptyDaysInAgenda',
      preferenceKey: 'showEmptyDaysInAgenda',
      view: 'agenda',
      label: localeText.showEmptyDaysInAgenda,
    },
  ];

  const visibleOptions = preferenceOptions.filter(
    (option) => preferencesMenuConfig?.[option.configKey] !== false,
  );

  const visibleViewSpecificOptions = viewSpecificPreferenceOptions.filter(
    (option) => preferencesMenuConfig?.[option.configKey] !== false && option.view === currentView,
  );

  const showSpecificOptions = visibleViewSpecificOptions.length > 0;
  const showTimeFormatSubmenu = preferencesMenuConfig?.toggleAmpm !== false;

  // Early return if no menu items to show
  if (!showTimeFormatSubmenu && visibleOptions.length === 0 && !showSpecificOptions) {
    return null;
  }

  return (
    <PreferencesMenuRoot
      ref={handleRef}
      {...props}
      className={clsx(props.className, classes.preferencesMenu)}
    >
      <IconButton
        aria-label={localeText.preferencesMenu}
        onClick={handleClick}
        aria-controls={open ? 'preferences-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <SettingsOutlined />
      </IconButton>
      <Menu
        id="preferences-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        container={containerRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          list: { 'aria-label': localeText.preferencesMenu },
          paper: { sx: { minWidth: 220 } },
        }}
      >
        {visibleOptions.map((option) => (
          <MenuItem
            key={option.configKey}
            onClick={(event) => {
              handleToggle(
                option.preferenceKey,
                !preferences[option.preferenceKey],
                event.nativeEvent,
              );
            }}
          >
            <ListItemText>{option.label}</ListItemText>
            {preferences[option.preferenceKey] && (
              <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                <CheckIcon fontSize="small" />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
        {showTimeFormatSubmenu && visibleOptions.length > 0 && <Divider />}
        {showTimeFormatSubmenu && (
          <PreferencesListSubheader>{localeText.timeFormat}</PreferencesListSubheader>
        )}
        {showTimeFormatSubmenu && (
          <MenuItem
            onClick={(event) => {
              handleTimeFormatChange('12', event.nativeEvent);
            }}
          >
            <ListItemText>{localeText.amPm12h}</ListItemText>
            {preferences.ampm && (
              <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                <CheckIcon fontSize="small" />
              </ListItemIcon>
            )}
          </MenuItem>
        )}
        {showTimeFormatSubmenu && (
          <MenuItem
            onClick={(event) => {
              handleTimeFormatChange('24', event.nativeEvent);
            }}
          >
            <ListItemText>{localeText.hour24h}</ListItemText>
            {!preferences.ampm && (
              <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                <CheckIcon fontSize="small" />
              </ListItemIcon>
            )}
          </MenuItem>
        )}
        {showSpecificOptions && (visibleOptions.length > 0 || showTimeFormatSubmenu) && <Divider />}
        {showSpecificOptions && (
          <PreferencesListSubheader>
            {localeText.viewSpecificOptions(currentView)}
          </PreferencesListSubheader>
        )}
        {showSpecificOptions &&
          visibleViewSpecificOptions.map((option) => (
            <MenuItem
              key={option.configKey}
              onClick={(event) => {
                handleToggle(
                  option.preferenceKey,
                  !preferences[option.preferenceKey],
                  event.nativeEvent,
                );
              }}
            >
              <ListItemText>{option.label}</ListItemText>
              {preferences[option.preferenceKey] && (
                <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                  <CheckIcon fontSize="small" />
                </ListItemIcon>
              )}
            </MenuItem>
          ))}
      </Menu>
    </PreferencesMenuRoot>
  );
});
