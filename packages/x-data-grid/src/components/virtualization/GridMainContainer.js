'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridConfiguration } from '../../hooks/utils/useGridConfiguration';
const GridPanelAnchor = styled('div', {
    slot: 'internal',
    shouldForwardProp: undefined,
})({
    position: 'absolute',
    top: `var(--DataGrid-headersTotalHeight)`,
    left: 0,
    width: 'calc(100% - (var(--DataGrid-hasScrollY) * var(--DataGrid-scrollbarSize)))',
});
const Element = styled('div', {
    name: 'MuiDataGrid',
    slot: 'Main',
    overridesResolver: (props, styles) => {
        const { ownerState, loadingOverlayVariant, overlayType } = props;
        const hideContent = loadingOverlayVariant === 'skeleton' || overlayType === 'noColumnsOverlay';
        return [
            styles.main,
            ownerState.hasPinnedRight && styles['main--hasPinnedRight'],
            hideContent && styles['main--hiddenContent'],
        ];
    },
})({
    flexGrow: 1,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
});
export const GridMainContainer = forwardRef((props, ref) => {
    const { ownerState } = props;
    const rootProps = useGridRootProps();
    const configuration = useGridConfiguration();
    const ariaAttributes = configuration.hooks.useGridAriaAttributes();
    return (_jsxs(Element, { ownerState: ownerState, className: props.className, tabIndex: -1, ...ariaAttributes, ...rootProps.slotProps?.main, ref: ref, children: [_jsx(GridPanelAnchor, { role: "presentation", "data-id": "gridPanelAnchor" }), props.children] }));
});
