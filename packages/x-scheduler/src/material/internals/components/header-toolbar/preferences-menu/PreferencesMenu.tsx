'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useStore } from '@base-ui-components/utils/store';
import { CheckIcon, Settings } from 'lucide-react';
import { Menu } from '@base-ui-components/react/menu';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useTranslations } from '../../../utils/TranslationsContext';
import { useEventCalendarContext } from '../../../hooks/useEventCalendarContext';
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

  const handleHideWeekend = useEventCallback((checked: boolean, event: Event) => {
    instance.setPreferences({ hideWeekends: checked }, event);
  });

  if (preferencesMenuConfig === false || !preferencesMenuConfig?.toggleWeekendVisibility) {
    return null;
  }

  return (
    <div ref={handleRef} className={clsx('PreferencesMenuContainer', className)} {...other}>
      <Menu.Root>
        <Menu.Trigger
          aria-label={translations.preferencesMenu}
          className={clsx('NeutralTextButton', 'Button', 'PreferencesMenuButton')}
        >
          <Settings size={20} strokeWidth={1.5} />
        </Menu.Trigger>
        <Menu.Portal container={containerRef}>
          <Menu.Positioner className="PreferencesMenuPositioner" sideOffset={4} align="end">
            <Menu.Popup className="PreferencesMenuPopup">
              {preferencesMenuConfig.toggleWeekendVisibility && (
                <Menu.CheckboxItem
                  checked={preferences.hideWeekends}
                  onCheckedChange={handleHideWeekend}
                  closeOnClick
                  className="PreferencesMenuCheckboxItem"
                >
                  <span>{translations.hideWeekends}</span>
                  <Menu.CheckboxItemIndicator className="PreferencesMenuCheckboxIndicator">
                    <CheckIcon size={16} strokeWidth={1.5} />
                  </Menu.CheckboxItemIndicator>
                </Menu.CheckboxItem>
              )}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
});
