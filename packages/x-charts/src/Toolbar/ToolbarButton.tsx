import PropTypes from 'prop-types';
import * as React from 'react';
import { RenderProp, useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import { ChartsSlotProps } from '../material';
import { useChartToolbarSlots } from './ChartsToolbarSlotsContext';

export type ToolbarButtonProps = ChartsSlotProps['baseIconButton'] & {
  /**
   * A function to customize the rendering of the component.
   */
  render?: RenderProp<ChartsSlotProps['baseIconButton']>;
};

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton(props, ref) {
    const { render, ...other } = props;
    const { slots, slotProps } = useChartToolbarSlots();
    const element = useComponentRenderer(slots.baseIconButton, render, {
      ...slotProps?.baseIconButton,
      ...other,
      ref,
    });

    return <React.Fragment>{element}</React.Fragment>;
  },
);

ToolbarButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  style: PropTypes.object,
} as any;

export { ToolbarButton };
