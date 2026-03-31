import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { gridHasBottomFillerSelector, gridHasScrollXSelector, gridHasScrollYSelector, } from '../../hooks/features/dimensions/gridDimensionsSelectors';
import { gridRowTreeSelector } from '../../hooks/features/rows';
import { GridScrollArea } from '../GridScrollArea';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridOverlays } from '../../hooks/features/overlays/useGridOverlays';
import { GridHeaders } from '../GridHeaders';
import { GridMainContainer as Container } from './GridMainContainer';
import { GridTopContainer as TopContainer } from './GridTopContainer';
import { GridVirtualScrollerContent as Content } from './GridVirtualScrollerContent';
import { GridVirtualScrollerFiller as SpaceFiller } from './GridVirtualScrollerFiller';
import { GridVirtualScrollerRenderZone as RenderZone } from './GridVirtualScrollerRenderZone';
import { GridVirtualScrollbar as Scrollbar, ScrollbarCorner } from './GridVirtualScrollbar';
import { GridScrollShadows as ScrollShadows } from '../GridScrollShadows';
import { GridOverlayWrapper } from '../base/GridOverlays';
import { useGridVirtualizer } from '../../hooks/core/useGridVirtualizer';
const useUtilityClasses = (ownerState) => {
    const { classes, hasScrollX, hasPinnedRight, loadingOverlayVariant, overlayType } = ownerState;
    const hideContent = loadingOverlayVariant === 'skeleton' || overlayType === 'noColumnsOverlay';
    const slots = {
        root: ['main', hasPinnedRight && 'main--hasPinnedRight', hideContent && 'main--hiddenContent'],
        scroller: ['virtualScroller', hasScrollX && 'virtualScroller--hasScrollX'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const Scroller = styled('div', {
    name: 'MuiDataGrid',
    slot: 'VirtualScroller',
    overridesResolver: (props, styles) => {
        const { ownerState } = props;
        return [styles.virtualScroller, ownerState.hasScrollX && styles['virtualScroller--hasScrollX']];
    },
})({
    position: 'relative',
    height: '100%',
    flexGrow: 1,
    overflow: 'scroll',
    scrollbarWidth: 'none' /* Firefox */,
    display: 'flex',
    flexDirection: 'column',
    '&::-webkit-scrollbar': {
        display: 'none' /* Safari and Chrome */,
    },
    '@media print': {
        overflow: 'hidden',
    },
    // See https://github.com/mui/mui-x/issues/10547
    zIndex: 0,
});
const hasPinnedRightSelector = (apiRef) => apiRef.current.state.dimensions.rightPinnedWidth > 0;
function GridVirtualScroller(props) {
    const apiRef = useGridPrivateApiContext();
    const rootProps = useGridRootProps();
    const hasScrollY = useGridSelector(apiRef, gridHasScrollYSelector);
    const hasScrollX = useGridSelector(apiRef, gridHasScrollXSelector);
    const hasPinnedRight = useGridSelector(apiRef, hasPinnedRightSelector);
    const hasBottomFiller = useGridSelector(apiRef, gridHasBottomFillerSelector);
    const { overlayType, loadingOverlayVariant } = useGridOverlays(apiRef, rootProps);
    const Overlay = rootProps.slots?.[overlayType];
    const ownerState = {
        classes: rootProps.classes,
        hasScrollX,
        hasPinnedRight,
        overlayType,
        loadingOverlayVariant,
    };
    const classes = useUtilityClasses(ownerState);
    const virtualScroller = useGridVirtualizer().api.getters;
    const { getContainerProps, getScrollerProps, getContentProps, getPositionerProps, getScrollbarVerticalProps, getScrollbarHorizontalProps, getRows, getScrollAreaProps, } = virtualScroller;
    const rows = getRows(undefined, gridRowTreeSelector(apiRef));
    return (_jsxs(Container, { className: classes.root, ...getContainerProps(), ownerState: ownerState, children: [_jsx(GridScrollArea, { scrollDirection: "left", ...getScrollAreaProps() }), _jsx(GridScrollArea, { scrollDirection: "right", ...getScrollAreaProps() }), _jsx(GridScrollArea, { scrollDirection: "up", ...getScrollAreaProps() }), _jsx(GridScrollArea, { scrollDirection: "down", ...getScrollAreaProps() }), _jsxs(Scroller, { className: classes.scroller, ...getScrollerProps(), ownerState: ownerState, children: [_jsxs(TopContainer, { children: [!rootProps.listView && _jsx(GridHeaders, {}), _jsx(rootProps.slots.pinnedRows, { position: "top" })] }), overlayType && (_jsx(GridOverlayWrapper, { overlayType: overlayType, loadingOverlayVariant: loadingOverlayVariant, children: _jsx(Overlay, { ...rootProps.slotProps?.[overlayType] }) })), _jsx(Content, { ...getContentProps(), children: _jsxs(RenderZone, { role: "rowgroup", ...getPositionerProps(), children: [rows, _jsx(rootProps.slots.detailPanels, {})] }) }), hasBottomFiller && _jsx(SpaceFiller, { rowsLength: rows.length }), _jsx(rootProps.slots.bottomContainer, { children: _jsx(rootProps.slots.pinnedRows, { position: "bottom" }) })] }), hasScrollX && (_jsxs(React.Fragment, { children: [rootProps.pinnedColumnsSectionSeparator?.endsWith('shadow') && (_jsx(ScrollShadows, { position: "horizontal" })), _jsx(Scrollbar, { position: "horizontal", ...getScrollbarHorizontalProps() })] })), hasScrollY && (_jsxs(React.Fragment, { children: [rootProps.pinnedRowsSectionSeparator?.endsWith('shadow') && (_jsx(ScrollShadows, { position: "vertical" })), _jsx(Scrollbar, { position: "vertical", ...getScrollbarVerticalProps() })] })), hasScrollX && hasScrollY && _jsx(ScrollbarCorner, { "aria-hidden": "true" }), props.children] }));
}
export { GridVirtualScroller };
