'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Menu } from '@base-ui-components/react/menu';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useStore } from '@base-ui-components/utils/store';
import { ChevronDown } from 'lucide-react';
import { Menubar } from '@base-ui-components/react/menubar';
import { CalendarView } from '../../../../../primitives/models';
import { useTranslations } from '../../../utils/TranslationsContext';
import { useEventCalendarContext } from '../../../hooks/useEventCalendarContext';
import { selectors } from '../../../../../primitives/use-event-calendar';
import './ViewSwitcher.css';

export const ViewSwitcher = React.forwardRef(function ViewSwitcher(
  props: React.HTMLAttributes<HTMLDivElement>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;

  const { store, instance } = useEventCalendarContext();
  const views = useStore(store, selectors.views);
  const view = useStore(store, selectors.view);

  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);
  const translations = useTranslations();

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const newView = event.currentTarget.getAttribute('data-view');
      if (newView) {
        instance.setView(newView as CalendarView, event);
      }
    },
    [instance],
  );

  const showAll = views.length <= 3;
  const visible = showAll ? views : views.slice(0, 2);
  const dropdown = showAll ? [] : views.slice(2);
  const currentOverflowView = dropdown.includes(view) ? view : null;
  const dropdownLabel = currentOverflowView
    ? translations[currentOverflowView]
    : translations.other;

  return (
    <div ref={handleRef} className={clsx('ViewSwitcherContainer', className)} {...other}>
      <Menubar className="ViewSwitcherMenuBar">
        {visible.map((visibleView) => (
          <button
            key={visibleView}
            className="ViewSwitcherMainItem"
            onClick={handleClick}
            data-view={visibleView}
            type="button"
            data-pressed={view === visibleView || undefined}
            aria-pressed={view === visibleView}
          >
            {translations[visibleView]}
          </button>
        ))}
        {dropdown.length > 0 && (
          <Menu.Root>
            <Menu.Trigger
              className="ViewSwitcherMainItem"
              data-view="other"
              data-highlighted={dropdown.includes(view) || undefined}
            >
              {dropdownLabel} <ChevronDown size={16} strokeWidth={2} />
            </Menu.Trigger>
            <Menu.Portal container={containerRef}>
              <Menu.Positioner
                className="ViewSwitcherMenuPositioner"
                sideOffset={9}
                align="end"
                alignOffset={-4}
              >
                <Menu.Popup className="ViewSwitcherMenuPopup">
                  <Menu.RadioGroup
                    value={view}
                    onValueChange={instance.setView}
                    className="ViewSwitcherRadioGroup"
                  >
                    {dropdown.map((dropdownView) => (
                      <Menu.RadioItem
                        key={dropdownView}
                        className="ViewSwitcherRadioItem"
                        value={dropdownView}
                        closeOnClick
                      >
                        {translations[dropdownView]}
                      </Menu.RadioItem>
                    ))}
                  </Menu.RadioGroup>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        )}
      </Menubar>
    </div>
  );
});
