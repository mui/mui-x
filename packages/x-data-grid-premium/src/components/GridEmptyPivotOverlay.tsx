import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { GridOverlay, GridOverlayProps } from '@mui/x-data-grid';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';

const GridEmptyPivotOverlay = forwardRef<HTMLDivElement, GridOverlayProps>(
  function GridEmptyPivotOverlay(props, ref) {
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();

    const handleOpenPivotSettings = () => {
      apiRef.current.setPivotPanelOpen(true);
    };

    return (
      <GridOverlay {...props} ref={ref}>
        {apiRef.current.getLocaleText('emptyPivotOverlayLabel')}

        <rootProps.slots.baseButton
          size="small"
          {...rootProps.slotProps?.baseButton}
          onClick={handleOpenPivotSettings}
        >
          {apiRef.current.getLocaleText('emptyPivotOverlayManagePivot')}
        </rootProps.slots.baseButton>
      </GridOverlay>
    );
  },
);

GridEmptyPivotOverlay.propTypes = {
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

export { GridEmptyPivotOverlay };
