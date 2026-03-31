import { jsx as _jsx } from "react/jsx-runtime";
import clsx from 'clsx';
import { gridClasses } from '../constants';
const classes = {
    root: gridClasses.scrollbarFiller,
    pinnedRight: gridClasses['scrollbarFiller--pinnedRight'],
};
function GridScrollbarFillerCell({ pinnedRight }) {
    return (_jsx("div", { role: "presentation", className: clsx(classes.root, pinnedRight && classes.pinnedRight) }));
}
export { GridScrollbarFillerCell };
