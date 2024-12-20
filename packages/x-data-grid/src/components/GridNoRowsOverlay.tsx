import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRefShim } from '@mui/x-internals/forwardRefShim';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';

const GridNoRowsOverlay = forwardRefShim<HTMLDivElement, GridOverlayProps>(
  function GridNoRowsOverlay(props, ref) {
    const apiRef = useGridApiContext();
    const noRowsLabel = apiRef.current.getLocaleText('noRowsLabel');

    return (
      <GridOverlay {...props} ref={ref}>
        {noRowsLabel}
      </GridOverlay>
    );
  },
);

GridNoRowsOverlay.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridNoRowsOverlay };
