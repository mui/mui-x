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
        root: ['panelHeader'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
const GridPanelHeaderRoot = styled('div', {
    name: 'MuiDataGrid',
    slot: 'PanelHeader',
})({
    padding: vars.spacing(1),
});
function GridPanelHeader(props) {
    const { className, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    return (_jsx(GridPanelHeaderRoot, { className: clsx(classes.root, className), ownerState: rootProps, ...other }));
}
GridPanelHeader.propTypes = {
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
export { GridPanelHeader };
