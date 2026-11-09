'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useRtl } from '@mui/system/RtlProvider';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import clsx from 'clsx';
import { useEventCalendarStyledContext } from '../../EventCalendarStyledContext';
import { usePreferencesMenuItems } from './PreferencesMenuItems';

const PreferencesMenuRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'PreferencesMenu',
})({});

export const PreferencesMenu = React.forwardRef(function PreferencesMenu(
  props: React.HTMLAttributes<HTMLDivElement>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // Context hooks
  const { schedulerId, classes, localeText } = useEventCalendarStyledContext();
  const isRtl = useRtl();

  // Ref hooks
  const containerRef = React.useRef<HTMLElement | null>(null);
  const handleRef = useMergedRefs(forwardedRef, containerRef);

  // Model hooks
  const { hasAnyOption, items } = usePreferencesMenuItems();

  // State hooks
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Early return if there is nothing to show
  if (!hasAnyOption) {
    return null;
  }

  return (
    <PreferencesMenuRoot
      ref={handleRef}
      {...props}
      className={clsx(props.className, classes.preferencesMenu)}
    >
      <IconButton
        className={classes.preferencesMenuButton}
        aria-label={localeText.preferencesMenu}
        onClick={handleClick}
        aria-controls={open ? `${schedulerId}-preferences-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <SettingsOutlined />
      </IconButton>
      <Menu
        className={classes.preferencesMenuList}
        id={`${schedulerId}-preferences-menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        container={containerRef.current}
        // Aligned with the inline end of the button.
        anchorOrigin={{ vertical: 'bottom', horizontal: isRtl ? 'left' : 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: isRtl ? 'left' : 'right' }}
        slotProps={{
          list: { 'aria-label': localeText.preferencesMenu },
          paper: { sx: { minWidth: 220 } },
        }}
      >
        {items}
      </Menu>
    </PreferencesMenuRoot>
  );
});
