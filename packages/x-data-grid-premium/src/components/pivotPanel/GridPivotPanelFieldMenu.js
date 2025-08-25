"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridPivotPanelFieldMenu = GridPivotPanelFieldMenu;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var useId_1 = require("@mui/utils/useId");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useGridPrivateApiContext_1 = require("../../hooks/utils/useGridPrivateApiContext");
var gridPivotingSelectors_1 = require("../../hooks/features/pivoting/gridPivotingSelectors");
function GridPivotPanelFieldMenu(props) {
    var _a, _b;
    var field = props.field, modelKey = props.modelKey;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _c = React.useState(false), open = _c[0], setOpen = _c[1];
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var isAvailableField = modelKey === null;
    var pivotModel = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridPivotingSelectors_1.gridPivotModelSelector);
    var fieldIndexInModel = !isAvailableField
        ? pivotModel[modelKey].findIndex(function (item) { return item.field === field; })
        : -1;
    var modelLength = !isAvailableField ? pivotModel[modelKey].length : 0;
    var canMoveUp = fieldIndexInModel > 0;
    var canMoveDown = !isAvailableField && fieldIndexInModel < modelLength - 1;
    var menuId = (0, useId_1.default)();
    var triggerId = (0, useId_1.default)();
    var triggerRef = React.useRef(null);
    var getMenuItems = React.useCallback(function () {
        if (isAvailableField) {
            return [
                { key: 'rows', label: apiRef.current.getLocaleText('pivotMenuAddToRows') },
                { key: 'columns', label: apiRef.current.getLocaleText('pivotMenuAddToColumns') },
                { key: 'values', label: apiRef.current.getLocaleText('pivotMenuAddToValues') },
            ];
        }
        return [
            {
                key: 'up',
                label: apiRef.current.getLocaleText('pivotMenuMoveUp'),
                icon: <rootProps.slots.pivotMenuMoveUpIcon />,
                disabled: !canMoveUp,
            },
            {
                key: 'down',
                label: apiRef.current.getLocaleText('pivotMenuMoveDown'),
                icon: <rootProps.slots.pivotMenuMoveDownIcon />,
                disabled: !canMoveDown,
            },
            { divider: true },
            {
                key: 'top',
                label: apiRef.current.getLocaleText('pivotMenuMoveToTop'),
                icon: <rootProps.slots.pivotMenuMoveToTopIcon />,
                disabled: !canMoveUp,
            },
            {
                key: 'bottom',
                label: apiRef.current.getLocaleText('pivotMenuMoveToBottom'),
                icon: <rootProps.slots.pivotMenuMoveToBottomIcon />,
                disabled: !canMoveDown,
            },
            { divider: true },
            {
                key: 'rows',
                label: apiRef.current.getLocaleText('pivotMenuRows'),
                icon: modelKey === 'rows' ? <rootProps.slots.pivotMenuCheckIcon /> : <span />,
            },
            {
                key: 'columns',
                label: apiRef.current.getLocaleText('pivotMenuColumns'),
                icon: modelKey === 'columns' ? <rootProps.slots.pivotMenuCheckIcon /> : <span />,
            },
            {
                key: 'values',
                label: apiRef.current.getLocaleText('pivotMenuValues'),
                icon: modelKey === 'values' ? <rootProps.slots.pivotMenuCheckIcon /> : <span />,
            },
            { divider: true },
            {
                key: null,
                label: apiRef.current.getLocaleText('pivotMenuRemove'),
                icon: <rootProps.slots.pivotMenuRemoveIcon />,
            },
        ];
    }, [isAvailableField, apiRef, rootProps, canMoveUp, canMoveDown, modelKey]);
    var handleClick = function () {
        setOpen(!open);
    };
    var handleClose = function () {
        setOpen(false);
    };
    var handleMove = function (to) {
        handleClose();
        // Do nothing if the field is already in the target section
        if (to === modelKey) {
            return;
        }
        var targetField;
        var targetFieldPosition = null;
        var targetSection = modelKey;
        switch (to) {
            case 'up':
                targetField = pivotModel[modelKey][fieldIndexInModel - 1].field;
                targetFieldPosition = 'top';
                break;
            case 'down':
                targetField = pivotModel[modelKey][fieldIndexInModel + 1].field;
                targetFieldPosition = 'bottom';
                break;
            case 'top':
                targetField = pivotModel[modelKey][0].field;
                targetFieldPosition = 'top';
                break;
            case 'bottom':
                targetField = pivotModel[modelKey][modelLength - 1].field;
                targetFieldPosition = 'bottom';
                break;
            case 'rows':
            case 'columns':
            case 'values':
            case null:
                targetSection = to;
                break;
            default:
                break;
        }
        apiRef.current.updatePivotModel({
            field: field,
            targetField: targetField,
            targetFieldPosition: targetFieldPosition,
            targetSection: targetSection,
            originSection: modelKey,
        });
    };
    return (<React.Fragment>
      <rootProps.slots.baseIconButton size="small" {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton} id={triggerId} aria-haspopup="true" aria-controls={open ? menuId : undefined} aria-expanded={open ? 'true' : undefined} aria-label={apiRef.current.getLocaleText('pivotMenuOptions')} onClick={handleClick} ref={triggerRef}>
        {isAvailableField ? (<rootProps.slots.pivotMenuAddIcon fontSize="small"/>) : (<rootProps.slots.columnMenuIcon fontSize="small"/>)}
      </rootProps.slots.baseIconButton>

      <x_data_grid_pro_1.GridMenu target={triggerRef.current} open={open} onClose={handleClose} position="bottom-start">
        <rootProps.slots.baseMenuList id={menuId} aria-labelledby={triggerId} autoFocusItem {...(_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseMenuList}>
          {getMenuItems().map(function (item, index) {
            var _a;
            return 'divider' in item ? (<rootProps.slots.baseDivider key={"divider-".concat(index)}/>) : (<rootProps.slots.baseMenuItem key={item.key} disabled={item.disabled} onClick={function () { return handleMove(item.key); }} iconStart={item.icon} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseMenuItem}>
                {item.label}
              </rootProps.slots.baseMenuItem>);
        })}
        </rootProps.slots.baseMenuList>
      </x_data_grid_pro_1.GridMenu>
    </React.Fragment>);
}
