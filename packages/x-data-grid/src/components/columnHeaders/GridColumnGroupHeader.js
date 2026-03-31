'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import useId from '@mui/utils/useId';
import composeClasses from '@mui/utils/composeClasses';
import capitalize from '@mui/utils/capitalize';
import { useRtl } from '@mui/system/RtlProvider';
import { doesSupportPreventScroll } from '../../utils/doesSupportPreventScroll';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridColumnGroupsLookupSelector } from '../../hooks/features/columnGrouping/gridColumnGroupsSelector';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { GridGenericColumnHeaderItem } from './GridGenericColumnHeaderItem';
import { isEventTargetInPortal } from '../../utils/domUtils';
import { PinnedColumnPosition } from '../../internals/constants';
import { attachPinnedStyle } from '../../internals/utils';
const useUtilityClasses = (ownerState) => {
    const { classes, headerAlign, isDragging, isLastColumn, showLeftBorder, showRightBorder, groupId, pinnedPosition, } = ownerState;
    const slots = {
        root: [
            'columnHeader',
            headerAlign && `columnHeader--align${capitalize(headerAlign)}`,
            isDragging && 'columnHeader--moving',
            showRightBorder && 'columnHeader--withRightBorder',
            showLeftBorder && 'columnHeader--withLeftBorder',
            'withBorderColor',
            groupId === null ? 'columnHeader--emptyGroup' : 'columnHeader--filledGroup',
            pinnedPosition === PinnedColumnPosition.LEFT && 'columnHeader--pinnedLeft',
            pinnedPosition === PinnedColumnPosition.RIGHT && 'columnHeader--pinnedRight',
            isLastColumn && 'columnHeader--last',
        ],
        draggableContainer: ['columnHeaderDraggableContainer'],
        titleContainer: ['columnHeaderTitleContainer', 'withBorderColor'],
        titleContainerContent: ['columnHeaderTitleContainerContent'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridColumnGroupHeader(props) {
    const { groupId, width, depth, maxDepth, fields, height, colIndex, hasFocus, tabIndex, isLastColumn, pinnedPosition, pinnedOffset, } = props;
    const rootProps = useGridRootProps();
    const isRtl = useRtl();
    const headerCellRef = React.useRef(null);
    const apiRef = useGridApiContext();
    const columnGroupsLookup = useGridSelector(apiRef, gridColumnGroupsLookupSelector);
    const group = groupId ? columnGroupsLookup[groupId] : {};
    const { headerName = groupId ?? '', description = '', headerAlign = undefined } = group;
    let headerComponent;
    const render = groupId && columnGroupsLookup[groupId]?.renderHeaderGroup;
    const renderParams = React.useMemo(() => ({
        groupId,
        headerName,
        description,
        depth,
        maxDepth,
        fields,
        colIndex,
        isLastColumn,
    }), [groupId, headerName, description, depth, maxDepth, fields, colIndex, isLastColumn]);
    if (groupId && render) {
        headerComponent = render(renderParams);
    }
    const ownerState = {
        ...props,
        classes: rootProps.classes,
        headerAlign,
        depth,
        isDragging: false,
    };
    const label = headerName ?? groupId;
    const id = useId();
    const elementId = groupId === null ? `empty-group-cell-${id}` : groupId;
    const classes = useUtilityClasses(ownerState);
    React.useLayoutEffect(() => {
        if (hasFocus) {
            const focusableElement = headerCellRef.current.querySelector('[tabindex="0"]');
            const elementToFocus = focusableElement || headerCellRef.current;
            if (!elementToFocus) {
                return;
            }
            if (doesSupportPreventScroll()) {
                elementToFocus.focus({ preventScroll: true });
            }
            else {
                const scrollPosition = apiRef.current.getScrollPosition();
                elementToFocus.focus();
                apiRef.current.scroll(scrollPosition);
            }
        }
    }, [apiRef, hasFocus]);
    const publish = React.useCallback((eventName) => (event) => {
        // Ignore portal
        // See https://github.com/mui/mui-x/issues/1721
        if (isEventTargetInPortal(event)) {
            return;
        }
        apiRef.current.publishEvent(eventName, renderParams, event);
    }, 
    // For now this is stupid, because renderParams change all the time.
    // Need to move it's computation in the api, such that for a given depth+columnField, I can get the group parameters
    [apiRef, renderParams]);
    const mouseEventsHandlers = React.useMemo(() => ({
        onKeyDown: publish('columnGroupHeaderKeyDown'),
        onFocus: publish('columnGroupHeaderFocus'),
        onBlur: publish('columnGroupHeaderBlur'),
    }), [publish]);
    const headerClassName = typeof group.headerClassName === 'function'
        ? group.headerClassName(renderParams)
        : group.headerClassName;
    const style = React.useMemo(() => attachPinnedStyle({ ...props.style }, isRtl, pinnedPosition, pinnedOffset), [pinnedPosition, pinnedOffset, props.style, isRtl]);
    return (_jsx(GridGenericColumnHeaderItem, { ref: headerCellRef, classes: classes, columnMenuOpen: false, colIndex: colIndex, height: height, isResizing: false, sortDirection: null, hasFocus: false, tabIndex: tabIndex, isDraggable: false, headerComponent: headerComponent, headerClassName: headerClassName, description: description, elementId: elementId, width: width, columnMenuIconButton: null, columnTitleIconButtons: null, resizable: false, label: label, "aria-colspan": fields.length, "data-fields": `|-${fields.join('-|-')}-|`, style: style, ...mouseEventsHandlers }));
}
export { GridColumnGroupHeader };
