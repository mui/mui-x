import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import clsx from 'clsx';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import { styled, useTheme } from '@mui/material/styles';
import MUIAutocomplete from '@mui/material/Autocomplete';
import MUIBadge from '@mui/material/Badge';
import MUICheckbox from '@mui/material/Checkbox';
import MUIChip from '@mui/material/Chip';
import MUICircularProgress from '@mui/material/CircularProgress';
import MUIDivider from '@mui/material/Divider';
import MUIInputBase from '@mui/material/InputBase';
import MUIFocusTrap from '@mui/material/Unstable_TrapFocus';
import MUILinearProgress from '@mui/material/LinearProgress';
import MUIListItemIcon from '@mui/material/ListItemIcon';
import MUIListItemText, { listItemTextClasses } from '@mui/material/ListItemText';
import MUIMenuList from '@mui/material/MenuList';
import MUIMenuItem from '@mui/material/MenuItem';
import MUITextField from '@mui/material/TextField';
import MUITextareaAutosize from '@mui/material/TextareaAutosize';
import MUIFormControl from '@mui/material/FormControl';
import MUIFormControlLabel, { formControlLabelClasses } from '@mui/material/FormControlLabel';
import MUISelect from '@mui/material/Select';
import MUISwitch from '@mui/material/Switch';
import MUIButton from '@mui/material/Button';
import MUIIconButton, { iconButtonClasses } from '@mui/material/IconButton';
import MUIInputAdornment, { inputAdornmentClasses } from '@mui/material/InputAdornment';
import MUITooltip from '@mui/material/Tooltip';
import MUIPagination, { tablePaginationClasses } from '@mui/material/TablePagination';
import MUIPopper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MUIGrow from '@mui/material/Grow';
import MUIPaper from '@mui/material/Paper';
import MUIInputLabel from '@mui/material/InputLabel';
import MUISkeleton from '@mui/material/Skeleton';
import MUITabs from '@mui/material/Tabs';
import MUITab from '@mui/material/Tab';
import MUIToggleButton from '@mui/material/ToggleButton';
import { forwardRef } from '@mui/x-internals/forwardRef';
import useId from '@mui/utils/useId';
import { GridAddIcon, GridArrowDownwardIcon, GridArrowUpwardIcon, GridCheckIcon, GridCloseIcon, GridUndoIcon, GridRedoIcon, GridColumnIcon, GridDragIcon, GridExpandMoreIcon, GridFilterAltIcon, GridFilterListIcon, GridKeyboardArrowRight, GridMoreVertIcon, GridRemoveIcon, GridSearchIcon, GridSeparatorIcon, GridTableRowsIcon, GridTripleDotsVerticalIcon, GridViewHeadlineIcon, GridViewStreamIcon, GridVisibilityOffIcon, GridViewColumnIcon, GridClearIcon, GridLoadIcon, GridDeleteForeverIcon, GridDownloadIcon, GridLongTextCellExpandIcon, GridLongTextCellCollapseIcon, } from './icons';
import { GridColumnUnsortedIcon } from '../components/GridColumnUnsortedIcon';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import './augmentation';
export { useMaterialCSSVariables } from './variables';
/* eslint-disable mui/disallow-react-api-in-server-components */
const InputAdornment = styled(MUIInputAdornment, {
    slot: 'internal',
})(({ theme }) => ({
    [`&.${inputAdornmentClasses.positionEnd} .${iconButtonClasses.sizeSmall}`]: {
        marginRight: theme.spacing(-0.75),
    },
}));
const FormControlLabel = styled(MUIFormControlLabel, {
    slot: 'internal',
    shouldForwardProp: (prop) => prop !== 'fullWidth',
})(({ theme }) => ({
    gap: theme.spacing(0.5),
    margin: 0,
    overflow: 'hidden',
    [`& .${formControlLabelClasses.label}`]: {
        fontSize: theme.typography.pxToRem(14),
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    variants: [
        {
            props: { fullWidth: true },
            style: {
                width: '100%',
            },
        },
    ],
}));
const Checkbox = styled(MUICheckbox, {
    slot: 'internal',
    shouldForwardProp: (prop) => prop !== 'density',
})(({ theme }) => ({
    variants: [
        {
            props: { density: 'compact' },
            style: {
                padding: theme.spacing(0.5),
            },
        },
    ],
}));
const ListItemText = styled(MUIListItemText, {
    slot: 'internal',
})({
    [`& .${listItemTextClasses.primary}`]: {
        overflowX: 'clip',
        textOverflow: 'ellipsis',
        maxWidth: '300px',
    },
});
const BaseSelect = forwardRef(function BaseSelect(props, ref) {
    const { id, label, labelId, material, disabled, slotProps, onChange, onKeyDown, onOpen, onClose, size, style, fullWidth, ...other } = props;
    const theme = useTheme();
    const textFieldDefaults = (theme.components?.MuiTextField?.defaultProps ?? {});
    const computedSize = (size ?? textFieldDefaults.size);
    const computedVariant = (textFieldDefaults.variant ?? 'outlined');
    const menuProps = {
        slotProps: { paper: { onKeyDown } },
    };
    if (onClose) {
        menuProps.onClose = onClose;
    }
    return (_jsxs(MUIFormControl, { size: computedSize, fullWidth: fullWidth, style: style, disabled: disabled, ref: ref, children: [_jsx(MUIInputLabel, { id: labelId, htmlFor: id, shrink: true, variant: computedVariant, children: label }), _jsx(MUISelect, { id: id, labelId: labelId, label: label, displayEmpty: true, onChange: onChange, variant: computedVariant, ...other, inputProps: slotProps?.htmlInput, onOpen: onOpen, MenuProps: menuProps, size: computedSize, ...material })] }));
});
const StyledPagination = styled(MUIPagination, {
    slot: 'internal',
})(({ theme }) => ({
    [`& .${tablePaginationClasses.selectLabel}`]: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    [`& .${tablePaginationClasses.input}`]: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'inline-flex',
        },
    },
}));
const BasePagination = forwardRef(function BasePagination(props, ref) {
    const { onRowsPerPageChange, material, disabled, ...other } = props;
    const computedProps = React.useMemo(() => {
        if (!disabled) {
            return undefined;
        }
        return {
            backIconButtonProps: { disabled: true },
            nextIconButtonProps: { disabled: true },
        };
    }, [disabled]);
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const { estimatedRowCount } = rootProps;
    return (_jsx(StyledPagination, { component: "div", onRowsPerPageChange: useEventCallback((event) => {
            onRowsPerPageChange?.(Number(event.target.value));
        }), labelRowsPerPage: apiRef.current.getLocaleText('paginationRowsPerPage'), labelDisplayedRows: (params) => apiRef.current.getLocaleText('paginationDisplayedRows')({
            ...params,
            estimated: estimatedRowCount,
        }), getItemAriaLabel: apiRef.current.getLocaleText('paginationItemAriaLabel'), ...computedProps, ...other, ...material, ref: ref }));
});
const BaseBadge = forwardRef(function BaseBadge(props, ref) {
    const { material, ...other } = props;
    return _jsx(MUIBadge, { ...other, ...material, ref: ref });
});
const BaseCheckbox = forwardRef(function BaseCheckbox(props, ref) {
    const { autoFocus, label, fullWidth, slotProps, className, material, ...other } = props;
    const elementRef = React.useRef(null);
    const handleRef = useForkRef(elementRef, ref);
    const rippleRef = React.useRef(null);
    React.useEffect(() => {
        if (autoFocus) {
            const input = elementRef.current?.querySelector('input');
            input?.focus({ preventScroll: true });
        }
        else if (autoFocus === false && rippleRef.current) {
            // Only available in @mui/material v5.4.1 or later
            // @ts-ignore
            rippleRef.current.stop({});
        }
    }, [autoFocus]);
    if (!label) {
        return (_jsx(Checkbox, { ...other, ...material, className: clsx(className, material?.className), slotProps: { input: slotProps?.htmlInput }, ref: handleRef, touchRippleRef: rippleRef }));
    }
    return (_jsx(FormControlLabel, { className: className, control: _jsx(Checkbox, { ...other, ...material, slotProps: { input: slotProps?.htmlInput }, ref: handleRef, touchRippleRef: rippleRef }), label: label, fullWidth: fullWidth }));
});
const BaseCircularProgress = forwardRef(function BaseCircularProgress(props, ref) {
    const { material, ...other } = props;
    return _jsx(MUICircularProgress, { ...other, ...material, ref: ref });
});
const BaseDivider = forwardRef(function BaseDivider(props, ref) {
    const { material, ...other } = props;
    return _jsx(MUIDivider, { ...other, ...material, ref: ref });
});
const BaseLinearProgress = forwardRef(function BaseLinearProgress(props, ref) {
    const { material, ...other } = props;
    return _jsx(MUILinearProgress, { ...other, ...material, ref: ref });
});
const BaseButton = forwardRef(function BaseButton(props, ref) {
    const { material, ...other } = props;
    return _jsx(MUIButton, { ...other, ...material, ref: ref });
});
const StyledToggleButton = styled(MUIToggleButton, {
    slot: 'internal',
})(({ theme }) => ({
    gap: theme.spacing(1),
    border: 0,
}));
const BaseToggleButton = forwardRef(function BaseToggleButton(props, ref) {
    const { material, ...rest } = props;
    return _jsx(StyledToggleButton, { size: "small", color: "primary", ...rest, ...material, ref: ref });
});
const BaseChip = forwardRef(function BaseChip(props, ref) {
    const { material, ...other } = props;
    return _jsx(MUIChip, { ...other, ...material, ref: ref });
});
const BaseIconButton = forwardRef(function BaseIconButton(props, ref) {
    const { material, ...other } = props;
    return _jsx(MUIIconButton, { ...other, ...material, ref: ref });
});
const BaseTooltip = forwardRef(function BaseTooltip(props, ref) {
    const { material, ...other } = props;
    return _jsx(MUITooltip, { ...other, ...material, ref: ref });
});
const BaseSkeleton = forwardRef(function BaseSkeleton(props, ref) {
    const { material, ...other } = props;
    return _jsx(MUISkeleton, { ...other, ...material, ref: ref });
});
const BaseSwitch = forwardRef(function BaseSwitch(props, ref) {
    const { material, label, className, ...other } = props;
    if (!label) {
        return _jsx(MUISwitch, { ...other, ...material, className: className, ref: ref });
    }
    return (_jsx(FormControlLabel, { className: className, control: _jsx(MUISwitch, { ...other, ...material, ref: ref }), label: label }));
});
const BaseMenuList = forwardRef(function BaseMenuList(props, ref) {
    const { material, ...other } = props;
    return _jsx(MUIMenuList, { ...other, ...material, ref: ref });
});
function BaseMenuItem(props) {
    const { inert, iconStart, iconEnd, children, material, ...other } = props;
    if (inert) {
        other.disableRipple = true;
    }
    return React.createElement(MUIMenuItem, { ...other, ...material }, [
        iconStart && _jsx(MUIListItemIcon, { children: iconStart }, "1"),
        _jsx(ListItemText, { children: children }, "2"),
        iconEnd && _jsx(MUIListItemIcon, { children: iconEnd }, "3"),
    ]);
}
function BaseTextField(props) {
    const { slotProps, material, ...other } = props;
    const theme = useTheme();
    const textFieldDefaults = (theme.components?.MuiTextField?.defaultProps ?? {});
    const computedVariant = other.variant ?? textFieldDefaults.variant ?? 'outlined';
    const computedSize = other.size ?? textFieldDefaults.size;
    return (_jsx(MUITextField, { variant: computedVariant, size: computedSize, ...other, ...material, slotProps: {
            htmlInput: slotProps?.htmlInput,
            input: transformInputProps(slotProps?.input),
            inputLabel: { shrink: true, ...slotProps?.inputLabel },
        } }));
}
function BaseAutocomplete(props) {
    const rootProps = useGridRootProps();
    const { id, multiple, freeSolo, options, getOptionLabel, isOptionEqualToValue, value, onChange, label, placeholder, slotProps, material, ...other } = props;
    return (_jsx(MUIAutocomplete, { id: id, multiple: multiple, freeSolo: freeSolo, options: options, getOptionLabel: getOptionLabel, isOptionEqualToValue: isOptionEqualToValue, value: value, onChange: onChange, renderValue: (currentValue, getTagProps) => currentValue.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (_jsx(MUIChip, { variant: "outlined", size: "small", label: typeof option === 'string' ? option : getOptionLabel?.(option), ...tagProps }, key));
        }), renderInput: (params) => {
            const { inputProps: htmlInputProps, InputProps, InputLabelProps, ...inputRest } = params;
            const { slotProps: textFieldSlotProps, ...textFieldRest } = slotProps?.textField ?? {};
            const { slotProps: baseTextFieldSlotProps, ...baseTextFieldRest } = rootProps.slotProps?.baseTextField ?? {};
            return (_jsx(MUITextField, { ...inputRest, label: label, placeholder: placeholder, ...textFieldRest, ...baseTextFieldRest, slotProps: {
                    htmlInput: {
                        ...htmlInputProps,
                        ...textFieldSlotProps?.htmlInput,
                        ...baseTextFieldSlotProps?.htmlInput,
                    },
                    input: {
                        ...transformInputProps(InputProps, false),
                        ...textFieldSlotProps?.input,
                        ...baseTextFieldSlotProps?.input,
                    },
                    inputLabel: {
                        shrink: true,
                        ...InputLabelProps,
                        ...textFieldSlotProps?.inputLabel,
                        ...baseTextFieldSlotProps?.inputLabel,
                    },
                } }));
        }, ...other, ...material }));
}
function BaseInput(props) {
    return _jsx(MUIInputBase, { ...transformInputProps(props) });
}
function transformInputProps(props, wrapAdornments = true) {
    if (!props) {
        return undefined;
    }
    const { slotProps, material, ...other } = props;
    const result = other;
    if (wrapAdornments) {
        if (result.startAdornment) {
            result.startAdornment = (_jsx(InputAdornment, { position: "start", children: result.startAdornment }));
        }
        if (result.endAdornment) {
            result.endAdornment = _jsx(InputAdornment, { position: "end", children: result.endAdornment });
        }
    }
    for (const k in material) {
        if (Object.hasOwn(material, k)) {
            result[k] = material[k];
        }
    }
    if (slotProps?.htmlInput) {
        if (result.inputProps) {
            result.inputProps = { ...result.inputProps, ...slotProps?.htmlInput };
        }
        else {
            result.inputProps = slotProps?.htmlInput;
        }
    }
    return result;
}
const BaseTextarea = forwardRef(function BaseTextarea(props, ref) {
    const { material, ...other } = props;
    return _jsx(MUITextareaAutosize, { ...other, ...material, ref: ref });
});
const transformOrigin = {
    'bottom-start': 'top left',
    'bottom-end': 'top right',
};
function BasePopper(props) {
    const { ref, open, children, className, clickAwayTouchEvent, clickAwayMouseEvent, flip, focusTrap, onExited, onClickAway, onDidShow, onDidHide, id, target, transition, placement, material, ...other } = props;
    const modifiers = React.useMemo(() => {
        const result = [
            {
                name: 'preventOverflow',
                options: {
                    padding: 8,
                },
            },
        ];
        if (flip) {
            result.push({
                name: 'flip',
                enabled: true,
            });
        }
        if (onDidShow || onDidHide) {
            result.push({
                name: 'isPlaced',
                enabled: true,
                phase: 'main',
                fn: () => {
                    onDidShow?.();
                },
                effect: () => () => {
                    onDidHide?.();
                },
            });
        }
        return result;
    }, [flip, onDidShow, onDidHide]);
    let content;
    if (!transition) {
        content = wrappers(props, children);
    }
    else {
        const handleExited = (popperOnExited) => (node) => {
            if (popperOnExited) {
                popperOnExited();
            }
            if (onExited) {
                onExited(node);
            }
        };
        content = (p) => wrappers(props, _jsx(MUIGrow, { ...p.TransitionProps, style: { transformOrigin: transformOrigin[p.placement] }, onExited: handleExited(p.TransitionProps?.onExited), children: _jsx(MUIPaper, { children: children }) }));
    }
    return (_jsx(MUIPopper, { id: id, className: className, open: open, anchorEl: target, transition: transition, placement: placement, modifiers: modifiers, ...other, ...material, children: content }));
}
function wrappers(props, content) {
    return focusTrapWrapper(props, clickAwayWrapper(props, content));
}
function clickAwayWrapper(props, content) {
    if (props.onClickAway === undefined) {
        return content;
    }
    return (_jsx(ClickAwayListener, { onClickAway: props.onClickAway, touchEvent: props.clickAwayTouchEvent, mouseEvent: props.clickAwayMouseEvent, children: content }));
}
function focusTrapWrapper(props, content) {
    if (props.focusTrap === undefined) {
        return content;
    }
    return (_jsx(MUIFocusTrap, { open: true, disableEnforceFocus: true, disableAutoFocus: true, children: _jsx("div", { tabIndex: -1, children: content }) }));
}
function BaseSelectOption({ native, ...props }) {
    if (native) {
        return _jsx("option", { ...props });
    }
    return _jsx(MUIMenuItem, { ...props });
}
const StyledTabs = styled(MUITabs, {
    name: 'MuiDataGrid',
    slot: 'Tabs',
})(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
}));
const StyledTab = styled(MUITab, {
    name: 'MuiDataGrid',
    slot: 'Tab',
})({
    flex: 1,
    minWidth: 'fit-content',
});
const StyledTabPanel = styled('div', {
    name: 'MuiDataGrid',
    slot: 'TabPanel',
})({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});
function TabPanel(props) {
    const { children, value, active, ...other } = props;
    return (_jsx(StyledTabPanel, { role: "tabpanel", style: { display: active ? 'flex' : 'none' }, ...other, children: children }));
}
function BaseTabs({ items, value, material, ...props }) {
    const id = useId();
    const labelId = `${id}-tab-${value}`;
    const panelId = `${id}-tabpanel-${value}`;
    return (_jsxs(React.Fragment, { children: [_jsx(StyledTabs, { ...props, value: value, variant: "scrollable", scrollButtons: "auto", ...material, children: items.map((item) => (_jsx(StyledTab, { value: item.value, label: item.label, id: labelId, "aria-controls": panelId }, item.value))) }), items.map((item) => (_jsx(TabPanel, { value: item.value, active: value === item.value, id: panelId, "aria-labelledby": labelId, children: item.children }, item.value)))] }));
}
const iconSlots = {
    booleanCellTrueIcon: GridCheckIcon,
    booleanCellFalseIcon: GridCloseIcon,
    columnMenuIcon: GridTripleDotsVerticalIcon,
    openFilterButtonIcon: GridFilterListIcon,
    filterPanelDeleteIcon: GridCloseIcon,
    undoIcon: GridUndoIcon,
    redoIcon: GridRedoIcon,
    columnFilteredIcon: GridFilterAltIcon,
    columnSelectorIcon: GridColumnIcon,
    columnUnsortedIcon: GridColumnUnsortedIcon,
    columnSortedAscendingIcon: GridArrowUpwardIcon,
    columnSortedDescendingIcon: GridArrowDownwardIcon,
    columnResizeIcon: GridSeparatorIcon,
    densityCompactIcon: GridViewHeadlineIcon,
    densityStandardIcon: GridTableRowsIcon,
    densityComfortableIcon: GridViewStreamIcon,
    exportIcon: GridDownloadIcon,
    moreActionsIcon: GridMoreVertIcon,
    treeDataCollapseIcon: GridExpandMoreIcon,
    treeDataExpandIcon: GridKeyboardArrowRight,
    groupingCriteriaCollapseIcon: GridExpandMoreIcon,
    groupingCriteriaExpandIcon: GridKeyboardArrowRight,
    detailPanelExpandIcon: GridAddIcon,
    detailPanelCollapseIcon: GridRemoveIcon,
    rowReorderIcon: GridDragIcon,
    quickFilterIcon: GridSearchIcon,
    quickFilterClearIcon: GridClearIcon,
    columnMenuHideIcon: GridVisibilityOffIcon,
    columnMenuSortAscendingIcon: GridArrowUpwardIcon,
    columnMenuSortDescendingIcon: GridArrowDownwardIcon,
    columnMenuUnsortIcon: null,
    columnMenuFilterIcon: GridFilterAltIcon,
    columnMenuManageColumnsIcon: GridViewColumnIcon,
    columnMenuClearIcon: GridClearIcon,
    loadIcon: GridLoadIcon,
    filterPanelAddIcon: GridAddIcon,
    filterPanelRemoveAllIcon: GridDeleteForeverIcon,
    columnReorderIcon: GridDragIcon,
    menuItemCheckIcon: GridCheckIcon,
    longTextCellExpandIcon: GridLongTextCellExpandIcon,
    longTextCellCollapseIcon: GridLongTextCellCollapseIcon,
};
const baseSlots = {
    baseAutocomplete: BaseAutocomplete,
    baseBadge: BaseBadge,
    baseCheckbox: BaseCheckbox,
    baseChip: BaseChip,
    baseCircularProgress: BaseCircularProgress,
    baseDivider: BaseDivider,
    baseInput: BaseInput,
    baseTextarea: BaseTextarea,
    baseLinearProgress: BaseLinearProgress,
    baseMenuList: BaseMenuList,
    baseMenuItem: BaseMenuItem,
    baseTextField: BaseTextField,
    baseButton: BaseButton,
    baseIconButton: BaseIconButton,
    baseToggleButton: BaseToggleButton,
    baseTooltip: BaseTooltip,
    baseTabs: BaseTabs,
    basePagination: BasePagination,
    basePopper: BasePopper,
    baseSelect: BaseSelect,
    baseSelectOption: BaseSelectOption,
    baseSkeleton: BaseSkeleton,
    baseSwitch: BaseSwitch,
};
const materialSlots = {
    ...baseSlots,
    ...iconSlots,
};
export default materialSlots;
