'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import useForkRef from '@mui/utils/useForkRef';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridMenu } from '../menu/GridMenu';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridClasses } from '../../constants/gridClasses';
const GridToolbarExportContainer = forwardRef(function GridToolbarExportContainer(props, ref) {
    const { children, slotProps = {} } = props;
    const buttonProps = slotProps.button || {};
    const tooltipProps = slotProps.tooltip || {};
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const exportButtonId = useId();
    const exportMenuId = useId();
    const [open, setOpen] = React.useState(false);
    const buttonRef = React.useRef(null);
    const handleRef = useForkRef(ref, buttonRef);
    const handleMenuOpen = (event) => {
        setOpen((prevOpen) => !prevOpen);
        buttonProps.onClick?.(event);
    };
    const handleMenuClose = () => setOpen(false);
    if (children == null) {
        return null;
    }
    return (_jsxs(React.Fragment, { children: [_jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarExportLabel'), enterDelay: 1000, ...rootProps.slotProps?.baseTooltip, ...tooltipProps, children: _jsx(rootProps.slots.baseButton, { size: "small", startIcon: _jsx(rootProps.slots.exportIcon, {}), "aria-expanded": open, "aria-label": apiRef.current.getLocaleText('toolbarExportLabel'), "aria-haspopup": "menu", "aria-controls": open ? exportMenuId : undefined, id: exportButtonId, ...rootProps.slotProps?.baseButton, ...buttonProps, onClick: handleMenuOpen, ref: handleRef, children: apiRef.current.getLocaleText('toolbarExport') }) }), _jsx(GridMenu, { open: open, target: buttonRef.current, onClose: handleMenuClose, position: "bottom-end", children: _jsx(rootProps.slots.baseMenuList, { id: exportMenuId, className: gridClasses.menuList, "aria-labelledby": exportButtonId, autoFocusItem: open, children: React.Children.map(children, (child) => {
                        if (!React.isValidElement(child)) {
                            return child;
                        }
                        return React.cloneElement(child, { hideMenu: handleMenuClose });
                    }) }) })] }));
});
GridToolbarExportContainer.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The props used for each slot inside.
     * @default {}
     */
    slotProps: PropTypes.object,
};
export { GridToolbarExportContainer };
