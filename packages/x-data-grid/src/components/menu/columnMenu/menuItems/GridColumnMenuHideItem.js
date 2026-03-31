import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';
import { gridVisibleColumnDefinitionsSelector } from '../../../../hooks/features/columns';
function GridColumnMenuHideItem(props) {
    const { colDef, onClick } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const visibleColumns = gridVisibleColumnDefinitionsSelector(apiRef);
    const columnsWithMenu = visibleColumns.filter((col) => col.disableColumnMenu !== true);
    // do not allow to hide the last column with menu
    const disabled = columnsWithMenu.length === 1;
    const toggleColumn = React.useCallback((event) => {
        /**
         * Disabled `MenuItem` would trigger `click` event
         * after imperative `.click()` call on HTML element.
         * Also, click is triggered in testing environment as well.
         */
        if (disabled) {
            return;
        }
        apiRef.current.setColumnVisibility(colDef.field, false);
        onClick(event);
    }, [apiRef, colDef.field, onClick, disabled]);
    if (rootProps.disableColumnSelector) {
        return null;
    }
    if (colDef.hideable === false) {
        return null;
    }
    return (_jsx(rootProps.slots.baseMenuItem, { onClick: toggleColumn, disabled: disabled, iconStart: _jsx(rootProps.slots.columnMenuHideIcon, { fontSize: "small" }), children: apiRef.current.getLocaleText('columnMenuHideColumn') }));
}
GridColumnMenuHideItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};
export { GridColumnMenuHideItem };
