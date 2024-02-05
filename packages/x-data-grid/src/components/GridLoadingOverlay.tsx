import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';

const GridLoadingOverlay = React.forwardRef<HTMLDivElement, GridOverlayProps>(
  function GridLoadingOverlay(props, ref) {
    return (
      <GridOverlay ref={ref} {...props}>
        <CircularProgress />
      </GridOverlay>
    );
  },
);

GridLoadingOverlay.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridLoadingOverlay };
