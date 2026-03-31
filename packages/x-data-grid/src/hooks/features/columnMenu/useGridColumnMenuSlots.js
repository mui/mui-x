import * as React from 'react';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import { getColumnMenuItemKeys } from './getColumnMenuItemKeys';
const useGridColumnMenuSlots = (props) => {
    const apiRef = useGridPrivateApiContext();
    const rootProps = useGridRootProps();
    const { defaultSlots, defaultSlotProps, slots = {}, slotProps = {}, hideMenu, colDef, addDividers = true, } = props;
    const processedComponents = React.useMemo(() => ({ ...defaultSlots, ...slots }), [defaultSlots, slots]);
    const processedSlotProps = React.useMemo(() => {
        if (!slotProps || Object.keys(slotProps).length === 0) {
            return defaultSlotProps;
        }
        const mergedProps = { ...slotProps };
        Object.entries(defaultSlotProps).forEach(([key, currentSlotProps]) => {
            mergedProps[key] = { ...currentSlotProps, ...(slotProps[key] || {}) };
        });
        return mergedProps;
    }, [defaultSlotProps, slotProps]);
    return React.useMemo(() => {
        const sortedKeys = getColumnMenuItemKeys({
            apiRef,
            colDef,
            defaultSlots,
            defaultSlotProps,
            slots,
            slotProps,
        });
        return sortedKeys.reduce((acc, key, index) => {
            let itemProps = { colDef, onClick: hideMenu };
            const processedComponentProps = processedSlotProps[key];
            if (processedComponentProps) {
                const { displayOrder, ...customProps } = processedComponentProps;
                itemProps = { ...itemProps, ...customProps };
            }
            return addDividers && index !== sortedKeys.length - 1
                ? [...acc, [processedComponents[key], itemProps], [rootProps.slots.baseDivider, {}]]
                : [...acc, [processedComponents[key], itemProps]];
        }, []);
    }, [
        addDividers,
        apiRef,
        colDef,
        defaultSlotProps,
        defaultSlots,
        hideMenu,
        processedComponents,
        processedSlotProps,
        slotProps,
        slots,
        rootProps.slots.baseDivider,
    ]);
};
export { useGridColumnMenuSlots };
