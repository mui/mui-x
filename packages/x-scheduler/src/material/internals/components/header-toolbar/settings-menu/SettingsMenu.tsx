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
import './SettingsMenu.css';

export const SettingsMenu = React.forwardRef(function SettingsMenu(
  props: React.HTMLAttributes<HTMLDivElement>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;

  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);
  const translations = useTranslations();
  const { store, instance } = useEventCalendarContext();
  const settings = useStore(store, selectors.settings);

  const handleHideWeekend = useEventCallback((checked: boolean, event: Event) => {
    instance.setSettings({ ...settings, hideWeekends: checked }, event);
  });

  return (
    <div ref={handleRef} className={clsx('SettingsMenuContainer', className)} {...other}>
      <Menu.Root>
        <Menu.Trigger
          aria-label={translations.settingsMenu}
          className={clsx('NeutralTextButton', 'Button', 'SettingsMenuButton')}
        >
          <Settings size={20} strokeWidth={1.5} />
        </Menu.Trigger>
        <Menu.Portal container={containerRef}>
          <Menu.Positioner className="SettingsMenuPositioner" sideOffset={4} align="end">
            <Menu.Popup className="SettingsMenuPopup">
              <Menu.CheckboxItem
                checked={settings.hideWeekends}
                onCheckedChange={handleHideWeekend}
                closeOnClick
                className="SettingsMenuCheckboxItem"
              >
                <span>{translations.hideWeekends}</span>
                <Menu.CheckboxItemIndicator className="SettingsMenuCheckboxIndicator">
                  <CheckIcon size={16} strokeWidth={1.5} />
                </Menu.CheckboxItemIndicator>
              </Menu.CheckboxItem>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
});
