import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
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
})<{ ownerState: OwnerState }>({
  flex: 0,
  display: 'flex',
  alignItems: 'center',
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

  const element = useGridComponentRenderer(ToolbarRoot, render, {
    role: 'toolbar',
    'aria-orientation': 'horizontal',
    className: clsx(classes.root, className),
    ownerState: rootProps,
    ...other,
    ref,
  });

  React.useEffect(() => {
    if (items.length > 0) {
      setFocusableItemId(items[0]);
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
