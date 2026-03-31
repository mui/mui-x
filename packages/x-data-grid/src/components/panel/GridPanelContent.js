import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import { vars } from '../../constants/cssVariables';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['panelContent'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridPanelContentRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'PanelContent',
})({
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    flex: '1 1',
    maxHeight: 400,
    padding: vars.spacing(2.5, 1.5, 2, 1),
    gap: vars.spacing(2.5),
});
function GridPanelContent(props) {
    const { className, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    return (_jsx(GridPanelContentRoot, { className: clsx(classes.root, className), ownerState: rootProps, ...other }));
}
GridPanelContent.propTypes = {
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
export { GridPanelContent };
