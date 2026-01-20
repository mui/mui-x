import { vars } from '@mui/x-data-grid/internals';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

function GridGroupingColumnLeafCell(props: GridRenderCellParams) {
  const { rowNode } = props;
  const { rowGroupingColumnMode } = useGridRootProps();

  return (
    <div
      style={{
        marginLeft:
          rowGroupingColumnMode === 'multiple'
            ? vars.spacing(1)
            : `calc(var(--DataGrid-cellOffsetMultiplier) * ${vars.spacing(rowNode.depth)})`,
      }}
    >
      {props.formattedValue ?? props.value}
    </div>
  );
}

export { GridGroupingColumnLeafCell };
