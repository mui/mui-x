import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { gridClasses, getDataGridUtilityClass } from '../../constants/gridClasses';
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
    return (_jsx(Element, { ...props, className: clsx(classes.root, gridClasses['container--bottom']), role: "presentation" }));
}
