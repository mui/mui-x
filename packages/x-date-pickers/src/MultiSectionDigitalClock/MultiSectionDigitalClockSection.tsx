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
  MultiSectionDigitalClockSlots,
  MultiSectionDigitalClockSlotProps,
} from './MultiSectionDigitalClock.types';
import {
  DIGITAL_CLOCK_VIEW_HEIGHT,
  MULTI_SECTION_CLOCK_SECTION_WIDTH,
} from '../internals/constants/dimensions';
import { getFocusedListItemIndex } from '../internals/utils/utils';
import { FormProps } from '../internals/models/formProps';
import { PickerOwnerState } from '../models/pickers';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { MultiSectionDigitalClockClasses } from './multiSectionDigitalClockClasses';

export interface ExportedMultiSectionDigitalClockSectionProps {
  className?: string;
  classes?: Partial<MultiSectionDigitalClockSectionClasses>;
  slots?: MultiSectionDigitalClockSlots;
  slotProps?: MultiSectionDigitalClockSlotProps;
}

export interface MultiSectionDigitalClockSectionProps<TSectionValue extends number | string>
  extends FormProps,
    ExportedMultiSectionDigitalClockSectionProps {
  autoFocus?: boolean;
  items: MultiSectionDigitalClockOption<TSectionValue>[];
  onChange: (value: TSectionValue) => void;
  active?: boolean;
  skipDisabled?: boolean;
  role?: string;
}

interface MultiSectionDigitalClockSectionOwnerState extends PickerOwnerState {
  /**
   * `true` if this is not the initial render of the digital clock.
   */
  hasDigitalClockAlreadyBeenRendered: boolean;
}

const useUtilityClasses = (classes: Partial<MultiSectionDigitalClockClasses> | undefined) => {
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
})<{ ownerState: MultiSectionDigitalClockSectionOwnerState }>(({ theme }) => ({
  maxHeight: DIGITAL_CLOCK_VIEW_HEIGHT,
  width: 56,
  padding: 0,
  overflow: 'hidden',
  '@media (prefers-reduced-motion: no-preference)': {
    scrollBehavior: 'auto',
  },
  '@media (pointer: fine)': {
    '&:hover': {
      overflowY: 'auto',
    },
  },
  '@media (pointer: none), (pointer: coarse)': {
    overflowY: 'auto',
  },
  '&:not(:first-of-type)': {
    borderLeft: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
  '&::after': {
    display: 'block',
    content: '""',
    // subtracting the height of one item, extra margin and borders to make sure the max height is correct
    height: 'calc(100% - 40px - 6px)',
  },
  variants: [
    {
      props: { hasDigitalClockAlreadyBeenRendered: true },
      style: {
        '@media (prefers-reduced-motion: no-preference)': {
          scrollBehavior: 'smooth',
        },
      },
    },
  ],
}));

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

type MultiSectionDigitalClockSectionComponent = <TSectionValue extends number | string>(
  props: MultiSectionDigitalClockSectionProps<TSectionValue> &
    React.RefAttributes<HTMLUListElement>,
) => React.JSX.Element & { propTypes?: any };

/**
 * @ignore - internal component.
 */
export const MultiSectionDigitalClockSection = React.forwardRef(
  function MultiSectionDigitalClockSection<TSectionValue extends number | string>(
    inProps: MultiSectionDigitalClockSectionProps<TSectionValue>,
    ref: React.Ref<HTMLUListElement>,
  ) {
    const containerRef = React.useRef<HTMLUListElement>(null);
    const handleRef = useForkRef(ref, containerRef);
    const previousActive = React.useRef<HTMLElement | null>(null);

    const props = useThemeProps({
      props: inProps,
      name: 'MuiMultiSectionDigitalClockSection',
    });

    const {
      autoFocus,
      onChange,
      className,
      classes: classesProp,
      disabled,
      readOnly,
      items,
      active,
      slots,
      slotProps,
      skipDisabled,
      ...other
    } = props;

    const { ownerState: pickerOwnerState } = usePickerPrivateContext();
    const ownerState: MultiSectionDigitalClockSectionOwnerState = {
      ...pickerOwnerState,
      hasDigitalClockAlreadyBeenRendered: !!containerRef.current,
    };

    const classes = useUtilityClasses(classesProp);
    const DigitalClockSectionItem =
      slots?.digitalClockSectionItem ?? MultiSectionDigitalClockSectionItem;

    React.useEffect(() => {
      if (containerRef.current === null) {
        return;
      }
      const activeItem = containerRef.current.querySelector<HTMLElement>(
        '[role="option"][tabindex="0"], [role="option"][aria-selected="true"]',
      );
      if (active && autoFocus && activeItem) {
        activeItem.focus();
      }
      if (!activeItem || previousActive.current === activeItem) {
        return;
      }
      previousActive.current = activeItem;
      const offsetTop = activeItem.offsetTop;

      // Subtracting the 4px of extra margin intended for the first visible section item
      containerRef.current.scrollTop = offsetTop - 4;
    });

    const focusedOptionIndex = items.findIndex((item) => item.isFocused(item.value));

    const handleKeyDown = (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'PageUp': {
          const newIndex = getFocusedListItemIndex(containerRef.current!) - 5;
          const children = containerRef.current!.children;
          const newFocusedIndex = Math.max(0, newIndex);

          const childToFocus = children[newFocusedIndex];
          if (childToFocus) {
            (childToFocus as HTMLElement).focus();
          }
          event.preventDefault();
          break;
        }
        case 'PageDown': {
          const newIndex = getFocusedListItemIndex(containerRef.current!) + 5;
          const children = containerRef.current!.children;
          const newFocusedIndex = Math.min(children.length - 1, newIndex);

          const childToFocus = children[newFocusedIndex];
          if (childToFocus) {
            (childToFocus as HTMLElement).focus();
          }
          event.preventDefault();
          break;
        }
        default:
      }
    };

    return (
      <MultiSectionDigitalClockSectionRoot
        ref={handleRef}
        className={clsx(classes.root, className)}
        ownerState={ownerState}
        autoFocusItem={autoFocus && active}
        role="listbox"
        onKeyDown={handleKeyDown}
        {...other}
      >
        {items.map((option, index) => {
          const isItemDisabled = option.isDisabled?.(option.value);
          const isDisabled = disabled || isItemDisabled;
          if (skipDisabled && isDisabled) {
            return null;
          }
          const isSelected = option.isSelected(option.value);
          const tabIndex =
            focusedOptionIndex === index || (focusedOptionIndex === -1 && index === 0) ? 0 : -1;
          return (
            <DigitalClockSectionItem
              key={option.label}
              onClick={() => !readOnly && onChange(option.value)}
              selected={isSelected}
              disabled={isDisabled}
              disableRipple={readOnly}
              role="option"
              // aria-readonly is not supported here and does not have any effect
              aria-disabled={readOnly || isDisabled || undefined}
              aria-label={option.ariaLabel}
              aria-selected={isSelected}
              tabIndex={tabIndex}
              className={classes.item}
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
