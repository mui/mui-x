'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import useEventCallback from '@mui/utils/useEventCallback';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { vars } from '../../constants/cssVariables';
import { useCSSVariablesClass } from '../../utils/css/context';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { NotRendered } from '../../utils/assert';
export const gridPanelClasses = generateUtilityClasses('MuiDataGrid', [
    'panel',
    'paper',
]);
const GridPanelRoot = styled((NotRendered), {
    name: 'MuiDataGrid',
    slot: 'panel',
})({
    zIndex: vars.zIndex.panel,
});
const GridPanelContent = styled('div', {
    name: 'MuiDataGrid',
    slot: 'panelContent',
})({
    backgroundColor: vars.colors.background.overlay,
    borderRadius: vars.radius.base,
    boxShadow: vars.shadows.overlay,
    display: 'flex',
    maxWidth: `calc(100vw - ${vars.spacing(2)})`,
    overflow: 'auto',
});
const GridPanel = forwardRef((props, ref) => {
    const { children, className, classes: classesProp, onClose, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const classes = gridPanelClasses;
    const [isPlaced, setIsPlaced] = React.useState(false);
    const variablesClass = useCSSVariablesClass();
    const onDidShow = useEventCallback(() => setIsPlaced(true));
    const onDidHide = useEventCallback(() => setIsPlaced(false));
    const handleClickAway = useEventCallback(() => {
        onClose?.();
    });
    const handleKeyDown = useEventCallback((event) => {
        if (event.key === 'Escape') {
            onClose?.();
        }
    });
    const [fallbackTarget, setFallbackTarget] = React.useState(null);
    React.useEffect(() => {
        const panelAnchor = apiRef.current.rootElementRef?.current?.querySelector('[data-id="gridPanelAnchor"]');
        if (panelAnchor) {
            setFallbackTarget(panelAnchor);
        }
    }, [apiRef]);
    if (!fallbackTarget) {
        return null;
    }
    return (_jsx(GridPanelRoot, { as: rootProps.slots.basePopper, ownerState: rootProps, placement: "bottom-end", className: clsx(classes.panel, className, variablesClass), flip: true, onDidShow: onDidShow, onDidHide: onDidHide, onClickAway: handleClickAway, clickAwayMouseEvent: "onPointerUp", clickAwayTouchEvent: false, focusTrap: true, ...other, ...rootProps.slotProps?.basePopper, target: props.target ?? fallbackTarget, ref: ref, children: _jsx(GridPanelContent, { className: classes.paper, ownerState: rootProps, onKeyDown: handleKeyDown, children: isPlaced && children }) }));
});
GridPanel.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    children: PropTypes.node,
    /**
     * Override or extend the styles applied to the component.
     */
    classes: PropTypes.object,
    className: PropTypes.string,
    flip: PropTypes.bool,
    id: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    target: PropTypes /* @typescript-to-proptypes-ignore */.any,
};
export { GridPanel };
