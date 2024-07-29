import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';

const GridNoRowsOverlay = React.forwardRef<HTMLDivElement, GridOverlayProps>(
  function GridNoRowsOverlay(props, ref) {
    const apiRef = useGridApiContext();
    const noRowsLabel = apiRef.current.getLocaleText('noRowsLabel');

    return (
      <GridOverlay ref={ref} {...props}>
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
