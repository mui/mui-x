"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridVirtualScrollerFiller = void 0;
var React = require("react");
var system_1 = require("@mui/system");
var fastMemo_1 = require("@mui/x-internals/fastMemo");
var cssVariables_1 = require("../../constants/cssVariables");
var useGridSelector_1 = require("../../hooks/utils/useGridSelector");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var dimensions_1 = require("../../hooks/features/dimensions");
var constants_1 = require("../../constants");
var Filler = (0, system_1.styled)('div')({
    display: 'flex',
    flexDirection: 'row',
    width: 'var(--DataGrid-rowWidth)',
    boxSizing: 'border-box',
});
var Pinned = (0, system_1.styled)('div')({
    position: 'sticky',
    height: '100%',
    boxSizing: 'border-box',
    borderTop: '1px solid var(--rowBorderColor)',
    backgroundColor: cssVariables_1.vars.cell.background.pinned,
});
var PinnedLeft = (0, system_1.styled)(Pinned)({
    left: 0,
    borderRight: '1px solid var(--rowBorderColor)',
});
var PinnedRight = (0, system_1.styled)(Pinned)({
    right: 0,
    borderLeft: '1px solid var(--rowBorderColor)',
});
var Main = (0, system_1.styled)('div')({
    flexGrow: 1,
    borderTop: '1px solid var(--rowBorderColor)',
});
function GridVirtualScrollerFiller(_a) {
    var rowsLength = _a.rowsLength;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var _b = (0, useGridSelector_1.useGridSelector)(apiRef, dimensions_1.gridDimensionsSelector), viewportOuterSize = _b.viewportOuterSize, minimumSize = _b.minimumSize, hasScrollX = _b.hasScrollX, hasScrollY = _b.hasScrollY, scrollbarSize = _b.scrollbarSize, leftPinnedWidth = _b.leftPinnedWidth, rightPinnedWidth = _b.rightPinnedWidth;
    var height = hasScrollX ? scrollbarSize : 0;
    var needsLastRowBorder = viewportOuterSize.height - minimumSize.height > 0;
    if (height === 0 && !needsLastRowBorder) {
        return null;
    }
    return (<Filler className={constants_1.gridClasses.filler} role="presentation" style={{
            height: height,
            '--rowBorderColor': rowsLength === 0 ? 'transparent' : 'var(--DataGrid-rowBorderColor)',
        }}>
      {leftPinnedWidth > 0 && (<PinnedLeft className={constants_1.gridClasses['filler--pinnedLeft']} style={{ width: leftPinnedWidth }}/>)}
      <Main />
      {rightPinnedWidth > 0 && (<PinnedRight className={constants_1.gridClasses['filler--pinnedRight']} style={{ width: rightPinnedWidth + (hasScrollY ? scrollbarSize : 0) }}/>)}
    </Filler>);
}
var Memoized = (0, fastMemo_1.fastMemo)(GridVirtualScrollerFiller);
exports.GridVirtualScrollerFiller = Memoized;
