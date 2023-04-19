import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import useForkRef from '@mui/utils/useForkRef';
import {
  MultiSectionDigitalClockSectionClasses,
  getMultiSectionDigitalClockSectionUtilityClass,
} from './multiSectionDigitalClockSectionClasses';
import type {
  MultiSectionDigitalClockOption,
  MultiSectionDigitalClockSlotsComponent,
  MultiSectionDigitalClockSlotsComponentsProps,
} from './MultiSectionDigitalClock.types';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import { DIGITAL_CLOCK_VIEW_HEIGHT } from '../internals/constants/dimensions';

export interface ExportedMultiSectionDigitalClockSectionProps {
  className?: string;
  classes?: Partial<MultiSectionDigitalClockSectionClasses>;
  slots?: UncapitalizeObjectKeys<MultiSectionDigitalClockSlotsComponent>;
  slotProps?: MultiSectionDigitalClockSlotsComponentsProps;
}

export interface MultiSectionDigitalClockSectionProps<TValue>
  extends ExportedMultiSectionDigitalClockSectionProps {
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  items: MultiSectionDigitalClockOption<TValue>[];
  onChange: (value: TValue) => void;
  active?: boolean;
  skipDisabled?: boolean;
}

const useUtilityClasses = (ownerState: MultiSectionDigitalClockSectionProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    item: ['item'],
  };

  return composeClasses(slots, getMultiSectionDigitalClockSectionUtilityClass, classes);
};

const MultiSectionDigitalClockSectionRoot = styled(MenuList, {
  name: 'MuiMultiSectionDigitalClockSection',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: MultiSectionDigitalClockSectionProps<any> & { alreadyRendered: boolean } }>(
  ({ theme, ownerState }) => ({
    maxHeight: DIGITAL_CLOCK_VIEW_HEIGHT,
    width: 56,
    padding: 0,
    overflow: 'hidden',
    scrollBehavior: ownerState.alreadyRendered ? 'smooth' : 'auto',
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
      height: 185,
    },
  }),
);

const MultiSectionDigitalClockSectionItem = styled(MenuItem, {
  name: 'MuiMultiSectionDigitalClockSection',
  slot: 'Item',
  overridesResolver: (_, styles) => styles.item,
})({
  padding: 8,
  marginInline: 3,
  width: 50,
  justifyContent: 'center',
});

type MultiSectionDigitalClockSectionComponent = <TValue>(
  props: MultiSectionDigitalClockSectionProps<TValue> & React.RefAttributes<HTMLUListElement>,
) => JSX.Element & { propTypes?: any };

/**
 * @ignore - internal component.
 */
export const MultiSectionDigitalClockSection = React.forwardRef(
  function MultiSectionDigitalClockSection<TValue>(
    inProps: MultiSectionDigitalClockSectionProps<TValue>,
    ref: React.Ref<HTMLUListElement>,
  ) {
    const containerRef = React.useRef<HTMLUListElement>(null);
    const handleRef = useForkRef(ref, containerRef);

    const props = useThemeProps({
      props: inProps,
      name: 'MuiMultiSectionDigitalClockSection',
    });

    const {
      autoFocus,
      onChange,
      className,
      disabled,
      readOnly,
      items,
      active,
      slots,
      slotProps,
      skipDisabled,
      ...other
    } = props;

    const ownerState = React.useMemo(
      () => ({ ...props, alreadyRendered: !!containerRef.current }),
      [props],
    );
    const classes = useUtilityClasses(ownerState);
    const DigitalClockSectionItem =
      slots?.digitalClockSectionItem ?? MultiSectionDigitalClockSectionItem;

    React.useEffect(() => {
      if (containerRef.current === null) {
        return;
      }
      const selectedItem = containerRef.current.querySelector<HTMLElement>('li.Mui-selected');
      if (!selectedItem) {
        return;
      }
      if (active && autoFocus) {
        selectedItem.focus();
      }
      const offsetTop = selectedItem.offsetTop;

      containerRef.current.scrollTop = offsetTop;
    });

    return (
      <MultiSectionDigitalClockSectionRoot
        ref={handleRef}
        className={clsx(classes.root, className)}
        ownerState={ownerState}
        autoFocusItem={autoFocus && active}
        {...other}
      >
        {items.map((option) => {
          if (skipDisabled && option.isDisabled?.(option.value)) {
            return null;
          }
          return (
            <DigitalClockSectionItem
              aria-readonly={readOnly}
              key={option.label}
              onClick={() => !readOnly && onChange(option.value)}
              selected={option.isSelected(option.value)}
              disabled={disabled ?? option.isDisabled?.(option.value)}
              disableRipple={readOnly}
              {...slotProps?.digitalClockSectionItem}
            >
              {option.label}
            </DigitalClockSectionItem>
          );
        })}
      </MultiSectionDigitalClockSectionRoot>
    );
  },
) as MultiSectionDigitalClockSectionComponent;
