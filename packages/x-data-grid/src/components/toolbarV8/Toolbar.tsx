import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { vars } from '../../constants/cssVariables';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridComponentRenderer, RenderProp } from '../../hooks/utils/useGridComponentRenderer';
import { ToolbarContext } from './ToolbarContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';

export type ToolbarProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<React.ComponentProps<typeof ToolbarRoot>>;
};

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbar'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const ToolbarRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'Toolbar',
})({
  flex: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'end',
  gap: vars.spacing(0.25),
  padding: vars.spacing(0.75),
  minHeight: 52,
  boxSizing: 'border-box',
  borderBottom: `1px solid ${vars.colors.border.base}`,
});

/**
 * The top level Toolbar component that provides context to child components.
 * It renders a styled `<div />` element.
 *
 * Demos:
 *
 * - [Toolbar](https://mui.com/x/react-data-grid/components/toolbar/)
 *
 * API:
 *
 * - [Toolbar API](https://mui.com/x/api/data-grid/toolbar/)
 */
const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(props, ref) {
  const { render, className, ...other } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  const [focusableItemId, setFocusableItemId] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<
    { id: string; ref: React.RefObject<HTMLButtonElement | null> }[]
  >([]);

  const registerItem = React.useCallback(
    (id: string, itemRef: React.RefObject<HTMLButtonElement | null>) => {
      setItems((prevItems) => [...prevItems, { id, ref: itemRef }]);
    },
    [],
  );

  const unregisterItem = React.useCallback(
    (id: string) => {
      setItems((prevItems) => prevItems.filter((i) => i.id !== id));

      if (focusableItemId === id) {
        setFocusableItemId(null);
      }
    },
    [focusableItemId],
  );

  const findEnabledItem = React.useCallback(
    (startIndex: number, step: number, wrap = true): number => {
      let index = startIndex;
      const itemCount = items.length;

      // Look for enabled items in the specified direction
      for (let i = 0; i < itemCount; i += 1) {
        index += step;

        // Handle wrapping around the ends
        if (index >= itemCount) {
          if (!wrap) {
            return -1;
          }
          index = 0;
        } else if (index < 0) {
          if (!wrap) {
            return -1;
          }
          index = itemCount - 1;
        }

        // Return if we found an enabled item
        if (
          !items[index].ref.current?.disabled &&
          items[index].ref.current?.ariaDisabled !== 'true'
        ) {
          return index;
        }
      }

      // If we've checked all items and found none enabled
      return -1;
    },
    [items],
  );

  const onItemKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (!focusableItemId) {
        return;
      }

      const currentIndex = items.findIndex((item) => item.id === focusableItemId);
      let newIndex = -1;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        newIndex = findEnabledItem(currentIndex, 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        newIndex = findEnabledItem(currentIndex, -1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        newIndex = findEnabledItem(-1, 1, false);
      } else if (event.key === 'End') {
        event.preventDefault();
        newIndex = findEnabledItem(items.length, -1, false);
      }

      if (newIndex >= 0 && newIndex < items.length) {
        const item = items[newIndex];
        setFocusableItemId(item.id);
        item.ref.current?.focus();
      }
    },
    [items, focusableItemId, findEnabledItem],
  );

  const onItemFocus = React.useCallback(
    (id: string) => {
      if (focusableItemId !== id) {
        setFocusableItemId(id);
      }
    },
    [focusableItemId],
  );

  const onItemDisabled = React.useCallback(
    (id: string) => {
      const currentIndex = items.findIndex((item) => item.id === id);
      const newIndex = findEnabledItem(currentIndex, 1);
      if (newIndex >= 0 && newIndex < items.length) {
        const item = items[newIndex];
        setFocusableItemId(item.id);
        item.ref.current?.focus();
      }
    },
    [items, findEnabledItem],
  );

  const contextValue = React.useMemo(
    () => ({
      focusableItemId,
      registerItem,
      unregisterItem,
      onItemKeyDown,
      onItemFocus,
      onItemDisabled,
    }),
    [focusableItemId, registerItem, unregisterItem, onItemKeyDown, onItemFocus, onItemDisabled],
  );

  const element = useGridComponentRenderer(ToolbarRoot, render, {
    role: 'toolbar',
    'aria-orientation': 'horizontal',
    'aria-label': rootProps.label || undefined,
    className: clsx(classes.root, className),
    ...other,
    ref,
  });

  React.useEffect(() => {
    if (items.length > 0) {
      setFocusableItemId(items[0].id);
    }
  }, [items]);

  return <ToolbarContext.Provider value={contextValue}>{element}</ToolbarContext.Provider>;
});

Toolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { Toolbar };
