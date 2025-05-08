import PropTypes from 'prop-types';
import * as React from 'react';
import { defaultSlotsMaterial } from '../internals/material';
import { ChartBaseIconButtonProps } from '../models/slots/chartsBaseSlotProps';

export interface ToolbarButtonProps extends ChartBaseIconButtonProps {}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton(props, ref) {
    const IconButton = defaultSlotsMaterial.baseIconButton;

    return <IconButton ref={ref} {...props} />;
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
