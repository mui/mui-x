'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useForkRef from '@mui/utils/useForkRef';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import type { RenderProp } from '@mui/x-internals/useComponentRenderer';
import { useRegisterToolbarButton } from '@mui/x-internals/ToolbarContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { GridSlotProps } from '../../models';

export type ToolbarButtonProps = GridSlotProps['baseIconButton'] & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseIconButton']>;
};

/**
 * A button for performing actions from the toolbar.
 * It renders the `baseIconButton` slot.
 *
 * Demos:
 *
 * - [Toolbar](https://mui.com/x/react-data-grid/components/toolbar/)
 *
 * API:
 *
 * - [ToolbarButton API](https://mui.com/x/api/data-grid/toolbar-button/)
 */
const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton(props, ref) {
    const {
      render,
      onKeyDown,
      onFocus,
      onBlur,
      disabled,
      'aria-disabled': ariaDisabled,
      ...other
    } = props;
    const rootProps = useGridRootProps();
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const handleRef = useForkRef(buttonRef, ref);
    const { tabIndex, ...toolbarButtonProps } = useRegisterToolbarButton(props, buttonRef);

    const element = useComponentRenderer(rootProps.slots.baseIconButton, render, {
      ...rootProps.slotProps?.baseIconButton,
      tabIndex,
      ...other,
      ...toolbarButtonProps,
      ref: handleRef,
    });

    return <React.Fragment>{element}</React.Fragment>;
  },
);

ToolbarButton.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  /**
   * The color of the button.
   */
  color: PropTypes.oneOf(['default', 'inherit', 'primary']),
  /**
   * The component used for the root node. Either a string to use an HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * If `true`, the button is disabled.
   */
  disabled: PropTypes.bool,
  /**
   * If given, uses a negative margin to align the button with the edge of its container.
   */
  edge: PropTypes.oneOf(['end', 'start', false]),
  /**
   * The URL to link to. If set, and `component` is not set, the component renders as an anchor tag.
   */
  href: PropTypes.string,
  /**
   * The id of the button element.
   */
  id: PropTypes.string,
  /**
   * The label of the button.
   */
  label: PropTypes.string,
  /**
   * The relationship of the linked URL.
   * Set it to `noopener noreferrer` when `target` is set to `_blank` to avoid a security issue.
   */
  rel: PropTypes.string,
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * The ARIA role of the button element.
   */
  role: PropTypes.string,
  /**
   * The size of the button.
   */
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  style: PropTypes.object,
  /**
   * The `tabIndex` of the button element.
   */
  tabIndex: PropTypes.number,
  /**
   * Where to display the linked URL, as the name for a browsing context.
   */
  target: PropTypes.string,
  /**
   * The title of the button element.
   */
  title: PropTypes.string,
  /**
   * @ignore
   */
  touchRippleRef: PropTypes.any,
} as any;

export { ToolbarButton };
