import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import capitalize from '@mui/utils/capitalize';
import HTMLElementType from '@mui/utils/HTMLElementType';
import { useGridRootProps, useGridApiContext, GridMenu, } from '@mui/x-data-grid';
function GridHeaderFilterMenu({ open, field, target, applyFilterChanges, operators, item, id, labelledBy, showClearItem, clearFilterItem, }) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const hideMenu = React.useCallback(() => {
        apiRef.current.hideHeaderFilterMenu();
    }, [apiRef]);
    if (!target) {
        return null;
    }
    return (_jsx(GridMenu, { position: "bottom-end", open: open, target: target, onClose: hideMenu, children: _jsxs(rootProps.slots.baseMenuList, { "aria-labelledby": labelledBy, id: id, children: [showClearItem && [
                    _jsx(rootProps.slots.baseMenuItem, { iconStart: _jsx(rootProps.slots.columnMenuClearIcon, { fontSize: "small" }), onClick: () => {
                            clearFilterItem();
                            hideMenu();
                        }, children: apiRef.current.getLocaleText('headerFilterClear') }, "filter-menu-clear-filter"),
                    _jsx(rootProps.slots.baseDivider, {}, "filter-menu-divider"),
                ], operators.map((op) => {
                    const selected = op.value === item.operator;
                    const label = op?.headerLabel ??
                        apiRef.current.getLocaleText(`headerFilterOperator${capitalize(op.value)}`);
                    return (_jsx(rootProps.slots.baseMenuItem, { iconStart: selected ? _jsx(rootProps.slots.menuItemCheckIcon, { fontSize: "small" }) : _jsx("span", {}), onClick: () => {
                            applyFilterChanges({ ...item, operator: op.value });
                            hideMenu();
                        }, autoFocus: selected ? open : false, children: label }, `${field}-${op.value}`));
                })] }) }));
}
GridHeaderFilterMenu.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    applyFilterChanges: PropTypes.func.isRequired,
    clearFilterItem: PropTypes.func.isRequired,
    field: PropTypes.string.isRequired,
    id: PropTypes /* @typescript-to-proptypes-ignore */.string,
    item: PropTypes.shape({
        field: PropTypes.string.isRequired,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        operator: PropTypes.string.isRequired,
        value: PropTypes.any,
    }).isRequired,
    labelledBy: PropTypes /* @typescript-to-proptypes-ignore */.string,
    open: PropTypes.bool.isRequired,
    operators: PropTypes.arrayOf(PropTypes.shape({
        getApplyFilterFn: PropTypes.func.isRequired,
        getValueAsString: PropTypes.func,
        headerLabel: PropTypes.string,
        InputComponent: PropTypes.elementType,
        InputComponentProps: PropTypes.shape({
            apiRef: PropTypes.shape({
                current: PropTypes.object.isRequired,
            }),
            applyValue: PropTypes.func,
            className: PropTypes.string,
            clearButton: PropTypes.node,
            disabled: PropTypes.bool,
            focusElementRef: PropTypes.oneOfType([
                PropTypes.func,
                PropTypes.shape({
                    current: PropTypes.any.isRequired,
                }),
            ]),
            headerFilterMenu: PropTypes.node,
            inputRef: PropTypes.oneOfType([
                PropTypes.func,
                PropTypes.shape({
                    current: (props, propName) => {
                        if (props[propName] == null) {
                            return null;
                        }
                        if (typeof props[propName] !== 'object' || props[propName].nodeType !== 1) {
                            return new Error(`Expected prop '${propName}' to be of type Element`);
                        }
                        return null;
                    },
                }),
            ]),
            isFilterActive: PropTypes.bool,
            item: PropTypes.shape({
                field: PropTypes.string.isRequired,
                id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                operator: PropTypes.string.isRequired,
                value: PropTypes.any,
            }),
            onBlur: PropTypes.func,
            onFocus: PropTypes.func,
            slotProps: PropTypes.object,
            tabIndex: PropTypes.number,
        }),
        label: PropTypes.string,
        requiresFilterValue: PropTypes.bool,
        value: PropTypes.string.isRequired,
    })).isRequired,
    showClearItem: PropTypes.bool.isRequired,
    target: HTMLElementType,
};
export { GridHeaderFilterMenu };
