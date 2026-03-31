'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { gridRowNodeSelector } from '@mui/x-data-grid';
import { vars } from '@mui/x-data-grid/internals';
import { useResizeObserver } from '@mui/x-internals/useResizeObserver';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
const DetailPanel = styled('div', {
    name: 'MuiDataGrid',
    slot: 'DetailPanel',
})({
    width: 'calc(var(--DataGrid-rowWidth) - var(--DataGrid-hasScrollY) * var(--DataGrid-scrollbarSize))',
    backgroundColor: vars.colors.background.base,
    overflow: 'auto',
});
function GridDetailPanel(props) {
    const { rowId, height, className, children } = props;
    const apiRef = useGridPrivateApiContext();
    const ref = React.useRef(null);
    const rootProps = useGridRootProps();
    const ownerState = rootProps;
    const hasAutoHeight = height === 'auto';
    const rowNode = gridRowNodeSelector(apiRef, rowId);
    React.useLayoutEffect(() => {
        if (hasAutoHeight && typeof ResizeObserver === 'undefined') {
            // Fallback for IE
            apiRef.current.storeDetailPanelHeight(rowId, ref.current.clientHeight);
        }
    }, [apiRef, hasAutoHeight, rowId]);
    useResizeObserver(ref, (entries) => {
        const [entry] = entries;
        const observedHeight = entry.borderBoxSize && entry.borderBoxSize.length > 0
            ? entry.borderBoxSize[0].blockSize
            : entry.contentRect.height;
        apiRef.current.storeDetailPanelHeight(rowId, observedHeight);
    }, hasAutoHeight);
    if (rowNode?.type === 'skeletonRow') {
        return null;
    }
    return (_jsx(DetailPanel, { ref: ref, ownerState: ownerState, role: "presentation", style: { height }, className: className, children: children }));
}
export { GridDetailPanel };
