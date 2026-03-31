'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { isOverflown } from '../../utils/domUtils';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['columnHeaderTitle'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridColumnHeaderTitleRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ColumnHeaderTitle',
})({
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontWeight: 'var(--unstable_DataGrid-headWeight)',
    lineHeight: 'normal',
});
const ColumnHeaderInnerTitle = forwardRef(function ColumnHeaderInnerTitle(props, ref) {
    // Tooltip adds aria-label to the props, which is not needed since the children prop is a string
    // See https://github.com/mui/mui-x/pull/14482
    const { className, 'aria-label': ariaLabel, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    return (_jsx(GridColumnHeaderTitleRoot, { className: clsx(classes.root, className), ownerState: rootProps, ...other, ref: ref }));
});
// No React.memo here as if we display the sort icon, we need to recalculate the isOver
function GridColumnHeaderTitle(props) {
    const { label, description } = props;
    const rootProps = useGridRootProps();
    const titleRef = React.useRef(null);
    const [tooltip, setTooltip] = React.useState('');
    const handleMouseOver = React.useCallback(() => {
        if (!description && titleRef?.current) {
            const isOver = isOverflown(titleRef.current);
            if (isOver) {
                setTooltip(label);
            }
            else {
                setTooltip('');
            }
        }
    }, [description, label]);
    return (_jsx(rootProps.slots.baseTooltip, { title: description || tooltip, ...rootProps.slotProps?.baseTooltip, children: _jsx(ColumnHeaderInnerTitle, { onMouseOver: handleMouseOver, ref: titleRef, children: label }) }));
}
GridColumnHeaderTitle.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    columnWidth: PropTypes.number.isRequired,
    description: PropTypes.node,
    label: PropTypes.string.isRequired,
};
export { GridColumnHeaderTitle };
