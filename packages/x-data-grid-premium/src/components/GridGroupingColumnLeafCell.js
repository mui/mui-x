import { jsx as _jsx } from "react/jsx-runtime";
import { vars } from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
function GridGroupingColumnLeafCell(props) {
    const { rowNode } = props;
    const rootProps = useGridRootProps();
    return (_jsx("div", { style: {
            marginLeft: rootProps.rowGroupingColumnMode === 'multiple'
                ? vars.spacing(1)
                : `calc(var(--DataGrid-cellOffsetMultiplier) * ${vars.spacing(rowNode.depth)})`,
        }, children: props.formattedValue ?? props.value }));
}
export { GridGroupingColumnLeafCell };
