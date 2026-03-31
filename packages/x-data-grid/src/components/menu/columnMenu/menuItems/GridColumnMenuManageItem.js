import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import { GridPreferencePanelsValue } from '../../../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';
function GridColumnMenuManageItem(props) {
    const { onClick } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const showColumns = React.useCallback((event) => {
        onClick(event); // hide column menu
        apiRef.current.showPreferences(GridPreferencePanelsValue.columns);
    }, [apiRef, onClick]);
    if (rootProps.disableColumnSelector) {
        return null;
    }
    return (_jsx(rootProps.slots.baseMenuItem, { onClick: showColumns, iconStart: _jsx(rootProps.slots.columnMenuManageColumnsIcon, { fontSize: "small" }), children: apiRef.current.getLocaleText('columnMenuManageColumns') }));
}
GridColumnMenuManageItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};
export { GridColumnMenuManageItem };
