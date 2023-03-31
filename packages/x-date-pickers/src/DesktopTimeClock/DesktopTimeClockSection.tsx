import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import useForkRef from '@mui/utils/useForkRef';
import {
  DesktopTimeClockSectionClasses,
  getDesktopTimeClockSectionUtilityClass,
} from './desktopTimeClockSectionClasses';
import type { DesktopTimeClockSectionOption } from './DesktopTimeClock.types';

export interface DesktopTimeClockSectionProps<TValue> {
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  classes?: Partial<DesktopTimeClockSectionClasses>;
  items: DesktopTimeClockSectionOption<TValue>[];
  onChange: (value: TValue) => void;
  active?: boolean;
  shouldFocus?: boolean;
}

const useUtilityClasses = (ownerState: DesktopTimeClockSectionProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    item: ['item'],
  };

  return composeClasses(slots, getDesktopTimeClockSectionUtilityClass, classes);
};

const DesktopTimeClockSectionRoot = styled(MenuList, {
  name: 'MuiDesktopTimeClockSection',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: DesktopTimeClockSectionProps<any> }>(({ theme }) => ({
  width: 60,
  padding: 0,
  overflow: 'hidden',
  scrollBehavior: 'smooth',
  '&:hover': {
    overflowY: 'auto',
  },
  '&::-webkit-scrollbar': {
    width: 10,
    height: 10,
    background: theme.vars
      ? theme.vars.palette.AppBar.defaultBg
      : theme.palette.grey[theme.palette.mode === 'light' ? 100 : 800],
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.vars
      ? theme.vars.palette.Chip.defaultBorder
      : theme.palette.grey[theme.palette.mode === 'light' ? 400 : 600],
    border: `2px solid ${
      theme.vars
        ? theme.vars.palette.AppBar.defaultBg
        : theme.palette.grey[theme.palette.mode === 'light' ? 100 : 800]
    }`,
    borderRadius: 8,
    '&:hover': {
      background: theme.vars
        ? theme.vars.palette.Chip.defaultIconColor
        : theme.palette.grey[theme.palette.mode === 'light' ? 600 : 400],
    },
  },
  '&:not(:first-of-type)': {
    borderLeft: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
  '&:after': {
    display: 'block',
    content: '""',
    height: 318,
  },
}));

const DesktopTimeClockSectionItem = styled(MenuItem, {
  name: 'MuiDesktopTimeClockSection',
  slot: 'Item',
  overridesResolver: (_, styles) => styles.item,
})({
  padding: 8,
  marginInline: 3,
  width: 54,
  justifyContent: 'center',
});

type DesktopTimeClockSectionComponent = <TValue>(
  props: DesktopTimeClockSectionProps<TValue> & React.RefAttributes<HTMLUListElement>,
) => JSX.Element & { propTypes?: any };

/**
 * @ignore - internal component.
 */
export const DesktopTimeClockSection = React.forwardRef(function DesktopTimeClockSection<TValue>(
  inProps: DesktopTimeClockSectionProps<TValue>,
  ref: React.Ref<HTMLUListElement>,
) {
  const containerRef = React.useRef<HTMLUListElement>(null);
  const handleRef = useForkRef(ref, containerRef);

  const props = useThemeProps({
    props: inProps,
    name: 'MuiDesktopTimeClockSection',
  });

  const {
    autoFocus,
    onChange,
    className,
    disabled,
    readOnly,
    items,
    active,
    shouldFocus,
    ...other
  } = props;

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  React.useEffect(() => {
    if (containerRef.current === null) {
      return;
    }
    const selectedItem = containerRef.current.querySelector<HTMLElement>('[tabindex="0"]');
    if (!selectedItem) {
      return;
    }
    // handle re-focusing when `active` flag doesn't change
    // i.e. move to `minutes` section, select minutes -> we want the focus to be applied to meridiem section
    if (active && shouldFocus) {
      selectedItem.focus();
    }
    const offsetTop = selectedItem.offsetTop;

    containerRef.current.scrollTop = offsetTop;
  });

  return (
    <DesktopTimeClockSectionRoot
      ref={handleRef}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      autoFocusItem={autoFocus && active}
      variant="selectedMenu"
      {...other}
    >
      {items.map((option) => (
        <DesktopTimeClockSectionItem
          aria-readonly={readOnly}
          key={option.label}
          onClick={() => !readOnly && onChange(option.value)}
          selected={option.isSelected(option.value)}
          disabled={disabled ?? option.isDisabled?.(option.value)}
          disableRipple={readOnly}
        >
          {option.label}
        </DesktopTimeClockSectionItem>
      ))}
    </DesktopTimeClockSectionRoot>
  );
}) as DesktopTimeClockSectionComponent;
