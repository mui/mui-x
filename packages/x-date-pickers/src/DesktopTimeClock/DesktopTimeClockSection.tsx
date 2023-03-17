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
  width: 56,
  overflow: 'hidden',
  '&:hover': {
    overflowY: 'auto',
  },
  '&:not(:first-of-type)': {
    borderLeft: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
}));

const DesktopTimeClockSectionItem = styled(MenuItem, {
  name: 'MuiDesktopTimeClockSection',
  slot: 'Item',
  overridesResolver: (_, styles) => styles.item,
})({
  flexDirection: 'column',
  padding: 8,
  margin: '0 3px',
  // setting item width higher than the wrapper to avoid scrollbar shifting
  width: 50,
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

  const { autoFocus, onChange, className, disabled, readOnly, items, active, ...other } = props;

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
    // Taken from useScroll in x-data-grid, but vertically centered
    const offsetHeight = selectedItem.offsetHeight;
    const offsetTop = selectedItem.offsetTop;

    const clientHeight = containerRef.current.clientHeight;
    const scrollTop = containerRef.current.scrollTop;

    const elementBottom = offsetTop + offsetHeight;

    if (offsetHeight > clientHeight || offsetTop < scrollTop) {
      // item already visible
      return;
    }

    containerRef.current.scrollTop = elementBottom - clientHeight / 2 - offsetHeight / 2;
  }, [active, autoFocus, ref]);

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
