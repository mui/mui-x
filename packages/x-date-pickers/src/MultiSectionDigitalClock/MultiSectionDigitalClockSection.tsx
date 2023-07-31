import * as React from 'react';
import clsx from 'clsx';
import { alpha, styled, useThemeProps } from '@mui/material/styles';
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
import {
  DIGITAL_CLOCK_VIEW_HEIGHT,
  MULTI_SECTION_CLOCK_SECTION_WIDTH,
} from '../internals/constants/dimensions';

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
  role?: string;
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
    '@media (prefers-reduced-motion: no-preference)': {
      scrollBehavior: ownerState.alreadyRendered ? 'smooth' : 'auto',
    },
    '&:hover': {
      overflowY: 'auto',
    },
    '&:not(:first-of-type)': {
      borderLeft: `1px solid ${(theme.vars || theme).palette.divider}`,
    },
    '&:after': {
      display: 'block',
      content: '""',
      // subtracting the height of one item, extra margin and borders to make sure the max height is correct
      height: 'calc(100% - 40px - 6px)',
    },
  }),
);

const MultiSectionDigitalClockSectionItem = styled(MenuItem, {
  name: 'MuiMultiSectionDigitalClockSection',
  slot: 'Item',
  overridesResolver: (_, styles) => styles.item,
})(({ theme }) => ({
  padding: 8,
  margin: '2px 4px',
  width: MULTI_SECTION_CLOCK_SECTION_WIDTH,
  justifyContent: 'center',
  '&:first-of-type': {
    marginTop: 4,
  },
  '&:hover': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.hoverOpacity})`
      : alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
  },
  '&.Mui-selected': {
    backgroundColor: (theme.vars || theme).palette.primary.main,
    color: (theme.vars || theme).palette.primary.contrastText,
    '&:focus-visible, &:hover': {
      backgroundColor: (theme.vars || theme).palette.primary.dark,
    },
  },
  '&.Mui-focusVisible': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.focusOpacity})`
      : alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
  },
}));

type MultiSectionDigitalClockSectionComponent = <TValue>(
  props: MultiSectionDigitalClockSectionProps<TValue> & React.RefAttributes<HTMLUListElement>,
) => React.JSX.Element & { propTypes?: any };

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
    const previousSelected = React.useRef<HTMLElement | null>(null);

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
      const selectedItem = containerRef.current.querySelector<HTMLElement>(
        '[role="option"][aria-selected="true"]',
      );
      if (!selectedItem || previousSelected.current === selectedItem) {
        // Handle setting the ref to null if the selected item is ever reset via UI
        if (previousSelected.current !== selectedItem) {
          previousSelected.current = selectedItem;
        }
        return;
      }
      previousSelected.current = selectedItem;
      if (active && autoFocus) {
        selectedItem.focus();
      }
      const offsetTop = selectedItem.offsetTop;

      // Subtracting the 4px of extra margin intended for the first visible section item
      containerRef.current.scrollTop = offsetTop - 4;
    });

    return (
      <MultiSectionDigitalClockSectionRoot
        ref={handleRef}
        className={clsx(classes.root, className)}
        ownerState={ownerState}
        autoFocusItem={autoFocus && active}
        role="listbox"
        {...other}
      >
        {items.map((option) => {
          if (skipDisabled && option.isDisabled?.(option.value)) {
            return null;
          }
          const isSelected = option.isSelected(option.value);
          return (
            <DigitalClockSectionItem
              key={option.label}
              onClick={() => !readOnly && onChange(option.value)}
              selected={isSelected}
              disabled={disabled || option.isDisabled?.(option.value)}
              disableRipple={readOnly}
              role="option"
              // aria-readonly is not supported here and does not have any effect
              aria-disabled={readOnly}
              aria-label={option.ariaLabel}
              aria-selected={isSelected}
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
