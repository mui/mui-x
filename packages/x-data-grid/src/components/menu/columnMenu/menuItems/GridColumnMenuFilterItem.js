import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';
function GridColumnMenuFilterItem(props) {
    const { colDef, onClick } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const showFilter = React.useCallback((event) => {
        onClick(event);
        apiRef.current.showFilterPanel(colDef.field);
    }, [apiRef, colDef.field, onClick]);
    if (rootProps.disableColumnFilter || !colDef.filterable) {
        return null;
    }
    return (_jsx(rootProps.slots.baseMenuItem, { onClick: showFilter, iconStart: _jsx(rootProps.slots.columnMenuFilterIcon, { fontSize: "small" }), children: apiRef.current.getLocaleText('columnMenuFilter') }));
}
GridColumnMenuFilterItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};
export { GridColumnMenuFilterItem };
