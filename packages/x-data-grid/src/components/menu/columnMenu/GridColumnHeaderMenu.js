import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import useEventCallback from '@mui/utils/useEventCallback';
import HTMLElementType from '@mui/utils/HTMLElementType';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridMenu } from '../GridMenu';
function GridColumnHeaderMenu({ columnMenuId, columnMenuButtonId, ContentComponent, contentComponentProps, field, open, target, onExited, }) {
    const apiRef = useGridApiContext();
    const colDef = apiRef.current.getColumn(field);
    const hideMenu = useEventCallback((event) => {
        if (event) {
            // Prevent triggering the sorting
            event.stopPropagation();
            if (target?.contains(event.target)) {
                return;
            }
        }
        apiRef.current.hideColumnMenu();
    });
    if (!target || !colDef) {
        return null;
    }
    return (_jsx(GridMenu, { position: `bottom-${colDef.align === 'right' ? 'start' : 'end'}`, open: open, target: target, onClose: hideMenu, onExited: onExited, children: _jsx(ContentComponent, { colDef: colDef, hideMenu: hideMenu, open: open, id: columnMenuId, labelledby: columnMenuButtonId, ...contentComponentProps }) }));
}
GridColumnHeaderMenu.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    columnMenuButtonId: PropTypes.string,
    columnMenuId: PropTypes.string,
    ContentComponent: PropTypes.elementType.isRequired,
    contentComponentProps: PropTypes.any,
    field: PropTypes.string.isRequired,
    onExited: PropTypes.func,
    open: PropTypes.bool.isRequired,
    target: HTMLElementType,
};
export { GridColumnHeaderMenu };
