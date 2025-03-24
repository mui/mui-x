import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridComponentRenderer, RenderProp } from '../../hooks/utils/useGridComponentRenderer';
import type { GridSlotProps } from '../../models';
import { QuickFilterState, useQuickFilterContext } from './QuickFilterContext';

export type QuickFilterClearProps = Omit<GridSlotProps['baseIconButton'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseIconButton'], QuickFilterState>;
  /**
   * Override or extend the styles applied to the component.
   */
  className?: string | ((state: QuickFilterState) => string);
};

/**
 * A button that resets the filter value.
 * It renders the `baseIconButton` slot.
 *
 * Demos:
 *
 * - [Quick Filter](https://mui.com/x/react-data-grid/components/quick-filter/)
 *
 * API:
 *
 * - [QuickFilterClear API](https://mui.com/x/api/data-grid/quick-filter-clear/)
 */
const QuickFilterClear = forwardRef<HTMLButtonElement, QuickFilterClearProps>(
  function QuickFilterClear(props, ref) {
    const { render, className, onClick, ...other } = props;
    const rootProps = useGridRootProps();
    const { state, clearValue } = useQuickFilterContext();
    const resolvedClassName = typeof className === 'function' ? className(state) : className;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      clearValue();
      onClick?.(event);
    };

    const element = useGridComponentRenderer(
      rootProps.slots.baseIconButton,
      render,
      {
        ...rootProps.slotProps?.baseIconButton,
        className: resolvedClassName,
        tabIndex: -1,
        ...other,
        onClick: handleClick,
        ref,
      },
      state,
    );

    return <React.Fragment>{element}</React.Fragment>;
  },
);

QuickFilterClear.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  color: PropTypes.oneOf(['default', 'inherit', 'primary']),
  disabled: PropTypes.bool,
  edge: PropTypes.oneOf(['end', 'start', false]),
  id: PropTypes.string,
  label: PropTypes.string,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onPointerDown: PropTypes.func,
  onPointerUp: PropTypes.func,
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  role: PropTypes.string,
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  style: PropTypes.object,
  tabIndex: PropTypes.number,
  title: PropTypes.string,
  touchRippleRef: PropTypes.any,
} as any;

export { QuickFilterClear };
