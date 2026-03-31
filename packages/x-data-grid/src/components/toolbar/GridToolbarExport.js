'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridToolbarExportContainer } from './GridToolbarExportContainer';
function GridCsvExportMenuItem(props) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const { hideMenu, options, ...other } = props;
    return (_jsx(rootProps.slots.baseMenuItem, { onClick: () => {
            apiRef.current.exportDataAsCsv(options);
            hideMenu?.();
        }, ...other, children: apiRef.current.getLocaleText('toolbarExportCSV') }));
}
GridCsvExportMenuItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    hideMenu: PropTypes.func,
    options: PropTypes.shape({
        allColumns: PropTypes.bool,
        delimiter: PropTypes.string,
        disableToolbarButton: PropTypes.bool,
        escapeFormulas: PropTypes.bool,
        fields: PropTypes.arrayOf(PropTypes.string),
        fileName: PropTypes.string,
        getRowsToExport: PropTypes.func,
        includeColumnGroupsHeaders: PropTypes.bool,
        includeHeaders: PropTypes.bool,
        shouldAppendQuotes: PropTypes.bool,
        utf8WithBom: PropTypes.bool,
    }),
};
function GridPrintExportMenuItem(props) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const { hideMenu, options, ...other } = props;
    return (_jsx(rootProps.slots.baseMenuItem, { onClick: () => {
            apiRef.current.exportDataAsPrint(options);
            hideMenu?.();
        }, ...other, children: apiRef.current.getLocaleText('toolbarExportPrint') }));
}
GridPrintExportMenuItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    hideMenu: PropTypes.func,
    options: PropTypes.shape({
        allColumns: PropTypes.bool,
        bodyClassName: PropTypes.string,
        copyStyles: PropTypes.bool,
        disableToolbarButton: PropTypes.bool,
        fields: PropTypes.arrayOf(PropTypes.string),
        fileName: PropTypes.string,
        getRowsToExport: PropTypes.func,
        hideFooter: PropTypes.bool,
        hideToolbar: PropTypes.bool,
        includeCheckboxes: PropTypes.bool,
        pageStyle: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    }),
};
/**
 * @deprecated Use the {@link https://mui.com/x/react-data-grid/components/export/ Export} components instead. This component will be removed in a future major release.
 */
const GridToolbarExport = forwardRef(function GridToolbarExport(props, ref) {
    const { csvOptions = {}, printOptions = {}, excelOptions, ...other } = props;
    const apiRef = useGridApiContext();
    const preProcessedButtons = apiRef.current
        .unstable_applyPipeProcessors('exportMenu', [], { excelOptions, csvOptions, printOptions })
        .sort((a, b) => (a.componentName > b.componentName ? 1 : -1));
    if (preProcessedButtons.length === 0) {
        return null;
    }
    return (_jsx(GridToolbarExportContainer, { ...other, ref: ref, children: preProcessedButtons.map((button, index) => React.cloneElement(button.component, { key: index })) }));
});
GridToolbarExport.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    csvOptions: PropTypes.object,
    printOptions: PropTypes.object,
    /**
     * The props used for each slot inside.
     * @default {}
     */
    slotProps: PropTypes.object,
};
export { GridToolbarExport, GridCsvExportMenuItem, GridPrintExportMenuItem };
