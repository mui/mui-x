'use client';
import * as React from 'react';
import clsx from 'clsx';
import { ViewSwitcherProps, ViewType } from './ViewSwitcher.types';
import './ViewSwitcher.css';
import { Menubar } from '@base-ui-components/react/menubar';
import { Menu } from '@base-ui-components/react/menu';
import useForkRef from '@mui/utils/useForkRef';
import { ChevronDown } from 'lucide-react';

const DEFAULT_VIEWS = ['week', 'day', 'month', 'agenda'] as ViewType[];

// TODO: Add localization
const LABELS: Record<string, string> = {
  week: 'Week',
  day: 'Day',
  month: 'Month',
  agenda: 'Agenda',
};

function useStableContainer(ref: React.RefObject<HTMLElement | null>) {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    if (ref.current) {
      setContainer(ref.current);
    }
  }, [ref]);

  return container;
}

export const ViewSwitcher = React.forwardRef(function ViewSwitcher(
  props: ViewSwitcherProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, views = DEFAULT_VIEWS, ...other } = props;

  const containerRef = React.useRef<HTMLElement | null>(null);
  const container = useStableContainer(containerRef);
  const handleRef = useForkRef(forwardedRef, containerRef);

  const [selectedView, setSelectedView] = React.useState<ViewType>('week');

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    const view = event.currentTarget.getAttribute('data-view');
    if (view) {
      setSelectedView(view as ViewType);
    }
  }

  const showAll = views.length <= 3;
  const visible = showAll ? views : views.slice(0, 2);
  const dropdown = showAll ? [] : views.slice(2);
  const selectedOverflowView = dropdown.includes(selectedView) ? selectedView : null;
  const dropdownLabel = selectedOverflowView ? LABELS[selectedOverflowView] : 'Other';

  return (
    <div ref={handleRef} className={clsx('ViewSwitcherContainer', className)} {...other}>
      <Menubar className="ViewSwitcherMenuBar">
        {visible.map((view) => (
          <Menu.Root key={view}>
            <Menu.Trigger
              className="ViewSwitcherMenuTrigger"
              onClick={handleClick}
              data-view={view}
            >
              {LABELS[view]}
            </Menu.Trigger>
          </Menu.Root>
        ))}
        {dropdown.length > 0 && (
          <Menu.Root>
            <Menu.Trigger className="ViewSwitcherMenuTrigger" data-view="other">
              {dropdownLabel} <ChevronDown size={16} strokeWidth={2} />
            </Menu.Trigger>
            <Menu.Portal container={container}>
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
