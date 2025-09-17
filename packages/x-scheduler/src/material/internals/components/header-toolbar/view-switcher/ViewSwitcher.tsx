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
import { useEventCalendarStoreContext } from '../../../../../primitives/utils/useEventCalendarStoreContext';
import { selectors } from '../../../../../primitives/use-event-calendar';

export const ViewSwitcher = React.forwardRef(function ViewSwitcher(
  props: React.HTMLAttributes<HTMLDivElement>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;

  const store = useEventCalendarStoreContext();
  const views = useStore(store, selectors.views);
  const view = useStore(store, selectors.view);

  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);
  const translations = useTranslations();

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const newView = event.currentTarget.getAttribute('data-view');
      if (newView) {
        store.setView(newView as CalendarView, event);
      }
    },
    [store],
  );

  const handleViewChange = React.useCallback(
    (newView: CalendarView, eventDetails: Menu.Root.ChangeEventDetails) => {
      store.setView(newView, eventDetails.event);
    },
    [store],
  );

  const showAll = views.length <= 3;
  const visible = showAll ? views : views.slice(0, 2);
  const dropdown = React.useMemo(() => (showAll ? [] : views.slice(2)), [showAll, views]);

  const [state, setState] = React.useState<{
    dropdownView: CalendarView | null;
    prevView: CalendarView;
    prevViews: CalendarView[];
  }>({ dropdownView: dropdown[0], prevView: view, prevViews: views });

  // making sure we persist the last selected item from the menu, so when switching to a different view, the last item in the menu bar does not automatically change back to the initial value of dropdown[0]
  if (state.prevView !== view || state.prevViews !== views) {
    let newDropdownView: CalendarView | null;
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
});
