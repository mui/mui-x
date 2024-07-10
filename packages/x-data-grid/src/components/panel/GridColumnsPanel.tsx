import * as React from 'react';
import PropTypes from 'prop-types';
import { GridPanelWrapper, GridPanelWrapperProps } from './GridPanelWrapper';
import { GridColumnsManagement } from '../columnsManagement';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface GridColumnsPanelProps extends GridPanelWrapperProps {}

function GridColumnsPanel(props: GridColumnsPanelProps) {
  const rootProps = useGridRootProps();
  return (
    <GridPanelWrapper {...props}>
      <GridColumnsManagement {...rootProps.slotProps?.columnsManagement} />
    </GridPanelWrapper>
  );
}

GridColumnsPanel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  slotProps: PropTypes.object,
} as any;

export { GridColumnsPanel };
