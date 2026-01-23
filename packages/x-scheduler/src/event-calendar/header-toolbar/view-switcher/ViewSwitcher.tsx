'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { CalendarView } from '@mui/x-scheduler-headless/models';
import { useTranslations } from '../../../internals/utils/TranslationsContext';
import { useEventCalendarClasses } from '../../EventCalendarClassesContext';

const ViewSwitcherRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'ViewSwitcher',
})({});

export interface ViewSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
  views: CalendarView[];
  view: CalendarView;
  onViewChange: (view: CalendarView, event: Event) => void;
}

type ViewSwitcherComponent = (
  props: ViewSwitcherProps & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  },
) => React.ReactElement | null;

export const ViewSwitcher = React.forwardRef(function ViewSwitcher(
  props: ViewSwitcherProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { views, onViewChange, view, ...other } = props;

  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);
  const translations = useTranslations();
  const classes = useEventCalendarClasses();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleToggleChange = React.useCallback(
    (event: React.MouseEvent<HTMLElement>, newView: CalendarView | null) => {
      if (newView) {
        onViewChange(newView, event.nativeEvent);
      }
    },
    [onViewChange],
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, newView: CalendarView) => {
    onViewChange(newView, event.nativeEvent);
    handleMenuClose();
  };

  const showAll = views.length <= 3;
  const visible = showAll ? views : views.slice(0, 2);
  const dropdown = React.useMemo(() => (showAll ? [] : views.slice(2)), [showAll, views]);

  const [state, setState] = React.useState<{
    dropdownView: CalendarView | null;
    prevView: CalendarView | null;
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
    <ViewSwitcherRoot ref={handleRef} className={classes.viewSwitcher} {...other}>
      <ToggleButtonGroup value={view} exclusive onChange={handleToggleChange} size="small">
        {visible.map((visibleView) => (
          <ToggleButton key={visibleView} value={visibleView}>
            {translations[visibleView]}
          </ToggleButton>
        ))}

        {!!state.dropdownView && (
          <ToggleButton value={state.dropdownView}>{translations[state.dropdownView]}</ToggleButton>
        )}
      </ToggleButtonGroup>

      {dropdown.length > 0 && (
        <React.Fragment>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            aria-label="Show more views"
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
          >
            <ExpandMoreOutlined fontSize="small" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            {dropdown.map((dropdownView) => (
              <MenuItem
                key={dropdownView}
                selected={view === dropdownView}
                onClick={(event) => handleMenuItemClick(event, dropdownView)}
              >
                {translations[dropdownView]}
              </MenuItem>
            ))}
          </Menu>
        </React.Fragment>
      )}
    </ViewSwitcherRoot>
  );
}) as ViewSwitcherComponent;
