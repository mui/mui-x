import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../constants/gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { vars } from '../constants/cssVariables';
import { NotRendered } from '../utils/assert';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['sortButton'],
        icon: ['sortIcon'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridColumnSortButtonRoot = styled((NotRendered), {
    name: 'MuiDataGrid',
    slot: 'SortButton',
})({
    transition: vars.transition(['opacity'], {
        duration: vars.transitions.duration.short,
        easing: vars.transitions.easing.easeInOut,
    }),
});
function getIcon(icons, direction, className, sortingOrder) {
    let Icon;
    const iconProps = {};
    if (direction === 'asc') {
        Icon = icons.columnSortedAscendingIcon;
    }
    else if (direction === 'desc') {
        Icon = icons.columnSortedDescendingIcon;
    }
    else {
        Icon = icons.columnUnsortedIcon;
        iconProps.sortingOrder = sortingOrder;
    }
    return Icon ? _jsx(Icon, { fontSize: "small", className: className, ...iconProps }) : null;
}
function GridColumnSortButton(props) {
    const { direction, index, sortingOrder, disabled, className, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const ownerState = { ...props, classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);
    const iconElement = getIcon(rootProps.slots, direction, classes.icon, sortingOrder);
    if (!iconElement) {
        return null;
    }
    const iconButton = (_jsx(GridColumnSortButtonRoot, { as: rootProps.slots.baseIconButton, ownerState: ownerState, "aria-label": apiRef.current.getLocaleText('columnHeaderSortIconLabel'), size: "small", disabled: disabled, className: clsx(classes.root, className), ...rootProps.slotProps?.baseIconButton, ...other, children: iconElement }));
    return (_jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('columnHeaderSortIconLabel'), enterDelay: 1000, ...rootProps.slotProps?.baseTooltip, children: _jsxs("span", { children: [index != null && (_jsx(rootProps.slots.baseBadge, { badgeContent: index, color: "default", overlap: "circular", children: iconButton })), index == null && iconButton] }) }));
}
GridColumnSortButton.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    direction: PropTypes.oneOf(['asc', 'desc']),
    disabled: PropTypes.bool,
    field: PropTypes.string.isRequired,
    index: PropTypes.number,
    onClick: PropTypes.func,
    sortingOrder: PropTypes.arrayOf(PropTypes.oneOf(['asc', 'desc'])).isRequired,
};
export { GridColumnSortButton };
