import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';
import { GridPreferencePanelsValue } from '../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { gridColumnFieldsSelector, useGridSelector } from '../hooks';

const GridNoColumnsOverlay = forwardRef<HTMLDivElement, GridOverlayProps>(
  function GridNoColumnsOverlay(props, ref) {
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const columns = useGridSelector(apiRef, gridColumnFieldsSelector);

    const handleOpenManageColumns = () => {
      apiRef.current.showPreferences(GridPreferencePanelsValue.columns);
    };

    const showManageColumnsButton = !rootProps.disableColumnSelector && columns.length > 0;

    return (
      <GridOverlay {...props} ref={ref}>
        {apiRef.current.getLocaleText('noColumnsOverlayLabel')}
        {showManageColumnsButton && (
          <rootProps.slots.baseButton
            size="small"
            {...rootProps.slotProps?.baseButton}
            onClick={handleOpenManageColumns}
          >
            {apiRef.current.getLocaleText('noColumnsOverlayManageColumns')}
          </rootProps.slots.baseButton>
        )}
      </GridOverlay>
    );
  },
);

GridNoColumnsOverlay.propTypes = {
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

export { GridNoColumnsOverlay };
