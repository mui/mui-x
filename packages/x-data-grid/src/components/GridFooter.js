'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { gridTopLevelRowCountSelector } from '../hooks/features/rows/gridRowsSelector';
import { gridRowSelectionCountSelector } from '../hooks/features/rowSelection/gridRowSelectionSelector';
import { gridFilteredTopLevelRowCountSelector } from '../hooks/features/filter/gridFilterSelector';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridSelectedRowCount } from './GridSelectedRowCount';
import { GridFooterContainer, } from './containers/GridFooterContainer';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
const GridFooter = forwardRef(function GridFooter(props, ref) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const totalTopLevelRowCount = useGridSelector(apiRef, gridTopLevelRowCountSelector);
    const selectedRowCount = useGridSelector(apiRef, gridRowSelectionCountSelector);
    const visibleTopLevelRowCount = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector);
    const selectedRowCountElement = !rootProps.hideFooterSelectedRowCount && selectedRowCount > 0 ? (_jsx(GridSelectedRowCount, { selectedRowCount: selectedRowCount })) : (_jsx("div", {}));
    const rowCountElement = !rootProps.hideFooterRowCount && !rootProps.pagination ? (_jsx(rootProps.slots.footerRowCount, { ...rootProps.slotProps?.footerRowCount, rowCount: totalTopLevelRowCount, visibleRowCount: visibleTopLevelRowCount })) : null;
    const paginationElement = rootProps.pagination &&
        !rootProps.hideFooterPagination &&
        rootProps.slots.pagination && (_jsx(rootProps.slots.pagination, { ...rootProps.slotProps?.pagination }));
    return (_jsxs(GridFooterContainer, { ...props, ref: ref, children: [selectedRowCountElement, rowCountElement, paginationElement] }));
});
GridFooter.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    sx: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
        PropTypes.func,
        PropTypes.object,
    ]),
};
export { GridFooter };
