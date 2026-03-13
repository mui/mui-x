'use client';
import * as React from 'react';
import clsx from 'clsx';
import { alpha, styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import useForkRef from '@mui/utils/useForkRef';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
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
  extends FormProps, ExportedMultiSectionDigitalClockSectionProps {
  autoFocus?: boolean;
  items: MultiSectionDigitalClockOption<TSectionValue>[];
  onChange: (value: TSectionValue) => void;
  active?: boolean;
  skipDisabled?: boolean;
  role?: string;
}

export interface MultiSectionDigitalClockSectionOwnerState extends PickerOwnerState {
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
})<{ ownerState: MultiSectionDigitalClockSectionOwnerState }>(({ theme }) => ({
  maxHeight: DIGITAL_CLOCK_VIEW_HEIGHT,
  width: 56,
  padding: 0,
  overflow: 'hidden',
  scrollbarWidth: 'thin',
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
    const shouldRefocusOnNextRender = React.useRef(false);

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

    useEnhancedEffect(() => {
      if (containerRef.current === null) {
        return;
      }
      const activeItem = containerRef.current.querySelector<HTMLElement>(
        '[role="option"][tabindex="0"], [role="option"][aria-selected="true"]',
      );
      if (!activeItem) {
        return;
      }

      const activeElement = document.activeElement;
      const isSameItemAsPrevious = previousActive.current === activeItem;
      const isFocusInsideSection = !!activeElement && containerRef.current.contains(activeElement);
      const shouldRefocusSameItem = isSameItemAsPrevious && shouldRefocusOnNextRender.current;

      if (
        active &&
        autoFocus &&
        (!isSameItemAsPrevious || shouldRefocusSameItem) &&
        (previousActive.current == null ||
          shouldRefocusOnNextRender.current ||
          isFocusInsideSection)
      ) {
        previousActive.current = activeItem;
        shouldRefocusOnNextRender.current = false;
        activeItem.focus();
      }

      if (isSameItemAsPrevious) {
        return;
      }

      const offsetTop = activeItem.offsetTop;
      const itemHeight = activeItem.offsetHeight;
      const containerHeight = containerRef.current.clientHeight;
      const scrollableHeight = containerRef.current.scrollHeight;

      // Calculate the ideal centered position
      const centeredPosition = offsetTop - containerHeight / 2 + itemHeight / 2;

      // Calculate the maximum scroll position that would show content at the bottom
      const maxScrollTop = scrollableHeight - containerHeight;

      // If centering would create empty space at the bottom, align the last items to the bottom instead
      const scrollPosition = Math.min(centeredPosition, maxScrollTop);

      // Ensure we don't scroll past the top
      containerRef.current.scrollTop = Math.max(0, scrollPosition);
    });

    const handleBlur = useEventCallback((event: React.FocusEvent<HTMLElement>) => {
      // Keep focus restoration only for in-picker keyboard navigation.
      // Do not restore focus after leaving the picker, which would steal focus from external inputs.
      const relatedTarget = event.relatedTarget as HTMLElement | null;
      const blurParent = relatedTarget?.parentElement;
      const relatedTargetRole = relatedTarget?.getAttribute('role');
      const shouldRefocus =
        (blurParent?.nodeName === 'UL' && blurParent !== containerRef.current) ||
        relatedTargetRole === 'gridcell';

      shouldRefocusOnNextRender.current = shouldRefocus;

      if (
        previousActive.current &&
        blurParent?.nodeName === 'UL' &&
        blurParent !== containerRef.current
      ) {
        previousActive.current = null;
      }
    });

    // Reset tracking when section becomes inactive
    // so focus can be reapplied when user returns via keyboard
    React.useEffect(() => {
      if (!active) {
        previousActive.current = null;
      }
    }, [active]);

    const focusedOptionIndex = items.findIndex((item) => item.isFocused(item.value));

    const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'Tab': {
          // Preserve focus restoration when leaving the section with keyboard navigation.
          shouldRefocusOnNextRender.current = true;
          break;
        }
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
          break;
      }
    });

    return (
      <MultiSectionDigitalClockSectionRoot
        ref={handleRef}
        className={clsx(classes.root, className)}
        ownerState={ownerState}
        role="listbox"
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
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
