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
import { sortByDocumentPosition } from './utils';

export type ToolbarProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<React.ComponentProps<typeof ToolbarRoot>>;
};

type OwnerState = DataGridProcessedProps;

type Item = {
  id: string;
  ref: React.RefObject<HTMLButtonElement | null>;
};

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

  const [focusableItem, setFocusableItem] = React.useState<{ id: string; index: number } | null>(
    null,
  );
  const [items, setItems] = React.useState<Item[]>([]);

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

  const registerItem = React.useCallback(
    (id: string, itemRef: React.RefObject<HTMLButtonElement | null>) => {
      setItems((prevItems) => [...prevItems, { id, ref: itemRef }].sort(sortByDocumentPosition));
    },
    [],
  );

  const unregisterItem = React.useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== id));
  }, []);

  const onItemKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (!focusableItem) {
        return;
      }

      let newIndex = -1;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        newIndex = findEnabledItem(focusableItem.index, 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        newIndex = findEnabledItem(focusableItem.index, -1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        newIndex = findEnabledItem(-1, 1, false);
      } else if (event.key === 'End') {
        event.preventDefault();
        newIndex = findEnabledItem(items.length, -1, false);
      }

      // TODO: Check why this is necessary
      if (newIndex >= 0 && newIndex < items.length) {
        const item = items[newIndex];
        setFocusableItem({ id: item.id, index: newIndex });
        item.ref.current?.focus();
      }
    },
    [items, focusableItem, findEnabledItem],
  );

  const onItemFocus = React.useCallback(
    (id: string) => {
      if (focusableItem?.id !== id) {
        const itemIndex = items.findIndex((item) => item.id === id);
        setFocusableItem({ id, index: itemIndex });
      }
    },
    [focusableItem, items],
  );

  const onItemDisabled = React.useCallback(
    (id: string) => {
      const currentIndex = items.findIndex((item) => item.id === id);
      const newIndex = findEnabledItem(currentIndex, 1);
      if (newIndex >= 0 && newIndex < items.length) {
        const item = items[newIndex];
        setFocusableItem({ id: item.id, index: newIndex });
        item.ref.current?.focus();
      }
    },
    [items, findEnabledItem],
  );

  React.useEffect(() => {
    if (items.length > 0) {
      // Set initial focusable item
      if (!focusableItem) {
        setFocusableItem({ id: items[0].id, index: 0 });
        return;
      }

      // Last item has been removed from the items array
      if (!items[focusableItem.index]) {
        const item = items[items.length - 1];
        if (item) {
          setFocusableItem({ id: item.id, index: items.length - 1 });
          item.ref.current?.focus();
        }
        return;
      }

      const focusableItemIndex = items.findIndex((item) => item.id === focusableItem.id);

      if (focusableItemIndex === -1) {
        // Focused item has been removed from the items array
        const item = items[focusableItem.index];
        if (item) {
          setFocusableItem({ id: item.id, index: focusableItem.index });
          item.ref.current?.focus();
        }
      } else if (focusableItem.index !== focusableItemIndex) {
        // Focused item has moved to a different position in the array
        setFocusableItem({ id: focusableItem.id, index: focusableItemIndex });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, findEnabledItem]);

  const contextValue = React.useMemo(
    () => ({
      focusableItem,
      registerItem,
      unregisterItem,
      onItemKeyDown,
      onItemFocus,
      onItemDisabled,
    }),
    [focusableItem, registerItem, unregisterItem, onItemKeyDown, onItemFocus, onItemDisabled],
  );

  const element = useGridComponentRenderer(ToolbarRoot, render, {
    role: 'toolbar',
    'aria-orientation': 'horizontal',
    'aria-label': rootProps.label || undefined,
    className: clsx(classes.root, className),
    ...other,
    ref,
  });

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
