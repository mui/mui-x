import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { gridClasses, getDataGridUtilityClass, useGridSelector, gridRowsLoadingSelector, gridRowTreeSelector, GRID_ROOT_GROUP_ID, } from '@mui/x-data-grid-pro';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { GridAggregationRowOverlay } from './GridAggregationRowOverlay';
import { useGridRootProps } from '../typeOverloads/reexports';
import { gridAggregationModelSelector } from '../hooks';
const useUtilityClasses = () => {
    const slots = {
        root: ['bottomContainer'],
    };
    return composeClasses(slots, getDataGridUtilityClass, {});
};
const Element = styled('div', {
    slot: 'internal',
    shouldForwardProp: undefined,
})({
    position: 'sticky',
    zIndex: 40,
    bottom: 'calc(var(--DataGrid-hasScrollX) * var(--DataGrid-scrollbarSize))',
});
export function GridBottomContainer(props) {
    const classes = useUtilityClasses();
    const rootProps = useGridRootProps();
    const apiRef = useGridPrivateApiContext();
    const isLoading = useGridSelector(apiRef, gridRowsLoadingSelector);
    const tree = useGridSelector(apiRef, gridRowTreeSelector);
    const aggregationModel = useGridSelector(apiRef, gridAggregationModelSelector);
    const aggregationPosition = rootProps.getAggregationPosition(tree[GRID_ROOT_GROUP_ID]);
    const hasAggregation = React.useMemo(() => Object.keys(aggregationModel).length > 0, [aggregationModel]);
    const { children, ...other } = props;
    return (_jsx(Element, { ...other, className: clsx(classes.root, gridClasses['container--bottom']), role: "presentation", children: hasAggregation && isLoading && aggregationPosition === 'footer' ? (_jsx(GridAggregationRowOverlay, {})) : (children) }));
}
