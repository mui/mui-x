'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useStore } from '@base-ui-components/utils/store';
import { CheckIcon, Settings } from 'lucide-react';
import { Menu } from '@base-ui-components/react/menu';
import {
  CalendarPreferences,
  CalendarPreferencesMenuConfig,
} from '../../../../../primitives/models/preferences';
import { useTranslations } from '../../../utils/TranslationsContext';
import { useEventCalendarContext } from '../../../../../primitives/utils/useEventCalendarContext';
import { selectors } from '../../../../../primitives/use-event-calendar';
import './PreferencesMenu.css';

export const PreferencesMenu = React.forwardRef(function PreferencesMenu(
  props: React.HTMLAttributes<HTMLDivElement>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;

  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);
  const translations = useTranslations();
  const { store, instance } = useEventCalendarContext();
  const preferences = useStore(store, selectors.preferences);
  const preferencesMenuConfig = useStore(store, selectors.preferencesMenuConfig);

  const handleToggle = (key: keyof CalendarPreferences, checked: boolean, event: Event) => {
    instance.setPreferences({ [key]: checked }, event);
  };

  if (preferencesMenuConfig === false) {
    return null;
  }

  const preferenceOptions: {
    configKey: keyof CalendarPreferencesMenuConfig;
    preferenceKey: keyof CalendarPreferences;
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

  const visibleOptions = preferenceOptions.filter(
    (option) => !!preferencesMenuConfig?.[option.configKey],
  );

  if (visibleOptions.length === 0) {
    return null;
  }

  return (
    <div ref={handleRef} className={clsx('PreferencesMenuContainer', className)} {...other}>
      <Menu.Root>
        <Menu.Trigger
          aria-label={translations.preferencesMenu}
          className={clsx('OutlinedNeutralButton', 'Button', 'PreferencesMenuButton')}
        >
          <Settings size={20} strokeWidth={1.5} className="SettingsIcon" />
        </Menu.Trigger>
        <Menu.Portal container={containerRef}>
          <Menu.Positioner className="MenuPositioner" sideOffset={4} align="end">
            <Menu.Popup className="MenuPopup">
              {visibleOptions.map((option) => (
                <Menu.CheckboxItem
                  key={option.configKey}
                  checked={preferences[option.preferenceKey]}
                  onCheckedChange={(checked, eventDetails) =>
                    handleToggle(option.preferenceKey, checked, eventDetails.event)
                  }
                  className="CheckboxItem"
                >
                  <span>{option.label}</span>
                  <Menu.CheckboxItemIndicator className="CheckboxIndicator">
                    <CheckIcon size={16} strokeWidth={1.5} />
                  </Menu.CheckboxItemIndicator>
                </Menu.CheckboxItem>
              ))}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
});
