import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { fastMemo } from '@mui/x-internals/fastMemo';
import { vars } from '../../constants/cssVariables';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { gridDimensionsSelector } from '../../hooks/features/dimensions';
import { gridClasses } from '../../constants';
const Filler = styled('div', {
    slot: 'internal',
    shouldForwardProp: undefined,
})({
    display: 'flex',
    flexDirection: 'row',
    width: 'var(--DataGrid-rowWidth)',
    boxSizing: 'border-box',
});
const Pinned = styled('div', {
    slot: 'internal',
    shouldForwardProp: undefined,
})({
    position: 'sticky',
    height: '100%',
    boxSizing: 'border-box',
    borderTop: '1px solid var(--rowBorderColor)',
    backgroundColor: vars.cell.background.pinned,
});
const PinnedLeft = styled(Pinned, {
    slot: 'internal',
})({
    left: 0,
});
const PinnedRight = styled(Pinned, {
    slot: 'internal',
})({
    right: 0,
});
const Main = styled('div', {
    slot: 'internal',
    shouldForwardProp: undefined,
})({
    flexGrow: 1,
    borderTop: '1px solid var(--rowBorderColor)',
});
function GridVirtualScrollerFiller({ rowsLength }) {
    const apiRef = useGridApiContext();
    const { viewportOuterSize, minimumSize, hasScrollX, hasScrollY, scrollbarSize, leftPinnedWidth, rightPinnedWidth, } = useGridSelector(apiRef, gridDimensionsSelector);
    const height = hasScrollX ? scrollbarSize : 0;
    const needsLastRowBorder = viewportOuterSize.height - minimumSize.height > 0;
    if (height === 0 && !needsLastRowBorder) {
        return null;
    }
    return (_jsxs(Filler, { className: gridClasses.filler, role: "presentation", style: {
            height,
            '--rowBorderColor': rowsLength === 0 ? 'transparent' : 'var(--DataGrid-rowBorderColor)',
        }, children: [leftPinnedWidth > 0 && (_jsx(PinnedLeft, { className: gridClasses['filler--pinnedLeft'], style: { width: leftPinnedWidth } })), _jsx(Main, {}), rightPinnedWidth > 0 && (_jsx(PinnedRight, { className: gridClasses['filler--pinnedRight'], style: { width: rightPinnedWidth + (hasScrollY ? scrollbarSize : 0) } }))] }));
}
const Memoized = fastMemo(GridVirtualScrollerFiller);
export { Memoized as GridVirtualScrollerFiller };
