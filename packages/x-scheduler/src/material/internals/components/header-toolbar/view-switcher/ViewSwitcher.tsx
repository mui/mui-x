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

interface ViewSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
  views: string[];
}

export const ViewSwitcher = React.forwardRef(function ViewSwitcher(
  props: ViewSwitcherProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, views, ...other } = props;

  const { store, instance } = useEventCalendarContext();
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

  const [dropdownLabel, setDropdownLabel] = React.useState<string>(dropdown[0]);

  console.log('views: ', views, visible, dropdown, dropdownLabel);
  // making sure we persist the last selected item from the menu, so when switching to a different view, the last item in the menu bar does not automatically change back to the initial value of dropdown[0]
  React.useEffect(() => {
    if (dropdown.includes(view)) {
      console.log('what');
      setDropdownLabel(view);
    }
  }, [view]);

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

        {dropdown.length > 0 && (
          <React.Fragment>
            <button
              key={dropdownLabel}
              className="MainItem"
              onClick={handleClick}
              data-view={dropdownLabel}
              type="button"
              data-pressed={view === dropdownLabel || undefined}
              aria-pressed={view === dropdownLabel}
            >
              {translations[dropdownLabel]}
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
                      onValueChange={instance.setView}
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
