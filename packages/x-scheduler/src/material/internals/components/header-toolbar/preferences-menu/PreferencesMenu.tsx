'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useStore } from '@base-ui-components/utils/store';
import { CheckIcon, ChevronRight, Settings } from 'lucide-react';
import { Menu } from '@base-ui-components/react/menu';
import {
  EventCalendarPreferences,
  EventCalendarPreferencesMenuConfig,
} from '../../../../../primitives/models';
import { useTranslations } from '../../../utils/TranslationsContext';
import { useEventCalendarStoreContext } from '../../../../../primitives/use-event-calendar-store-context';
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
  const store = useEventCalendarStoreContext();
  const preferences = useStore(store, selectors.preferences);
  const preferencesMenuConfig = useStore(store, selectors.preferencesMenuConfig);

  const handleToggle = (key: keyof EventCalendarPreferences, checked: boolean, event: Event) => {
    store.setPreferences({ [key]: checked }, event);
  };

  const handleTimeFormatChange = (value: '12' | '24', event: Event) => {
    store.setPreferences({ ampm: value === '12' }, event);
  };

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

  const visibleOptions = preferenceOptions.filter(
    (option) => !!preferencesMenuConfig?.[option.configKey],
  );

  const showTimeFormatSubmenu = preferencesMenuConfig?.toggleAmpm;

  if (!showTimeFormatSubmenu && visibleOptions.length === 0) {
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
              {showTimeFormatSubmenu && (
                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger className="SubmenuTrigger">
                    <span>{translations.timeFormat}</span>
                    <ChevronRight size={14} strokeWidth={1.5} />
                  </Menu.SubmenuTrigger>

                  <Menu.Portal>
                    <Menu.Positioner className="MenuPositioner" alignOffset={-4} sideOffset={4}>
                      <Menu.Popup className="MenuPopup">
                        <Menu.RadioGroup
                          aria-label={translations.timeFormat}
                          value={preferences.ampm ? '12' : '24'}
                          onValueChange={(val, eventDetails) =>
                            handleTimeFormatChange(val, eventDetails.event)
                          }
                        >
                          <Menu.RadioItem value="12" className="RadioItem">
                            <span>{translations.amPm12h}</span>
                            <Menu.RadioItemIndicator className="RadioItemIndicator" />
                          </Menu.RadioItem>
                          <Menu.RadioItem value="24" className="RadioItem">
                            <span>{translations.hour24h}</span>
                            <Menu.RadioItemIndicator className="RadioItemIndicator" />
                          </Menu.RadioItem>
                        </Menu.RadioGroup>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>
              )}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
});
