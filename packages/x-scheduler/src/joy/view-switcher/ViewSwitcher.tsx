'use client';
import * as React from 'react';
import clsx from 'clsx';
import { ViewSwitcherProps } from './ViewSwitcher.types';
import './ViewSwitcher.css';
import { Menubar } from '@base-ui-components/react/menubar';
import { Menu } from '@base-ui-components/react/menu';
import useForkRef from '@mui/utils/useForkRef';
import { ChevronDown } from 'lucide-react';

function getLabelForView(view: string): string {
  switch (view) {
    case 'month':
      return 'Month';
    case 'agenda':
      return 'Agenda';
    default:
      return 'Other';
  }
}

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
  const { className, ...other } = props;

  const containerRef = React.useRef<HTMLElement | null>(null);
  const container = useStableContainer(containerRef);
  const handleRef = useForkRef(forwardedRef, containerRef);

  const [selectedView, setSelectedView] = React.useState<string>('week');

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    const view = event.currentTarget.getAttribute('data-view');
    if (view) {
      setSelectedView(view);
    }
  }

  return (
    <div ref={handleRef} className={clsx('ViewSwitcherContainer', className)} {...other}>
      <Menubar className="ViewSwitcherMenuBar">
        <Menu.Root>
          <Menu.Trigger className="ViewSwitcherMenuTrigger" onClick={handleClick} data-view="week">
            Week
          </Menu.Trigger>
        </Menu.Root>
        <Menu.Root>
          <Menu.Trigger className="ViewSwitcherMenuTrigger" onClick={handleClick} data-view="day">
            Day
          </Menu.Trigger>
        </Menu.Root>
        <Menu.Root>
          <Menu.Trigger className="ViewSwitcherMenuTrigger" data-view="other">
            {getLabelForView(selectedView)} <ChevronDown size={16} strokeWidth={2} />
          </Menu.Trigger>
          <Menu.Portal container={container}>
            <Menu.Positioner
              className="ViewSwitcherMenuPositioner"
              sideOffset={9}
              alignOffset={({ anchor, positioner }) => {
                const paddinLeft = 4;
                return -(positioner.width - anchor.width - paddinLeft);
              }}
            >
              <Menu.Popup className="ViewSwitcherMenuPopup">
                <Menu.Item className="ViewSwitcherMenuItem" onClick={handleClick} data-view="month">
                  Month
                </Menu.Item>
                <Menu.Item
                  className="ViewSwitcherMenuItem"
                  onClick={handleClick}
                  data-view="agenda"
                >
                  Agenda
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </Menubar>
    </div>
  );
});
