'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Menubar } from '@base-ui-components/react/menubar';
import { Menu } from '@base-ui-components/react/menu';
import useForkRef from '@mui/utils/useForkRef';
import { ChevronDown } from 'lucide-react';
import { ViewSwitcherProps, ViewType } from './ViewSwitcher.types';
import { useTranslations } from '../../utils/TranslationsContext';
import './ViewSwitcher.css';

const DEFAULT_VIEWS = ['week', 'day', 'month', 'agenda'] as ViewType[];

export const ViewSwitcher = React.forwardRef(function ViewSwitcher(
  props: ViewSwitcherProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, views = DEFAULT_VIEWS, ...other } = props;

  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useForkRef(forwardedRef, containerRef);
  const translations = useTranslations();
  const [selectedView, setSelectedView] = React.useState<ViewType>('week');

  const LABELS: Record<string, string> = React.useMemo(
    () => ({
      week: translations.week,
      day: translations.day,
      month: translations.month,
      agenda: translations.agenda,
      other: translations.other,
    }),
    [translations],
  );

  const handleClick = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    const view = event.currentTarget.getAttribute('data-view');
    if (view) {
      setSelectedView(view as ViewType);
    }
  }, []);

  const showAll = views.length <= 3;
  const visible = showAll ? views : views.slice(0, 2);
  const dropdown = showAll ? [] : views.slice(2);
  const selectedOverflowView = dropdown.includes(selectedView) ? selectedView : null;
  const dropdownLabel = selectedOverflowView ? LABELS[selectedOverflowView] : LABELS.other;

  return (
    <div ref={handleRef} className={clsx('ViewSwitcherContainer', className)} {...other}>
      <Menubar className="ViewSwitcherMenuBar">
        {visible.map((view) => (
          <button
            key={view}
            className="ViewSwitcherMainItem"
            onClick={handleClick}
            data-view={view}
            type="button"
            data-pressed={selectedView === view || undefined}
          >
            {LABELS[view]}
          </button>
        ))}
        {dropdown.length > 0 && (
          <Menu.Root>
            <Menu.Trigger
              className="ViewSwitcherMainItem"
              data-view="other"
              data-highlighted={dropdown.includes(selectedView) || undefined}
            >
              {dropdownLabel} <ChevronDown size={16} strokeWidth={2} />
            </Menu.Trigger>
            <Menu.Portal container={containerRef}>
              <Menu.Positioner
                className="ViewSwitcherMenuPositioner"
                sideOffset={9}
                alignOffset={({ anchor, positioner }) => {
                  const paddingLeft = 4;
                  return -(positioner.width - anchor.width - paddingLeft);
                }}
              >
                <Menu.Popup className="ViewSwitcherMenuPopup">
                  {dropdown.map((view) => (
                    <Menu.Item
                      key={view}
                      className="ViewSwitcherMenuItem"
                      onClick={handleClick}
                      data-view={view}
                      data-selected={selectedView === view || undefined}
                    >
                      {LABELS[view]}
                    </Menu.Item>
                  ))}
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        )}
      </Menubar>
    </div>
  );
});
