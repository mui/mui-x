import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';

const GridLoadingOverlayRoot = styled(GridOverlay)({
  position: 'absolute',
  top: 0,
  zIndex: 4, // should be above pinned columns, pinned rows and detail panel
  width: '100%',
  pointerEvents: 'none',
});

const GridLoadingOverlay = React.forwardRef<HTMLDivElement, GridOverlayProps>(
  function GridLoadingOverlay(props, ref) {
    return (
      <GridLoadingOverlayRoot ref={ref} {...props}>
        <CircularProgress />
      </GridLoadingOverlayRoot>
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
