import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';
import { GridToolbarRootContext } from './GridToolbarRootContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';

export type GridToolbarRootProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<React.ComponentProps<typeof Toolbar>>;
};

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbar'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const Toolbar = styled('div', {
  name: 'MuiDataGrid',
  slot: 'Toolbar',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  flex: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  padding: theme.spacing(0.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const GridToolbarRoot = React.forwardRef<HTMLDivElement, GridToolbarRootProps>(
  function GridToolbarRoot(props, ref) {
    const { render, className, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);

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

    const element = useGridComponentRenderer(Toolbar, render, {
      ref,
      role: 'toolbar',
      'aria-orientation': 'horizontal',
      className: clsx(classes.root, className),
      ownerState: rootProps,
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
} as any;

export { GridToolbarRoot };
