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
  paddingRight: 18,
  width: 40,
  overflow: 'hidden',
  '&:hover': {
    overflowY: 'auto',
  },
  '&:not(:first-child)': {
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
  margin: '0 2px',
  // setting item width higher than the wrapper to avoid scrollbar shifting
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

  const { autoFocus, onChange, className, disabled, readOnly, items, ...other } = props;

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  return (
    <DesktopTimeClockSectionRoot
      ref={handleRef}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      autoFocus={autoFocus}
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
