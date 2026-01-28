import type { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { vars, GridFooterCell } from '@mui/x-data-grid-pro/internals';
import type { SxProps, Theme } from '@mui/system';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

function GridGroupingColumnFooterCell(props: GridRenderCellParams) {
  const rootProps = useGridRootProps();

  const sx: SxProps<Theme> = { ml: 0 };
  if (props.rowNode.parent == null) {
    sx.ml = 0;
  } else if (rootProps.rowGroupingColumnMode === 'multiple') {
    sx.ml = 2;
  } else {
    sx.ml = `calc(var(--DataGrid-cellOffsetMultiplier) * ${vars.spacing(props.rowNode.depth)})`;
  }

  return <GridFooterCell sx={sx} {...props} />;
}

export { GridGroupingColumnFooterCell };
