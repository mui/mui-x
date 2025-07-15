import * as React from 'react';
import { GridPanelWrapper, GridPanelWrapperProps } from './GridPanelWrapper';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface GridColumnsPanelProps extends GridPanelWrapperProps {}

function GridColumnsPanel(props: GridColumnsPanelProps) {
  const rootProps = useGridRootProps();
  return (
    <GridPanelWrapper {...props}>
      <rootProps.slots.columnsManagement {...rootProps.slotProps?.columnsManagement} />
    </GridPanelWrapper>
  );
}

export { GridColumnsPanel };
