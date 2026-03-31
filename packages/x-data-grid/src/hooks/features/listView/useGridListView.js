'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { warnOnce } from '@mui/x-internals/warning';
import { gridDimensionsSelector } from '../dimensions';
import { useGridEvent } from '../../utils/useGridEvent';
export const listViewStateInitializer = (state, props, apiRef) => ({
    ...state,
    listViewColumn: props.listViewColumn
        ? { ...props.listViewColumn, computedWidth: getListColumnWidth(apiRef) }
        : undefined,
});
export function useGridListView(apiRef, props) {
    /*
     * EVENTS
     */
    const updateListColumnWidth = () => {
        apiRef.current.setState((state) => {
            if (!state.listViewColumn) {
                return state;
            }
            return {
                ...state,
                listViewColumn: {
                    ...state.listViewColumn,
                    computedWidth: getListColumnWidth(apiRef),
                },
            };
        });
    };
    const prevInnerWidth = React.useRef(null);
    const handleGridSizeChange = (viewportInnerSize) => {
        if (prevInnerWidth.current !== viewportInnerSize.width) {
            prevInnerWidth.current = viewportInnerSize.width;
            updateListColumnWidth();
        }
    };
    useGridEvent(apiRef, 'viewportInnerSizeChange', handleGridSizeChange);
    useGridEvent(apiRef, 'columnVisibilityModelChange', updateListColumnWidth);
    /*
     * EFFECTS
     */
    useEnhancedEffect(() => {
        const listColumn = props.listViewColumn;
        if (listColumn) {
            apiRef.current.setState((state) => {
                return {
                    ...state,
                    listViewColumn: {
                        ...listColumn,
                        computedWidth: getListColumnWidth(apiRef),
                    },
                };
            });
        }
    }, [apiRef, props.listViewColumn]);
    React.useEffect(() => {
        if (props.listView && !props.listViewColumn) {
            warnOnce([
                'MUI X: The `listViewColumn` prop must be set if `listView` is enabled.',
                'To fix, pass a column definition to the `listViewColumn` prop, e.g. `{ field: "example", renderCell: (params) => <div>{params.row.id}</div> }`.',
                'For more details, see https://mui.com/x/react-data-grid/list-view/',
            ]);
        }
    }, [props.listView, props.listViewColumn]);
}
function getListColumnWidth(apiRef) {
    return gridDimensionsSelector(apiRef).viewportInnerSize.width;
}
