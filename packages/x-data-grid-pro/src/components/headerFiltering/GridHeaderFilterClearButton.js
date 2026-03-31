import { jsx as _jsx } from "react/jsx-runtime";
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
function GridHeaderFilterClearButton(props) {
    const rootProps = useGridRootProps();
    return (_jsx(rootProps.slots.baseIconButton, { tabIndex: -1, "aria-label": "Clear filter", size: "small", ...rootProps.slotProps?.baseIconButton, ...props, children: _jsx(rootProps.slots.columnMenuClearIcon, { fontSize: "inherit" }) }));
}
export { GridHeaderFilterClearButton };
