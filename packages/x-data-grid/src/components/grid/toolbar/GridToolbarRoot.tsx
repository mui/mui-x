import * as React from 'react';
import PropTypes from 'prop-types';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';
import { GridToolbarRootContext } from './GridToolbarRootContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import type { GridSlotProps } from '../../../models';

export type GridToolbarRootProps = GridSlotProps['baseToolbar'] & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseToolbar']>;
};

const GridToolbarRoot = React.forwardRef<HTMLDivElement, GridToolbarRootProps>(
  function GridToolbarRoot(props, ref) {
    const { render, ...other } = props;
    const rootProps = useGridRootProps();

    const [focusableItemId, setFocusableItemId] = React.useState<string | null>(null);
    const [items, setItems] = React.useState<string[]>([]);

    const registerItem = React.useCallback((item: string) => {
      setItems((prevItems) => [...prevItems, item]);
    }, []);

    const unregisterItem = React.useCallback(
      (item: string) => {
        setItems((prevItems) => prevItems.filter((i) => i !== item));

        if (focusableItemId === item) {
          setFocusableItemId(null);
        }
      },
      [focusableItemId],
    );

    const onItemKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (!focusableItemId) {
          return;
        }

        if (event.key === 'ArrowRight') {
          event.preventDefault();
          const nextIndex = items.indexOf(focusableItemId) + 1;
          setFocusableItemId(items[nextIndex < items.length ? nextIndex : 0]);
        }

        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          const prevIndex = items.indexOf(focusableItemId) - 1;
          setFocusableItemId(items[prevIndex < 0 ? items.length - 1 : prevIndex]);
        }

        if (event.key === 'Home') {
          event.preventDefault();
          setFocusableItemId(items[0]);
        }

        if (event.key === 'End') {
          event.preventDefault();
          setFocusableItemId(items[items.length - 1]);
        }
      },
      [items, focusableItemId],
    );

    const contextValue = React.useMemo(
      () => ({
        focusableItemId,
        registerItem,
        unregisterItem,
        onItemKeyDown,
      }),
      [registerItem, unregisterItem, focusableItemId, onItemKeyDown],
    );

    const element = useGridComponentRenderer(rootProps.slots.baseToolbar, render, {
      ...rootProps.slotProps?.baseToolbar,
      ref,
      role: 'toolbar',
      'aria-orientation': 'horizontal',
      ...other,
    });

    React.useEffect(() => {
      if (items.length > 0) {
        setFocusableItemId(items[0]);
      }
    }, [items]);

    return (
      <GridToolbarRootContext.Provider value={contextValue}>
        {element}
      </GridToolbarRootContext.Provider>
    );
  },
);

GridToolbarRoot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridToolbarRoot };
