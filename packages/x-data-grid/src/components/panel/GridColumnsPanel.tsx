import { GridPanelWrapper, GridPanelWrapperProps } from './GridPanelWrapper';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface GridColumnsPanelProps extends GridPanelWrapperProps {}

function GridColumnsPanel(props: GridColumnsPanelProps) {
  const { slots, slotProps } = useGridRootProps();
  return (
    <GridPanelWrapper {...props}>
      <slots.columnsManagement {...slotProps?.columnsManagement} />
    </GridPanelWrapper>
  );
}

export { GridColumnsPanel };
