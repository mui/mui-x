import { jsx as _jsx } from "react/jsx-runtime";
import { vars, GridFooterCell } from '@mui/x-data-grid-pro/internals';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
function GridGroupingColumnFooterCell(props) {
    const rootProps = useGridRootProps();
    const sx = { ml: 0 };
    if (props.rowNode.parent == null) {
        sx.ml = 0;
    }
    else if (rootProps.rowGroupingColumnMode === 'multiple') {
        sx.ml = 2;
    }
    else {
        sx.ml = `calc(var(--DataGrid-cellOffsetMultiplier) * ${vars.spacing(props.rowNode.depth)})`;
    }
    return _jsx(GridFooterCell, { sx: sx, ...props });
}
export { GridGroupingColumnFooterCell };
