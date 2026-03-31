import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import capitalize from '@mui/utils/capitalize';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
var GridColumnHeaderSeparatorSides;
(function (GridColumnHeaderSeparatorSides) {
    GridColumnHeaderSeparatorSides["Left"] = "left";
    GridColumnHeaderSeparatorSides["Right"] = "right";
})(GridColumnHeaderSeparatorSides || (GridColumnHeaderSeparatorSides = {}));
const useUtilityClasses = (ownerState) => {
    const { resizable, resizing, classes, side } = ownerState;
    const slots = {
        root: [
            'columnSeparator',
            resizable && 'columnSeparator--resizable',
            resizing && 'columnSeparator--resizing',
            side && `columnSeparator--side${capitalize(side)}`,
        ],
        icon: ['iconSeparator'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridColumnHeaderSeparatorRaw(props) {
    const { resizable, resizing, height, side = GridColumnHeaderSeparatorSides.Right, ...other } = props;
    const rootProps = useGridRootProps();
    const ownerState = { ...props, side, classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);
    const stopClick = React.useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);
    return (_jsx("div", { className: classes.root, style: { minHeight: height }, ...other, onClick: stopClick, children: _jsx(rootProps.slots.columnResizeIcon, { className: classes.icon }) }));
}
const GridColumnHeaderSeparator = React.memo(GridColumnHeaderSeparatorRaw);
GridColumnHeaderSeparatorRaw.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    height: PropTypes.number.isRequired,
    resizable: PropTypes.bool.isRequired,
    resizing: PropTypes.bool.isRequired,
    side: PropTypes.oneOf(['left', 'right']),
};
export { GridColumnHeaderSeparator, GridColumnHeaderSeparatorSides };
