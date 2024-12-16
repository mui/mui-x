/* eslint-disable react/no-unused-prop-types */
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
  render?: RenderProp<{}>;
  /**
   * Orientation of the toolbar.
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
};

const GridToolbarRoot = React.forwardRef<HTMLDivElement, GridToolbarRootProps>(
  function GridToolbarRoot(props, ref) {
    const { render, orientation = 'horizontal', ...other } = props;
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

        if (
          (orientation === 'horizontal' && event.key === 'ArrowRight') ||
          (orientation === 'vertical' && event.key === 'ArrowDown')
        ) {
          event.preventDefault();
          const nextIndex = items.indexOf(focusableItemId) + 1;
          setFocusableItemId(items[nextIndex < items.length ? nextIndex : 0]);
        }

        if (
          (orientation === 'horizontal' && event.key === 'ArrowLeft') ||
          (orientation === 'vertical' && event.key === 'ArrowUp')
        ) {
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
      [items, focusableItemId, orientation],
    );

    const contextValue = React.useMemo(
      () => ({
        orientation,
        focusableItemId,
        registerItem,
        unregisterItem,
        onItemKeyDown,
      }),
      [registerItem, unregisterItem, focusableItemId, onItemKeyDown, orientation],
    );

    const element = useGridComponentRenderer(rootProps.slots.baseToolbar, render, {
      ref,
      role: 'toolbar',
      'aria-orientation': orientation,
      ...rootProps.slotProps?.baseToolbar,
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
   * Orientation of the toolbar.
   *
   * @default 'horizontal'
   */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { GridToolbarRoot };
