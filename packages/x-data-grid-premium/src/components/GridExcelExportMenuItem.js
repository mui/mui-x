import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
function GridExcelExportMenuItem(props) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const { hideMenu, options, ...other } = props;
    return (_jsx(rootProps.slots.baseMenuItem, { onClick: () => {
            apiRef.current.exportDataAsExcel(options);
            hideMenu?.();
        }, ...other, children: apiRef.current.getLocaleText('toolbarExportExcel') }));
}
GridExcelExportMenuItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    hideMenu: PropTypes.func,
    options: PropTypes.shape({
        allColumns: PropTypes.bool,
        columnsStyles: PropTypes.object,
        disableToolbarButton: PropTypes.bool,
        escapeFormulas: PropTypes.bool,
        exceljsPostProcess: PropTypes.func,
        exceljsPreProcess: PropTypes.func,
        fields: PropTypes.arrayOf(PropTypes.string),
        fileName: PropTypes.string,
        getRowsToExport: PropTypes.func,
        includeColumnGroupsHeaders: PropTypes.bool,
        includeHeaders: PropTypes.bool,
        valueOptionsSheetName: PropTypes.string,
        worker: PropTypes.func,
    }),
};
export { GridExcelExportMenuItem };
