import { jsx as _jsx } from "react/jsx-runtime";
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
export function GridFooterPlaceholder() {
    const rootProps = useGridRootProps();
    if (rootProps.hideFooter) {
        return null;
    }
    return (_jsx(rootProps.slots.footer, { ...rootProps.slotProps?.footer /* FIXME: typing error */ }));
}
