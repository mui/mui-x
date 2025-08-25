"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMaterialCSSVariables = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var useForkRef_1 = require("@mui/utils/useForkRef");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var styles_1 = require("@mui/material/styles");
var Autocomplete_1 = require("@mui/material/Autocomplete");
var Badge_1 = require("@mui/material/Badge");
var Checkbox_1 = require("@mui/material/Checkbox");
var Chip_1 = require("@mui/material/Chip");
var CircularProgress_1 = require("@mui/material/CircularProgress");
var Divider_1 = require("@mui/material/Divider");
var InputBase_1 = require("@mui/material/InputBase");
var Unstable_TrapFocus_1 = require("@mui/material/Unstable_TrapFocus");
var LinearProgress_1 = require("@mui/material/LinearProgress");
var ListItemIcon_1 = require("@mui/material/ListItemIcon");
var ListItemText_1 = require("@mui/material/ListItemText");
var MenuList_1 = require("@mui/material/MenuList");
var MenuItem_1 = require("@mui/material/MenuItem");
var TextField_1 = require("@mui/material/TextField");
var FormControl_1 = require("@mui/material/FormControl");
var FormControlLabel_1 = require("@mui/material/FormControlLabel");
var Select_1 = require("@mui/material/Select");
var Switch_1 = require("@mui/material/Switch");
var Button_1 = require("@mui/material/Button");
var IconButton_1 = require("@mui/material/IconButton");
var InputAdornment_1 = require("@mui/material/InputAdornment");
var Tooltip_1 = require("@mui/material/Tooltip");
var TablePagination_1 = require("@mui/material/TablePagination");
var Popper_1 = require("@mui/material/Popper");
var ClickAwayListener_1 = require("@mui/material/ClickAwayListener");
var Grow_1 = require("@mui/material/Grow");
var Paper_1 = require("@mui/material/Paper");
var InputLabel_1 = require("@mui/material/InputLabel");
var Skeleton_1 = require("@mui/material/Skeleton");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var icons_1 = require("./icons");
var GridColumnUnsortedIcon_1 = require("../components/GridColumnUnsortedIcon");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
require("./augmentation");
var variables_1 = require("./variables");
Object.defineProperty(exports, "useMaterialCSSVariables", { enumerable: true, get: function () { return variables_1.useMaterialCSSVariables; } });
/* eslint-disable material-ui/disallow-react-api-in-server-components */
var InputAdornment = (0, styles_1.styled)(InputAdornment_1.default)(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["&.".concat(InputAdornment_1.inputAdornmentClasses.positionEnd, " .").concat(IconButton_1.iconButtonClasses.sizeSmall)] = {
            marginRight: theme.spacing(-0.75),
        },
        _b);
});
var FormControlLabel = (0, styles_1.styled)(FormControlLabel_1.default, {
    shouldForwardProp: function (prop) { return prop !== 'fullWidth'; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            gap: theme.spacing(0.5),
            margin: 0,
            overflow: 'hidden'
        },
        _b["& .".concat(FormControlLabel_1.formControlLabelClasses.label)] = {
            fontSize: theme.typography.pxToRem(14),
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        _b.variants = [
            {
                props: { fullWidth: true },
                style: {
                    width: '100%',
                },
            },
        ],
        _b);
});
var Checkbox = (0, styles_1.styled)(Checkbox_1.default, {
    shouldForwardProp: function (prop) { return prop !== 'density'; },
})(function (_a) {
    var theme = _a.theme;
    return ({
        variants: [
            {
                props: { density: 'compact' },
                style: {
                    padding: theme.spacing(0.5),
                },
            },
        ],
    });
});
var ListItemText = (0, styles_1.styled)(ListItemText_1.default)((_a = {},
    _a["& .".concat(ListItemText_1.listItemTextClasses.primary)] = {
        overflowX: 'clip',
        textOverflow: 'ellipsis',
        maxWidth: '300px',
    },
    _a));
var BaseSelect = (0, forwardRef_1.forwardRef)(function BaseSelect(props, ref) {
    var id = props.id, label = props.label, labelId = props.labelId, material = props.material, disabled = props.disabled, slotProps = props.slotProps, onChange = props.onChange, onKeyDown = props.onKeyDown, onOpen = props.onOpen, onClose = props.onClose, size = props.size, style = props.style, fullWidth = props.fullWidth, rest = __rest(props, ["id", "label", "labelId", "material", "disabled", "slotProps", "onChange", "onKeyDown", "onOpen", "onClose", "size", "style", "fullWidth"]);
    var menuProps = {
        PaperProps: {
            onKeyDown: onKeyDown,
        },
    };
    if (onClose) {
        menuProps.onClose = onClose;
    }
    return (<FormControl_1.default size={size} fullWidth={fullWidth} style={style} disabled={disabled} ref={ref}>
      <InputLabel_1.default id={labelId} htmlFor={id} shrink variant="outlined">
        {label}
      </InputLabel_1.default>
      <Select_1.default id={id} labelId={labelId} label={label} displayEmpty onChange={onChange} variant="outlined" {...rest} notched inputProps={slotProps === null || slotProps === void 0 ? void 0 : slotProps.htmlInput} onOpen={onOpen} MenuProps={menuProps} size={size} {...material}/>
    </FormControl_1.default>);
});
var StyledPagination = (0, styles_1.styled)(TablePagination_1.default)(function (_a) {
    var _b, _c, _d;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(TablePagination_1.tablePaginationClasses.selectLabel)] = (_c = {
                display: 'none'
            },
            _c[theme.breakpoints.up('sm')] = {
                display: 'block',
            },
            _c),
        _b["& .".concat(TablePagination_1.tablePaginationClasses.input)] = (_d = {
                display: 'none'
            },
            _d[theme.breakpoints.up('sm')] = {
                display: 'inline-flex',
            },
            _d),
        _b);
});
var BasePagination = (0, forwardRef_1.forwardRef)(function BasePagination(props, ref) {
    var onRowsPerPageChange = props.onRowsPerPageChange, material = props.material, disabled = props.disabled, rest = __rest(props, ["onRowsPerPageChange", "material", "disabled"]);
    var computedProps = React.useMemo(function () {
        if (!disabled) {
            return undefined;
        }
        return {
            backIconButtonProps: { disabled: true },
            nextIconButtonProps: { disabled: true },
        };
    }, [disabled]);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var estimatedRowCount = rootProps.estimatedRowCount;
    return (<StyledPagination component="div" onRowsPerPageChange={(0, useEventCallback_1.default)(function (event) {
            onRowsPerPageChange === null || onRowsPerPageChange === void 0 ? void 0 : onRowsPerPageChange(Number(event.target.value));
        })} labelRowsPerPage={apiRef.current.getLocaleText('paginationRowsPerPage')} labelDisplayedRows={function (params) {
            return apiRef.current.getLocaleText('paginationDisplayedRows')(__assign(__assign({}, params), { estimated: estimatedRowCount }));
        }} getItemAriaLabel={apiRef.current.getLocaleText('paginationItemAriaLabel')} {...computedProps} {...rest} {...material} ref={ref}/>);
});
var BaseBadge = (0, forwardRef_1.forwardRef)(function BaseBadge(props, ref) {
    var material = props.material, rest = __rest(props, ["material"]);
    return <Badge_1.default {...rest} {...material} ref={ref}/>;
});
var BaseCheckbox = (0, forwardRef_1.forwardRef)(function BaseCheckbox(props, ref) {
    var autoFocus = props.autoFocus, label = props.label, fullWidth = props.fullWidth, slotProps = props.slotProps, className = props.className, material = props.material, other = __rest(props, ["autoFocus", "label", "fullWidth", "slotProps", "className", "material"]);
    var elementRef = React.useRef(null);
    var handleRef = (0, useForkRef_1.default)(elementRef, ref);
    var rippleRef = React.useRef(null);
    React.useEffect(function () {
        var _a;
        if (autoFocus) {
            var input = (_a = elementRef.current) === null || _a === void 0 ? void 0 : _a.querySelector('input');
            input === null || input === void 0 ? void 0 : input.focus({ preventScroll: true });
        }
        else if (autoFocus === false && rippleRef.current) {
            // Only available in @mui/material v5.4.1 or later
            // @ts-ignore
            rippleRef.current.stop({});
        }
    }, [autoFocus]);
    if (!label) {
        return (<Checkbox {...other} {...material} className={(0, clsx_1.default)(className, material === null || material === void 0 ? void 0 : material.className)} inputProps={slotProps === null || slotProps === void 0 ? void 0 : slotProps.htmlInput} ref={handleRef} touchRippleRef={rippleRef}/>);
    }
    return (<FormControlLabel className={className} control={<Checkbox {...other} {...material} inputProps={slotProps === null || slotProps === void 0 ? void 0 : slotProps.htmlInput} ref={handleRef} touchRippleRef={rippleRef}/>} label={label} fullWidth={fullWidth}/>);
});
var BaseCircularProgress = (0, forwardRef_1.forwardRef)(function BaseCircularProgress(props, ref) {
    var material = props.material, rest = __rest(props, ["material"]);
    return <CircularProgress_1.default {...rest} {...material} ref={ref}/>;
});
var BaseDivider = (0, forwardRef_1.forwardRef)(function BaseDivider(props, ref) {
    var material = props.material, rest = __rest(props, ["material"]);
    return <Divider_1.default {...rest} {...material} ref={ref}/>;
});
var BaseLinearProgress = (0, forwardRef_1.forwardRef)(function BaseLinearProgress(props, ref) {
    var material = props.material, rest = __rest(props, ["material"]);
    return <LinearProgress_1.default {...rest} {...material} ref={ref}/>;
});
var BaseButton = (0, forwardRef_1.forwardRef)(function BaseButton(props, ref) {
    var material = props.material, rest = __rest(props, ["material"]);
    return <Button_1.default {...rest} {...material} ref={ref}/>;
});
var BaseChip = (0, forwardRef_1.forwardRef)(function BaseChip(props, ref) {
    var material = props.material, rest = __rest(props, ["material"]);
    return <Chip_1.default {...rest} {...material} ref={ref}/>;
});
var BaseIconButton = (0, forwardRef_1.forwardRef)(function BaseIconButton(props, ref) {
    var material = props.material, rest = __rest(props, ["material"]);
    return <IconButton_1.default {...rest} {...material} ref={ref}/>;
});
var BaseTooltip = (0, forwardRef_1.forwardRef)(function BaseTooltip(props, ref) {
    var material = props.material, rest = __rest(props, ["material"]);
    return <Tooltip_1.default {...rest} {...material} ref={ref}/>;
});
var BaseSkeleton = (0, forwardRef_1.forwardRef)(function BaseSkeleton(props, ref) {
    var material = props.material, rest = __rest(props, ["material"]);
    return <Skeleton_1.default {...rest} {...material} ref={ref}/>;
});
var BaseSwitch = (0, forwardRef_1.forwardRef)(function BaseSwitch(props, ref) {
    var material = props.material, label = props.label, className = props.className, rest = __rest(props, ["material", "label", "className"]);
    if (!label) {
        return <Switch_1.default {...rest} {...material} className={className} ref={ref}/>;
    }
    return (<FormControlLabel className={className} control={<Switch_1.default {...rest} {...material} ref={ref}/>} label={label}/>);
});
var BaseMenuList = (0, forwardRef_1.forwardRef)(function BaseMenuList(props, ref) {
    var material = props.material, rest = __rest(props, ["material"]);
    return <MenuList_1.default {...rest} {...material} ref={ref}/>;
});
function BaseMenuItem(props) {
    var inert = props.inert, iconStart = props.iconStart, iconEnd = props.iconEnd, children = props.children, material = props.material, other = __rest(props, ["inert", "iconStart", "iconEnd", "children", "material"]);
    if (inert) {
        other.disableRipple = true;
    }
    return React.createElement(MenuItem_1.default, __assign(__assign({}, other), material), [
        iconStart && <ListItemIcon_1.default key="1">{iconStart}</ListItemIcon_1.default>,
        <ListItemText key="2">{children}</ListItemText>,
        iconEnd && <ListItemIcon_1.default key="3">{iconEnd}</ListItemIcon_1.default>,
    ]);
}
function BaseTextField(props) {
    // MaterialUI v5 doesn't support slotProps, until we drop v5 support we need to
    // translate the pattern.
    var slotProps = props.slotProps, material = props.material, rest = __rest(props, ["slotProps", "material"]);
    return (<TextField_1.default variant="outlined" {...rest} {...material} inputProps={slotProps === null || slotProps === void 0 ? void 0 : slotProps.htmlInput} InputProps={transformInputProps(slotProps === null || slotProps === void 0 ? void 0 : slotProps.input)} InputLabelProps={__assign({ shrink: true }, slotProps === null || slotProps === void 0 ? void 0 : slotProps.inputLabel)}/>);
}
function BaseAutocomplete(props) {
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var id = props.id, multiple = props.multiple, freeSolo = props.freeSolo, options = props.options, getOptionLabel = props.getOptionLabel, isOptionEqualToValue = props.isOptionEqualToValue, value = props.value, onChange = props.onChange, label = props.label, placeholder = props.placeholder, slotProps = props.slotProps, material = props.material, rest = __rest(props, ["id", "multiple", "freeSolo", "options", "getOptionLabel", "isOptionEqualToValue", "value", "onChange", "label", "placeholder", "slotProps", "material"]);
    return (<Autocomplete_1.default id={id} multiple={multiple} freeSolo={freeSolo} options={options} getOptionLabel={getOptionLabel} isOptionEqualToValue={isOptionEqualToValue} value={value} onChange={onChange} renderTags={function (currentValue, getTagProps) {
            return currentValue.map(function (option, index) {
                var _a = getTagProps({ index: index }), key = _a.key, tagProps = __rest(_a, ["key"]);
                return (<Chip_1.default key={key} variant="outlined" size="small" label={typeof option === 'string' ? option : getOptionLabel === null || getOptionLabel === void 0 ? void 0 : getOptionLabel(option)} {...tagProps}/>);
            });
        }} renderInput={function (params) {
            var _a;
            var inputProps = params.inputProps, InputProps = params.InputProps, InputLabelProps = params.InputLabelProps, inputRest = __rest(params, ["inputProps", "InputProps", "InputLabelProps"]);
            return (<TextField_1.default {...inputRest} label={label} placeholder={placeholder} inputProps={inputProps} InputProps={transformInputProps(InputProps, false)} InputLabelProps={__assign({ shrink: true }, InputLabelProps)} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.textField} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseTextField}/>);
        }} {...rest} {...material}/>);
}
function BaseInput(props) {
    return <InputBase_1.default {...transformInputProps(props)}/>;
}
function transformInputProps(props, wrapAdornments) {
    if (wrapAdornments === void 0) { wrapAdornments = true; }
    if (!props) {
        return undefined;
    }
    var slotProps = props.slotProps, material = props.material, rest = __rest(props, ["slotProps", "material"]);
    var result = rest;
    if (wrapAdornments) {
        if (result.startAdornment) {
            result.startAdornment = (<InputAdornment position="start">{result.startAdornment}</InputAdornment>);
        }
        if (result.endAdornment) {
            result.endAdornment = <InputAdornment position="end">{result.endAdornment}</InputAdornment>;
        }
    }
    for (var k in material) {
        if (Object.hasOwn(material, k)) {
            result[k] = material[k];
        }
    }
    if (slotProps === null || slotProps === void 0 ? void 0 : slotProps.htmlInput) {
        if (result.inputProps) {
            result.inputProps = __assign(__assign({}, result.inputProps), slotProps === null || slotProps === void 0 ? void 0 : slotProps.htmlInput);
        }
        else {
            result.inputProps = slotProps === null || slotProps === void 0 ? void 0 : slotProps.htmlInput;
        }
    }
    return result;
}
var transformOrigin = {
    'bottom-start': 'top left',
    'bottom-end': 'top right',
};
function BasePopper(props) {
    var ref = props.ref, open = props.open, children = props.children, className = props.className, clickAwayTouchEvent = props.clickAwayTouchEvent, clickAwayMouseEvent = props.clickAwayMouseEvent, flip = props.flip, focusTrap = props.focusTrap, onExited = props.onExited, onClickAway = props.onClickAway, onDidShow = props.onDidShow, onDidHide = props.onDidHide, id = props.id, target = props.target, transition = props.transition, placement = props.placement, material = props.material, rest = __rest(props, ["ref", "open", "children", "className", "clickAwayTouchEvent", "clickAwayMouseEvent", "flip", "focusTrap", "onExited", "onClickAway", "onDidShow", "onDidHide", "id", "target", "transition", "placement", "material"]);
    var modifiers = React.useMemo(function () {
        var result = [
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
                options: {
                    rootBoundary: 'document',
                },
            });
        }
        if (onDidShow || onDidHide) {
            result.push({
                name: 'isPlaced',
                enabled: true,
                phase: 'main',
                fn: function () {
                    onDidShow === null || onDidShow === void 0 ? void 0 : onDidShow();
                },
                effect: function () { return function () {
                    onDidHide === null || onDidHide === void 0 ? void 0 : onDidHide();
                }; },
            });
        }
        return result;
    }, [flip, onDidShow, onDidHide]);
    var content;
    if (!transition) {
        content = wrappers(props, children);
    }
    else {
        var handleExited_1 = function (popperOnExited) { return function (node) {
            if (popperOnExited) {
                popperOnExited();
            }
            if (onExited) {
                onExited(node);
            }
        }; };
        content = function (p) {
            var _a;
            return wrappers(props, <Grow_1.default {...p.TransitionProps} style={{ transformOrigin: transformOrigin[p.placement] }} onExited={handleExited_1((_a = p.TransitionProps) === null || _a === void 0 ? void 0 : _a.onExited)}>
          <Paper_1.default>{children}</Paper_1.default>
        </Grow_1.default>);
        };
    }
    return (<Popper_1.default id={id} className={className} open={open} anchorEl={target} transition={transition} placement={placement} modifiers={modifiers} {...rest} {...material}>
      {content}
    </Popper_1.default>);
}
function wrappers(props, content) {
    return focusTrapWrapper(props, clickAwayWrapper(props, content));
}
function clickAwayWrapper(props, content) {
    if (props.onClickAway === undefined) {
        return content;
    }
    return (<ClickAwayListener_1.default onClickAway={props.onClickAway} touchEvent={props.clickAwayTouchEvent} mouseEvent={props.clickAwayMouseEvent}>
      {content}
    </ClickAwayListener_1.default>);
}
function focusTrapWrapper(props, content) {
    if (props.focusTrap === undefined) {
        return content;
    }
    return (<Unstable_TrapFocus_1.default open disableEnforceFocus disableAutoFocus>
      <div tabIndex={-1}>{content}</div>
    </Unstable_TrapFocus_1.default>);
}
function BaseSelectOption(_a) {
    var native = _a.native, props = __rest(_a, ["native"]);
    if (native) {
        return <option {...props}/>;
    }
    return <MenuItem_1.default {...props}/>;
}
var iconSlots = {
    booleanCellTrueIcon: icons_1.GridCheckIcon,
    booleanCellFalseIcon: icons_1.GridCloseIcon,
    columnMenuIcon: icons_1.GridTripleDotsVerticalIcon,
    openFilterButtonIcon: icons_1.GridFilterListIcon,
    filterPanelDeleteIcon: icons_1.GridCloseIcon,
    columnFilteredIcon: icons_1.GridFilterAltIcon,
    columnSelectorIcon: icons_1.GridColumnIcon,
    columnUnsortedIcon: GridColumnUnsortedIcon_1.GridColumnUnsortedIcon,
    columnSortedAscendingIcon: icons_1.GridArrowUpwardIcon,
    columnSortedDescendingIcon: icons_1.GridArrowDownwardIcon,
    columnResizeIcon: icons_1.GridSeparatorIcon,
    densityCompactIcon: icons_1.GridViewHeadlineIcon,
    densityStandardIcon: icons_1.GridTableRowsIcon,
    densityComfortableIcon: icons_1.GridViewStreamIcon,
    exportIcon: icons_1.GridDownloadIcon,
    moreActionsIcon: icons_1.GridMoreVertIcon,
    treeDataCollapseIcon: icons_1.GridExpandMoreIcon,
    treeDataExpandIcon: icons_1.GridKeyboardArrowRight,
    groupingCriteriaCollapseIcon: icons_1.GridExpandMoreIcon,
    groupingCriteriaExpandIcon: icons_1.GridKeyboardArrowRight,
    detailPanelExpandIcon: icons_1.GridAddIcon,
    detailPanelCollapseIcon: icons_1.GridRemoveIcon,
    rowReorderIcon: icons_1.GridDragIcon,
    quickFilterIcon: icons_1.GridSearchIcon,
    quickFilterClearIcon: icons_1.GridClearIcon,
    columnMenuHideIcon: icons_1.GridVisibilityOffIcon,
    columnMenuSortAscendingIcon: icons_1.GridArrowUpwardIcon,
    columnMenuSortDescendingIcon: icons_1.GridArrowDownwardIcon,
    columnMenuUnsortIcon: null,
    columnMenuFilterIcon: icons_1.GridFilterAltIcon,
    columnMenuManageColumnsIcon: icons_1.GridViewColumnIcon,
    columnMenuClearIcon: icons_1.GridClearIcon,
    loadIcon: icons_1.GridLoadIcon,
    filterPanelAddIcon: icons_1.GridAddIcon,
    filterPanelRemoveAllIcon: icons_1.GridDeleteForeverIcon,
    columnReorderIcon: icons_1.GridDragIcon,
    menuItemCheckIcon: icons_1.GridCheckIcon,
};
var baseSlots = {
    baseAutocomplete: BaseAutocomplete,
    baseBadge: BaseBadge,
    baseCheckbox: BaseCheckbox,
    baseChip: BaseChip,
    baseCircularProgress: BaseCircularProgress,
    baseDivider: BaseDivider,
    baseInput: BaseInput,
    baseLinearProgress: BaseLinearProgress,
    baseMenuList: BaseMenuList,
    baseMenuItem: BaseMenuItem,
    baseTextField: BaseTextField,
    baseButton: BaseButton,
    baseIconButton: BaseIconButton,
    baseTooltip: BaseTooltip,
    basePagination: BasePagination,
    basePopper: BasePopper,
    baseSelect: BaseSelect,
    baseSelectOption: BaseSelectOption,
    baseSkeleton: BaseSkeleton,
    baseSwitch: BaseSwitch,
};
var materialSlots = __assign(__assign({}, baseSlots), iconSlots);
exports.default = materialSlots;
