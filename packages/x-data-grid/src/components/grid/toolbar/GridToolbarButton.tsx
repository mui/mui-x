/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import useId from '@mui/utils/useId';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';
import type { GridSlotProps } from '../../../models';
import { useGridToolbarRootContext } from './GridToolbarRootContext';

export type GridToolbarButtonProps = GridSlotProps['baseIconButton'] & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseIconButton']>;
};

/**
 * Demos:
 *
 * - [Toolbar](https://mui.com/x/react-data-grid/components/toolbar/)
 *
 * API:
 *
 * - [GridToolbarButton API](https://mui.com/x/api/data-grid/grid-toolbar-button/)
 */
const GridToolbarButton = React.forwardRef<HTMLButtonElement, GridToolbarButtonProps>(
  function GridToolbarButton(props, ref) {
    const { render, ...other } = props;
    const id = useId();
    const rootProps = useGridRootProps();
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const handleRef = useForkRef(buttonRef, ref);
    const { focusableItemId, registerItem, unregisterItem, onItemKeyDown } =
      useGridToolbarRootContext();

    React.useEffect(() => {
      registerItem(id!);
      return () => unregisterItem(id!);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isInitialFocus = React.useRef(true);
    React.useEffect(() => {
      // Do not focus the item on initial render
      if (focusableItemId && isInitialFocus.current) {
        isInitialFocus.current = false;
        return;
      }

      if (focusableItemId === id) {
        buttonRef.current?.focus();
      }
    }, [focusableItemId, id]);

    return useGridComponentRenderer(rootProps.slots.baseIconButton, render, {
      ...rootProps.slotProps?.baseIconButton,
      ref: handleRef,
      tabIndex: focusableItemId === id ? 0 : -1,
      onKeyDown: onItemKeyDown,
      ...other,
    });
  },
);

GridToolbarButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  label: PropTypes.string,
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { GridToolbarButton };
