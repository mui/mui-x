'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { CalendarView } from '@mui/x-scheduler-headless/models';
import { useTranslations } from '../../../internals/utils/TranslationsContext';
import { useEventCalendarClasses } from '../../EventCalendarClassesContext';

const ViewSwitcherRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'ViewSwitcher',
})({
  display: 'flex',
});

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
  const { views, onViewChange, view, className, ...other } = props;

  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);
  const translations = useTranslations();
  const classes = useEventCalendarClasses();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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

  return (
    <ViewSwitcherRoot ref={handleRef} {...other} className={clsx(className, classes.viewSwitcher)}>
      <Button
        size="medium"
        variant="outlined"
        id="view-switcher-button"
        aria-controls={open ? 'view-switcher-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        aria-label="Switch View"
        onClick={handleMenuOpen}
        endIcon={<ExpandMoreOutlined />}
      >
        {translations[view]}
      </Button>
      <Menu
        id="view-switcher-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        slotProps={{
          list: {
            'aria-labelledby': 'view-switcher-button',
            role: 'listbox',
          },
        }}
      >
        {views.map((viewItem) => (
          <MenuItem
            key={viewItem}
            selected={view === viewItem}
            aria-selected={view === viewItem}
            onClick={(event) => handleMenuItemClick(event, viewItem)}
          >
            {translations[viewItem]}
          </MenuItem>
        ))}
      </Menu>
    </ViewSwitcherRoot>
  );
}) as ViewSwitcherComponent;
