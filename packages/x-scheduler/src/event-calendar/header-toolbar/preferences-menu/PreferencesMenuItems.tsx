'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import CheckIcon from '@mui/icons-material/Check';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import type {
  CalendarView,
  EventCalendarPreferences,
  EventCalendarPreferencesMenuConfig,
} from '@mui/x-scheduler-internals/models';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import {
  eventCalendarPreferenceSelectors,
  eventCalendarViewSelectors,
} from '@mui/x-scheduler-internals/event-calendar-selectors';
import { useEventCalendarStyledContext } from '../../EventCalendarStyledContext';

const PreferencesMenuListItemIcon = styled(ListItemIcon, {
  name: 'MuiEventCalendar',
  slot: 'PreferencesMenuListItemIcon',
})({
  justifyContent: 'flex-end',
  '&[data-checked="false"]': {
    visibility: 'hidden',
  },
});

const PreferencesMenuListSubheader = styled(ListSubheader, {
  name: 'MuiEventCalendar',
  slot: 'PreferencesMenuListSubheader',
})(({ theme }) => ({
  ...theme.typography.button,
  color: (theme.vars || theme).palette.text.disabled,
  paddingBottom: theme.spacing(1),
  backgroundColor: 'transparent',
}));

/**
 * Computes which preference options are visible from the menu config and current view.
 * Shared by the desktop `PreferencesMenu` and the mobile `SidePanelDrawer`.
 */
export function usePreferencesMenuModel() {
  const store = useEventCalendarStoreContext();
  const { localeText } = useEventCalendarStyledContext();

  const currentView = useStore(store, eventCalendarViewSelectors.view);
  const preferencesMenuConfig = useStore(store, eventCalendarPreferenceSelectors.menuConfig);

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

  if (preferencesMenuConfig === false) {
    return {
      currentView,
      visibleOptions: [],
      visibleViewSpecificOptions: [],
      showTimeFormatSubmenu: false,
      showWeekStartsOnSubmenu: false,
      showSpecificOptions: false,
      hasAnyOption: false,
    };
  }

  const visibleOptions = preferenceOptions.filter(
    (option) => preferencesMenuConfig?.[option.configKey] !== false,
  );

  const visibleViewSpecificOptions = viewSpecificPreferenceOptions.filter(
    (option) => preferencesMenuConfig?.[option.configKey] !== false && option.view === currentView,
  );

  const showSpecificOptions = visibleViewSpecificOptions.length > 0;
  const showTimeFormatSubmenu = preferencesMenuConfig?.toggleAmpm !== false;
  const showWeekStartsOnSubmenu = preferencesMenuConfig?.toggleWeekStartsOn !== false;

  return {
    currentView,
    visibleOptions,
    visibleViewSpecificOptions,
    showTimeFormatSubmenu,
    showWeekStartsOnSubmenu,
    showSpecificOptions,
    hasAnyOption:
      showTimeFormatSubmenu ||
      showWeekStartsOnSubmenu ||
      visibleOptions.length > 0 ||
      showSpecificOptions,
  };
}

/**
 * Builds the preference options as a flat array of elements, so they spread into a
 * `Menu` (desktop) or `MenuList` (drawer). `hasAnyOption` is `false` when none show.
 */
export function usePreferencesMenuItems(): {
  hasAnyOption: boolean;
  items: React.ReactNode[];
} {
  const store = useEventCalendarStoreContext();
  const { classes, localeText } = useEventCalendarStyledContext();

  const preferences = useStore(store, eventCalendarPreferenceSelectors.all);
  const {
    currentView,
    visibleOptions,
    visibleViewSpecificOptions,
    showTimeFormatSubmenu,
    showWeekStartsOnSubmenu,
    showSpecificOptions,
    hasAnyOption,
  } = usePreferencesMenuModel();

  const handleToggle = (key: keyof EventCalendarPreferences, checked: boolean, event: Event) => {
    store.setPreferences({ [key]: checked }, event);
  };

  const handleTimeFormatChange = (value: '12' | '24', event: Event) => {
    store.setPreferences({ ampm: value === '12' }, event);
  };

  const handleWeekStartsOnChange = (value: 0 | 1 | 6, event: Event) => {
    store.setPreferences({ weekStartsOn: value }, event);
  };

  const items: React.ReactNode[] = [];

  if (!hasAnyOption) {
    return { hasAnyOption, items };
  }

  const showDividerBeforeTimeFormat = showTimeFormatSubmenu && visibleOptions.length > 0;
  const showDividerBeforeWeekStartsOn =
    showWeekStartsOnSubmenu && (visibleOptions.length > 0 || showTimeFormatSubmenu);
  const showDividerBeforeSpecificOptions =
    showSpecificOptions &&
    (visibleOptions.length > 0 || showTimeFormatSubmenu || showWeekStartsOnSubmenu);

  const renderCheckableItem = (
    key: React.Key,
    role: 'menuitemcheckbox' | 'menuitemradio',
    checked: boolean,
    label: string,
    onClick: (event: React.MouseEvent<HTMLLIElement>) => void,
  ) => (
    <MenuItem
      className={classes.preferencesMenuItem}
      key={key}
      role={role}
      aria-checked={checked}
      onClick={onClick}
    >
      <ListItemText className={classes.preferencesMenuListItemText}>{label}</ListItemText>
      <PreferencesMenuListItemIcon
        className={classes.preferencesMenuListItemIcon}
        data-checked={checked}
      >
        <CheckIcon fontSize="small" />
      </PreferencesMenuListItemIcon>
    </MenuItem>
  );

  visibleOptions.forEach((option) => {
    items.push(
      renderCheckableItem(
        option.configKey,
        'menuitemcheckbox',
        !!preferences[option.preferenceKey],
        option.label,
        (event) =>
          handleToggle(option.preferenceKey, !preferences[option.preferenceKey], event.nativeEvent),
      ),
    );
  });

  if (showDividerBeforeTimeFormat) {
    items.push(<Divider className={classes.preferencesMenuDivider} key="divider-time-format" />);
  }
  if (showTimeFormatSubmenu) {
    items.push(
      <PreferencesMenuListSubheader
        className={classes.preferencesMenuListSubheader}
        key="subheader-time-format"
      >
        {localeText.timeFormat}
      </PreferencesMenuListSubheader>,
      renderCheckableItem(
        'ampm-12',
        'menuitemradio',
        !!preferences.ampm,
        localeText.amPm12h,
        (event) => handleTimeFormatChange('12', event.nativeEvent),
      ),
      renderCheckableItem(
        'ampm-24',
        'menuitemradio',
        !preferences.ampm,
        localeText.hour24h,
        (event) => handleTimeFormatChange('24', event.nativeEvent),
      ),
    );
  }

  if (showDividerBeforeWeekStartsOn) {
    items.push(<Divider className={classes.preferencesMenuDivider} key="divider-week-start" />);
  }
  if (showWeekStartsOnSubmenu) {
    items.push(
      <PreferencesMenuListSubheader
        className={classes.preferencesMenuListSubheader}
        key="subheader-week-start"
      >
        {localeText.startWeekOn}
      </PreferencesMenuListSubheader>,
    );
    (
      [
        { value: 0, label: localeText.weekdaySunday },
        { value: 1, label: localeText.weekdayMonday },
        { value: 6, label: localeText.weekdaySaturday },
      ] as const
    ).forEach(({ value, label }) => {
      items.push(
        renderCheckableItem(
          `week-start-${value}`,
          'menuitemradio',
          preferences.weekStartsOn === value,
          label,
          (event) => handleWeekStartsOnChange(value, event.nativeEvent),
        ),
      );
    });
  }

  if (showDividerBeforeSpecificOptions) {
    items.push(<Divider className={classes.preferencesMenuDivider} key="divider-specific" />);
  }
  if (showSpecificOptions) {
    items.push(
      <PreferencesMenuListSubheader
        className={classes.preferencesMenuListSubheader}
        key="subheader-specific"
      >
        {localeText.viewSpecificOptions(currentView)}
      </PreferencesMenuListSubheader>,
    );
    visibleViewSpecificOptions.forEach((option) => {
      items.push(
        renderCheckableItem(
          option.configKey,
          'menuitemcheckbox',
          !!preferences[option.preferenceKey],
          option.label,
          (event) =>
            handleToggle(
              option.preferenceKey,
              !preferences[option.preferenceKey],
              event.nativeEvent,
            ),
        ),
      );
    });
  }

  return { hasAnyOption, items };
}
