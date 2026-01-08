'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { useStore } from '@base-ui/utils/store';
import { CheckIcon, ChevronRight, Settings } from 'lucide-react';
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
import { useTranslations } from '../../../internals/utils/TranslationsContext';

const PreferencesMenuRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'PreferencesMenu',
})({});

export const PreferencesMenu = React.forwardRef(function PreferencesMenu(
  props: React.HTMLAttributes<HTMLDivElement>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // Context hooks
  const translations = useTranslations();
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
  const [timeFormatAnchorEl, setTimeFormatAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const timeFormatOpen = Boolean(timeFormatAnchorEl);

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

  const handleTimeFormatClick = (event: React.MouseEvent<HTMLElement>) => {
    setTimeFormatAnchorEl(event.currentTarget);
  };

  const handleTimeFormatClose = () => {
    setTimeFormatAnchorEl(null);
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
      label: translations.showWeekends,
    },
    {
      configKey: 'toggleWeekNumberVisibility',
      preferenceKey: 'showWeekNumber',
      label: translations.showWeekNumber,
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
      label: translations.showEmptyDaysInAgenda,
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
    <PreferencesMenuRoot ref={handleRef} {...props}>
      <IconButton
        aria-label={translations.preferencesMenu}
        onClick={handleClick}
        aria-controls={open ? 'preferences-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Settings size={20} strokeWidth={1.5} />
      </IconButton>
      <Menu
        id="preferences-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        container={containerRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ list: { 'aria-label': translations.preferencesMenu } }}
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
                <CheckIcon size={16} strokeWidth={1.5} />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
        {showTimeFormatSubmenu && (
          <MenuItem onClick={handleTimeFormatClick}>
            <ListItemText>{translations.timeFormat}</ListItemText>
            <ChevronRight size={14} strokeWidth={1.5} />
          </MenuItem>
        )}
        {showSpecificOptions && visibleOptions.length > 0 && <Divider />}
        {showSpecificOptions && (
          <ListSubheader>{translations.viewSpecificOptions(currentView)}</ListSubheader>
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
                  <CheckIcon size={16} strokeWidth={1.5} />
                </ListItemIcon>
              )}
            </MenuItem>
          ))}
      </Menu>
      {/* Time format submenu */}
      <Menu
        anchorEl={timeFormatAnchorEl}
        open={timeFormatOpen}
        onClose={handleTimeFormatClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem
          selected={preferences.ampm}
          onClick={(event) => {
            handleTimeFormatChange('12', event.nativeEvent);
            handleTimeFormatClose();
            handleClose();
          }}
        >
          <ListItemText>{translations.amPm12h}</ListItemText>
          {preferences.ampm && (
            <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
              <CheckIcon size={16} strokeWidth={1.5} />
            </ListItemIcon>
          )}
        </MenuItem>
        <MenuItem
          selected={!preferences.ampm}
          onClick={(event) => {
            handleTimeFormatChange('24', event.nativeEvent);
            handleTimeFormatClose();
            handleClose();
          }}
        >
          <ListItemText>{translations.hour24h}</ListItemText>
          {!preferences.ampm && (
            <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
              <CheckIcon size={16} strokeWidth={1.5} />
            </ListItemIcon>
          )}
        </MenuItem>
      </Menu>
    </PreferencesMenuRoot>
  );
});
