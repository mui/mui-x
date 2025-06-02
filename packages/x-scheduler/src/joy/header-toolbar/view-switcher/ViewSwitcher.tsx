'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Menu } from '@base-ui-components/react/menu';
import useForkRef from '@mui/utils/useForkRef';
import { ChevronDown } from 'lucide-react';
import { ViewSwitcherProps, ViewType } from './ViewSwitcher.types';
import { useTranslations } from '../../utils/TranslationsContext';
import './ViewSwitcher.css';

export const DEFAULT_VIEWS = ['week', 'day', 'month', 'agenda'] as ViewType[];

export const ViewSwitcher = React.forwardRef(function ViewSwitcher(
  props: ViewSwitcherProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, views = DEFAULT_VIEWS, setSelectedView, selectedView, ...other } = props;

  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useForkRef(forwardedRef, containerRef);
  const translations = useTranslations();

  const showAll = views.length <= 3;
  const visible = showAll ? views : views.slice(0, 2);
  const dropdown = showAll ? [] : views.slice(2);
  const selectedOverflowView = dropdown.includes(selectedView) ? selectedView : null;
  const dropdownLabel = selectedOverflowView
    ? translations[selectedOverflowView]
    : translations.other;

  return (
    <div ref={handleRef} className={clsx('ViewSwitcherContainer', className)} {...other}>
      <Menu.Root>
        <Menu.RadioGroup
          className="ViewSwitcherMenuBar"
          value={selectedView}
          onValueChange={(view: ViewType) => setSelectedView(view)}
        >
          {visible.map((view) => (
            <Menu.RadioItem key={view} className="ViewSwitcherMainItem" value={view} tabIndex={0}>
              {translations[view]}
            </Menu.RadioItem>
          ))}
          {dropdown.length > 0 && (
            <React.Fragment>
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
                  align="end"
                  alignOffset={-4}
                >
                  <Menu.Popup className="ViewSwitcherMenuPopup">
                    {dropdown.map((view) => (
                      <Menu.RadioItem
                        key={view}
                        className="ViewSwitcherMenuItem"
                        value={view}
                        closeOnClick={true}
                      >
                        {translations[view]}
                      </Menu.RadioItem>
                    ))}
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </React.Fragment>
          )}
        </Menu.RadioGroup>
      </Menu.Root>
    </div>
  );
});
