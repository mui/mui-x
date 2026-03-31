'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import useForkRef from '@mui/utils/useForkRef';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { gridDensitySelector } from '../../hooks/features/density/densitySelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { GridMenu } from '../menu/GridMenu';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridClasses } from '../../constants/gridClasses';
/**
 * @deprecated See {@link https://mui.com/x/react-data-grid/accessibility/#set-the-density-programmatically Accessibility—Set the density programmatically} for an example of adding a density selector to the toolbar. This component will be removed in a future major release.
 */
const GridToolbarDensitySelector = forwardRef(function GridToolbarDensitySelector(props, ref) {
    const { slotProps = {} } = props;
    const buttonProps = slotProps.button || {};
    const tooltipProps = slotProps.tooltip || {};
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const density = useGridSelector(apiRef, gridDensitySelector);
    const densityButtonId = useId();
    const densityMenuId = useId();
    const [open, setOpen] = React.useState(false);
    const buttonRef = React.useRef(null);
    const handleRef = useForkRef(ref, buttonRef);
    const densityOptions = [
        {
            icon: _jsx(rootProps.slots.densityCompactIcon, {}),
            label: apiRef.current.getLocaleText('toolbarDensityCompact'),
            value: 'compact',
        },
        {
            icon: _jsx(rootProps.slots.densityStandardIcon, {}),
            label: apiRef.current.getLocaleText('toolbarDensityStandard'),
            value: 'standard',
        },
        {
            icon: _jsx(rootProps.slots.densityComfortableIcon, {}),
            label: apiRef.current.getLocaleText('toolbarDensityComfortable'),
            value: 'comfortable',
        },
    ];
    const startIcon = React.useMemo(() => {
        switch (density) {
            case 'compact':
                return _jsx(rootProps.slots.densityCompactIcon, {});
            case 'comfortable':
                return _jsx(rootProps.slots.densityComfortableIcon, {});
            default:
                return _jsx(rootProps.slots.densityStandardIcon, {});
        }
    }, [density, rootProps]);
    const handleDensitySelectorOpen = (event) => {
        setOpen((prevOpen) => !prevOpen);
        buttonProps.onClick?.(event);
    };
    const handleDensitySelectorClose = () => {
        setOpen(false);
    };
    const handleDensityUpdate = (newDensity) => {
        apiRef.current.setDensity(newDensity);
        setOpen(false);
    };
    // Disable the button if the corresponding is disabled
    if (rootProps.disableDensitySelector) {
        return null;
    }
    const densityElements = densityOptions.map((option, index) => (_jsx(rootProps.slots.baseMenuItem, { onClick: () => handleDensityUpdate(option.value), selected: option.value === density, iconStart: option.icon, children: option.label }, index)));
    return (_jsxs(React.Fragment, { children: [_jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarDensityLabel'), enterDelay: 1000, ...rootProps.slotProps?.baseTooltip, ...tooltipProps, children: _jsx(rootProps.slots.baseButton, { size: "small", startIcon: startIcon, "aria-label": apiRef.current.getLocaleText('toolbarDensityLabel'), "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": open ? densityMenuId : undefined, id: densityButtonId, ...rootProps.slotProps?.baseButton, ...buttonProps, onClick: handleDensitySelectorOpen, ref: handleRef, children: apiRef.current.getLocaleText('toolbarDensity') }) }), _jsx(GridMenu, { open: open, target: buttonRef.current, onClose: handleDensitySelectorClose, position: "bottom-end", children: _jsx(rootProps.slots.baseMenuList, { id: densityMenuId, className: gridClasses.menuList, "aria-labelledby": densityButtonId, autoFocusItem: open, children: densityElements }) })] }));
});
GridToolbarDensitySelector.propTypes = {
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
export { GridToolbarDensitySelector };
