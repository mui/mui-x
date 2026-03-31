/**
 * Returns the list of column menu item keys (sorted by `displayOrder`) that should be rendered for a given column.
 * This is shared between the column header (to know if menu is empty) and the menu itself (to render items).
 */
export function getColumnMenuItemKeys(params) {
    const { apiRef, colDef, defaultSlots, defaultSlotProps, slots = {}, slotProps = {} } = params;
    const processedComponents = { ...defaultSlots, ...slots };
    let processedSlotProps = defaultSlotProps;
    if (slotProps && Object.keys(slotProps).length > 0) {
        const mergedProps = { ...slotProps };
        Object.entries(defaultSlotProps).forEach(([key, currentSlotProps]) => {
            mergedProps[key] = { ...currentSlotProps, ...(slotProps[key] || {}) };
        });
        processedSlotProps = mergedProps;
    }
    const defaultItems = apiRef.current.unstable_applyPipeProcessors('columnMenu', [], colDef);
    const defaultComponentKeys = Object.keys(defaultSlots);
    const userItems = Object.keys(slots).filter((key) => !defaultComponentKeys.includes(key));
    const uniqueItems = Array.from(new Set([...defaultItems, ...userItems]));
    const cleansedItems = uniqueItems.filter((key) => processedComponents[key] != null);
    return cleansedItems.sort((a, b) => {
        const leftItemProps = processedSlotProps[a];
        const rightItemProps = processedSlotProps[b];
        const leftDisplayOrder = Number.isFinite(leftItemProps?.displayOrder)
            ? leftItemProps.displayOrder
            : 100;
        const rightDisplayOrder = Number.isFinite(rightItemProps?.displayOrder)
            ? rightItemProps.displayOrder
            : 100;
        return leftDisplayOrder - rightDisplayOrder;
    });
}
