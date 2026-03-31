import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import useId from '@mui/utils/useId';
import { useGridSelector } from '../../hooks';
import { gridPreferencePanelSelectorWithLabel, gridPreferencePanelStateSelector, } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridIconButtonContainer } from './GridIconButtonContainer';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        icon: ['filterIcon'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridColumnHeaderFilterIconButtonWrapped(props) {
    if (!props.counter) {
        return null;
    }
    return _jsx(GridColumnHeaderFilterIconButton, { ...props });
}
GridColumnHeaderFilterIconButtonWrapped.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    counter: PropTypes.number,
    field: PropTypes.string.isRequired,
    onClick: PropTypes.func,
};
function GridColumnHeaderFilterIconButton(props) {
    const { counter, field, onClick } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const ownerState = { ...props, classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);
    const labelId = useId();
    const isOpen = useGridSelector(apiRef, gridPreferencePanelSelectorWithLabel, labelId);
    const panelId = useId();
    const toggleFilter = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        const { open, openedPanelValue } = gridPreferencePanelStateSelector(apiRef);
        if (open && openedPanelValue === GridPreferencePanelsValue.filters) {
            apiRef.current.hideFilterPanel();
        }
        else {
            apiRef.current.showFilterPanel(undefined, panelId, labelId);
        }
        if (onClick) {
            onClick(apiRef.current.getColumnHeaderParams(field), event);
        }
    }, [apiRef, field, onClick, panelId, labelId]);
    if (!counter) {
        return null;
    }
    const iconButton = (_jsx(rootProps.slots.baseIconButton, { id: labelId, onClick: toggleFilter, "aria-label": apiRef.current.getLocaleText('columnHeaderFiltersLabel'), size: "small", tabIndex: -1, "aria-haspopup": "menu", "aria-expanded": isOpen, "aria-controls": isOpen ? panelId : undefined, ...rootProps.slotProps?.baseIconButton, children: _jsx(rootProps.slots.columnFilteredIcon, { className: classes.icon, fontSize: "small" }) }));
    return (_jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('columnHeaderFiltersTooltipActive')(counter), enterDelay: 1000, ...rootProps.slotProps?.baseTooltip, children: _jsxs(GridIconButtonContainer, { children: [counter > 1 && (_jsx(rootProps.slots.baseBadge, { badgeContent: counter, color: "default", children: iconButton })), counter === 1 && iconButton] }) }));
}
GridColumnHeaderFilterIconButton.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    counter: PropTypes.number,
    field: PropTypes.string.isRequired,
    onClick: PropTypes.func,
};
export { GridColumnHeaderFilterIconButtonWrapped as GridColumnHeaderFilterIconButton };
