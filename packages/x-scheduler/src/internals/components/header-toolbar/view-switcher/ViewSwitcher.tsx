'use client';
import * as React from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { Menu } from '@base-ui-components/react/menu';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { Menubar } from '@base-ui-components/react/menubar';
import { TimelineView, CalendarView } from '@mui/x-scheduler-headless/models';
import { useTranslations } from '../../../utils/TranslationsContext';

export interface ViewSwitcherProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  views: T[];
  view: T;
  onViewChange: (view: T, event: Event | React.MouseEvent<HTMLElement>) => void;
}

type ViewSwitcherComponent = <T extends string>(
  props: ViewSwitcherProps<T> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  },
) => React.ReactElement | null;

export const ViewSwitcher = React.forwardRef(function ViewSwitcher<
  T extends TimelineView | CalendarView,
>(props: ViewSwitcherProps<T>, forwardedRef: React.ForwardedRef<HTMLDivElement>) {
  const { className, views, onViewChange, view, ...other } = props;

  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);
  const translations = useTranslations();

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const newView = (event.currentTarget as HTMLElement).getAttribute('data-view') as T;
      if (newView) {
        onViewChange(newView, event);
      }
    },
    [onViewChange],
  );

  const handleViewChange = React.useCallback(
    (newView: T, eventDetails: Menu.Root.ChangeEventDetails) => {
      onViewChange(newView, eventDetails.event);
    },
    [onViewChange],
  );

  const showAll = views.length <= 3;
  const visible = showAll ? views : views.slice(0, 2);
  const dropdown = React.useMemo(() => (showAll ? [] : views.slice(2)), [showAll, views]);

  const [state, setState] = React.useState<{
    dropdownView: T | null;
    prevView: T | null;
    prevViews: T[];
  }>({ dropdownView: dropdown[0], prevView: view, prevViews: views });

  // making sure we persist the last selected item from the menu, so when switching to a different view, the last item in the menu bar does not automatically change back to the initial value of dropdown[0]
  if (state.prevView !== view || state.prevViews !== views) {
    let newDropdownView: T | null;
    if (dropdown.includes(view)) {
      newDropdownView = view;
    } else if (state.dropdownView != null && views.includes(state.dropdownView)) {
      newDropdownView = state.dropdownView;
    } else {
      newDropdownView = dropdown[0] ?? null;
    }

    setState({
      prevView: view,
      prevViews: views,
      dropdownView: newDropdownView,
    });
  }

  return (
    <div ref={handleRef} className={clsx('ViewSwitcherContainer', className)} {...other}>
      <Menubar className="MenuBar">
        {visible.map((visibleView) => (
          <button
            key={visibleView}
            className="MainItem"
            onClick={handleClick}
            data-view={visibleView}
            type="button"
            data-pressed={view === visibleView || undefined}
            aria-pressed={view === visibleView}
          >
            {translations[visibleView]}
          </button>
        ))}

        {!!state.dropdownView && (
          <React.Fragment>
            <button
              className="MainItem"
              onClick={handleClick}
              data-view={state.dropdownView}
              type="button"
              data-pressed={view === state.dropdownView || undefined}
              aria-pressed={view === state.dropdownView}
            >
              {translations[state.dropdownView]}
            </button>
            <Menu.Root>
              <Menu.Trigger className="MainItem" data-view="other" aria-label="Show more views">
                <ChevronDown size={16} strokeWidth={1.5} />
              </Menu.Trigger>
              <Menu.Portal container={containerRef}>
                <Menu.Positioner
                  className="MenuPositioner "
                  sideOffset={9}
                  align="end"
                  alignOffset={-4}
                >
                  <Menu.Popup className="MenuPopup ">
                    <Menu.RadioGroup
                      value={view}
                      onValueChange={handleViewChange}
                      className="RadioGroup "
                    >
                      {dropdown.map((dropdownView) => (
                        <Menu.RadioItem
                          key={dropdownView}
                          className="RadioItem"
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
          </React.Fragment>
        )}
      </Menubar>
    </div>
  );
}) as ViewSwitcherComponent;
