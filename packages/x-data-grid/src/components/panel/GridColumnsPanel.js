import { jsx as _jsx } from "react/jsx-runtime";
import { GridPanelWrapper } from './GridPanelWrapper';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
function GridColumnsPanel(props) {
    const rootProps = useGridRootProps();
    return (_jsx(GridPanelWrapper, { ...props, children: _jsx(rootProps.slots.columnsManagement, { ...rootProps.slotProps?.columnsManagement }) }));
}
export { GridColumnsPanel };
