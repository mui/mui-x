import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import PropTypes from 'prop-types';
import { GridPinnedColumnPosition } from '@mui/x-data-grid';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
function GridColumnMenuPinningItem(props) {
    const { colDef, onClick } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const isRtl = useRtl();
    const pinColumn = React.useCallback((side) => (event) => {
        apiRef.current.pinColumn(colDef.field, side);
        onClick(event);
    }, [apiRef, colDef.field, onClick]);
    const unpinColumn = (event) => {
        apiRef.current.unpinColumn(colDef.field);
        onClick(event);
    };
    const pinToLeftMenuItem = (_jsx(rootProps.slots.baseMenuItem, { onClick: pinColumn(GridPinnedColumnPosition.LEFT), iconStart: _jsx(rootProps.slots.columnMenuPinLeftIcon, { fontSize: "small" }), children: apiRef.current.getLocaleText('pinToLeft') }));
    const pinToRightMenuItem = (_jsx(rootProps.slots.baseMenuItem, { onClick: pinColumn(GridPinnedColumnPosition.RIGHT), iconStart: _jsx(rootProps.slots.columnMenuPinRightIcon, { fontSize: "small" }), children: apiRef.current.getLocaleText('pinToRight') }));
    if (!colDef) {
        return null;
    }
    const side = apiRef.current.isColumnPinned(colDef.field);
    if (side) {
        const otherSide = side === GridPinnedColumnPosition.RIGHT
            ? GridPinnedColumnPosition.LEFT
            : GridPinnedColumnPosition.RIGHT;
        const label = otherSide === GridPinnedColumnPosition.RIGHT ? 'pinToRight' : 'pinToLeft';
        const Icon = side === GridPinnedColumnPosition.RIGHT
            ? rootProps.slots.columnMenuPinLeftIcon
            : rootProps.slots.columnMenuPinRightIcon;
        return (_jsxs(React.Fragment, { children: [_jsx(rootProps.slots.baseMenuItem, { onClick: pinColumn(otherSide), iconStart: _jsx(Icon, { fontSize: "small" }), children: apiRef.current.getLocaleText(label) }), _jsx(rootProps.slots.baseMenuItem, { onClick: unpinColumn, iconStart: _jsx("span", {}), children: apiRef.current.getLocaleText('unpin') })] }));
    }
    if (isRtl) {
        return (_jsxs(React.Fragment, { children: [pinToRightMenuItem, pinToLeftMenuItem] }));
    }
    return (_jsxs(React.Fragment, { children: [pinToLeftMenuItem, pinToRightMenuItem] }));
}
GridColumnMenuPinningItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};
export { GridColumnMenuPinningItem };
