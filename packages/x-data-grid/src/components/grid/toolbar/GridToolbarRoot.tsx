/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, SxProps, Theme } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';
import { GridToolbarRootContext } from './GridToolbarRootContext';

export interface GridToolbarRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
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
}

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarRoot'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const StyledGridToolbarRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ToolbarRoot',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  flex: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  padding: theme.spacing(0.5),
  height: 45,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const DefaultGridToolbarRoot = React.forwardRef<HTMLDivElement, GridToolbarRootProps>(
  function GridToolbarRoot(props, ref) {
    const { className, children, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);

    return (
      <StyledGridToolbarRoot
        ref={ref}
        className={clsx(classes.root, className)}
        ownerState={rootProps}
        {...other}
      >
        {children}
      </StyledGridToolbarRoot>
    );
  },
);

DefaultGridToolbarRoot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

/**
 * Demos:
 *
 * - [Toolbar](https://mui.com/x/react-data-grid/components/toolbar/)
 *
 * API:
 *
 * - [GridToolbarRoot API](https://mui.com/x/api/data-grid/grid-toolbar-root/)
 */
const GridToolbarRoot = React.forwardRef<HTMLDivElement, GridToolbarRootProps>(
  function GridToolbarRoot(props, ref) {
    const { render, orientation = 'horizontal', ...other } = props;

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

    const element = useGridComponentRenderer({
      render,
      defaultElement: DefaultGridToolbarRoot,
      props: {
        ref,
        role: 'toolbar',
        'aria-orientation': orientation,
        ...other,
      },
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
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridToolbarRoot };
