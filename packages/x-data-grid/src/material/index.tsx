import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import { styled } from '@mui/material/styles';
import MUIAutocomplete from '@mui/material/Autocomplete';
import MUIBadge from '@mui/material/Badge';
import MUICheckbox from '@mui/material/Checkbox';
import MUIChip from '@mui/material/Chip';
import MUICircularProgress from '@mui/material/CircularProgress';
import MUIDivider from '@mui/material/Divider';
import MUIInputBase, { InputBaseProps as MUIInputBaseProps } from '@mui/material/InputBase';
import MUIFocusTrap from '@mui/material/Unstable_TrapFocus';
import MUILinearProgress from '@mui/material/LinearProgress';
import MUIListItemIcon from '@mui/material/ListItemIcon';
import MUIListItemText from '@mui/material/ListItemText';
import { MenuProps as MUIMenuProps } from '@mui/material/Menu';
import MUIMenuList from '@mui/material/MenuList';
import MUIMenuItem from '@mui/material/MenuItem';
import MUITextField from '@mui/material/TextField';
import MUIFormControl from '@mui/material/FormControl';
import MUIFormControlLabel, { formControlLabelClasses } from '@mui/material/FormControlLabel';
import MUISelect from '@mui/material/Select';
import MUISwitch from '@mui/material/Switch';
import MUIButton from '@mui/material/Button';
import MUIIconButton, { iconButtonClasses } from '@mui/material/IconButton';
import MUIInputAdornment, { inputAdornmentClasses } from '@mui/material/InputAdornment';
import MUITooltip from '@mui/material/Tooltip';
import MUIPagination, { tablePaginationClasses } from '@mui/material/TablePagination';
import MUIPopper, { PopperProps as MUIPopperProps } from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MUIGrow from '@mui/material/Grow';
import MUIPaper from '@mui/material/Paper';
import MUIInputLabel from '@mui/material/InputLabel';
import MUISkeleton from '@mui/material/Skeleton';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { GridColumnUnsortedIcon } from './icons/GridColumnUnsortedIcon';
import {
  GridAddIcon,
  GridArrowDownwardIcon,
  GridArrowUpwardIcon,
  GridCheckIcon,
  GridCloseIcon,
  GridColumnIcon,
  GridDragIcon,
  GridExpandMoreIcon,
  GridFilterAltIcon,
  GridFilterListIcon,
  GridKeyboardArrowRight,
  GridMoreVertIcon,
  GridRemoveIcon,
  GridSearchIcon,
  GridSeparatorIcon,
  GridTableRowsIcon,
  GridTripleDotsVerticalIcon,
  GridViewHeadlineIcon,
  GridViewStreamIcon,
  GridVisibilityOffIcon,
  GridViewColumnIcon,
  GridClearIcon,
  GridLoadIcon,
  GridDeleteForeverIcon,
  GridDownloadIcon,
} from './icons';
import type { GridIconSlotsComponent } from '../models';
import type { GridBaseSlots } from '../models/gridSlotsComponent';
import type { GridSlotProps as P } from '../models/gridSlotsComponentsProps';
import type { PopperProps } from '../models/gridBaseSlots';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

export { useMaterialCSSVariables } from './variables';

const InputAdornment = styled(MUIInputAdornment)({
  [`&.${inputAdornmentClasses.positionEnd} .${iconButtonClasses.sizeSmall}`]: {
    marginRight: '-7px',
  },
});

const FormControlLabel = styled(MUIFormControlLabel, {
  shouldForwardProp: (prop) => prop !== 'fullWidth',
})<{ fullWidth?: boolean }>(({ theme }) => ({
  gap: theme.spacing(0.5),
  margin: 0,
  [`& .${formControlLabelClasses.label}`]: {
    fontSize: theme.typography.pxToRem(14),
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
  shouldForwardProp: (prop) => prop !== 'density',
})<{ density?: P['baseCheckbox']['density'] }>(({ theme }) => ({
  variants: [
    {
      props: { density: 'compact' },
      style: {
        padding: theme.spacing(0.5),
      },
    },
  ],
}));

const BaseSelect = forwardRef<any, P['baseSelect']>(function BaseSelect(props, ref) {
  const {
    id,
    label,
    labelId,
    material,
    disabled,
    slotProps,
    onChange,
    onKeyDown,
    onOpen,
    onClose,
    size,
    style,
    fullWidth,
    ...rest
  } = props;
  const menuProps = {
    PaperProps: {
      onKeyDown,
    },
  } as Partial<MUIMenuProps>;
  if (onClose) {
    menuProps.onClose = onClose;
  }
  return (
    <MUIFormControl size={size} fullWidth={fullWidth} style={style} disabled={disabled} ref={ref}>
      <MUIInputLabel id={labelId} htmlFor={id} shrink variant="outlined">
        {label}
      </MUIInputLabel>
      <MUISelect
        id={id}
        labelId={labelId}
        label={label}
        displayEmpty
        onChange={onChange as any}
        {...rest}
        variant="outlined"
        // @ts-ignore Issue with material
        notched
        inputProps={slotProps?.htmlInput}
        onOpen={onOpen}
        MenuProps={menuProps}
        size={size}
        {...material}
      />
    </MUIFormControl>
  );
});

const StyledPagination = styled(MUIPagination)(({ theme }) => ({
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
})) as typeof MUIPagination;

const BasePagination = forwardRef<any, P['basePagination']>(
  function BasePagination(props, ref) {
    const { onRowsPerPageChange, material, disabled, ...rest } = props;
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

    return (
      <StyledPagination
        component="div"
        onRowsPerPageChange={useEventCallback(
          (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            onRowsPerPageChange?.(Number(event.target.value));
          },
        )}
        labelRowsPerPage={apiRef.current.getLocaleText('paginationRowsPerPage')}
        labelDisplayedRows={(params) =>
          apiRef.current.getLocaleText('paginationDisplayedRows')({
            ...params,
            estimated: estimatedRowCount,
          })
        }
        // @ts-ignore Issue with material
        getItemAriaLabel={apiRef.current.getLocaleText('paginationItemAriaLabel')}
        {...computedProps}
        {...rest}
        {...material}
        ref={ref}
      />
    );
  },
);

/* eslint-disable material-ui/disallow-react-api-in-server-components */

const iconSlots: GridIconSlotsComponent = {
  booleanCellTrueIcon: GridCheckIcon,
  booleanCellFalseIcon: GridCloseIcon,
  columnMenuIcon: GridTripleDotsVerticalIcon,
  openFilterButtonIcon: GridFilterListIcon,
  filterPanelDeleteIcon: GridCloseIcon,
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
};

const baseSlots: GridBaseSlots = {
  baseAutocomplete: BaseAutocomplete,
  baseBadge: BaseBadge,
  baseCheckbox: React.forwardRef(BaseCheckbox),
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

const materialSlots: GridBaseSlots & GridIconSlotsComponent = {
  ...baseSlots,
  ...iconSlots,
};

export default materialSlots;

function BaseBadge(props: P['baseBadge']) {
  const { material, ...rest } = props;
  return <MUIBadge {...rest} {...material} />;
}

function BaseCheckbox(props: P['baseCheckbox'], ref: React.Ref<HTMLButtonElement>) {
  const { autoFocus, label, fullWidth, slotProps, className, material, ...other } = props;

  const elementRef = React.useRef<HTMLButtonElement>(null);
  const handleRef = useForkRef(elementRef, ref);
  const rippleRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (autoFocus) {
      const input = elementRef.current?.querySelector('input');
      input?.focus({ preventScroll: true });
    } else if (autoFocus === false && rippleRef.current) {
      // Only available in @mui/material v5.4.1 or later
      // @ts-ignore
      rippleRef.current.stop({});
    }
  }, [autoFocus]);

  if (!label) {
    return (
      <Checkbox
        {...other}
        {...material}
        className={className}
        inputProps={slotProps?.htmlInput}
        ref={handleRef}
        touchRippleRef={rippleRef}
      />
    );
  }

  return (
    <FormControlLabel
      className={className}
      control={
        <Checkbox
          {...other}
          {...material}
          inputProps={slotProps?.htmlInput}
          ref={handleRef}
          touchRippleRef={rippleRef}
        />
      }
      label={label}
      fullWidth={fullWidth}
    />
  );
}

function BaseCircularProgress(props: P['baseCircularProgress']) {
  const { material, ...rest } = props;
  return <MUICircularProgress {...rest} {...material} />;
}

function BaseDivider(props: P['baseDivider']) {
  const { material, ...rest } = props;
  return <MUIDivider {...rest} {...material} />;
}

function BaseLinearProgress(props: P['baseLinearProgress']) {
  const { material, ...rest } = props;
  return <MUILinearProgress {...rest} {...material} />;
}

function BaseButton(props: P['baseButton']) {
  const { material, ...rest } = props;
  return <MUIButton {...rest} {...material} />;
}

function BaseIconButton(props: P['baseIconButton']) {
  const { material, ...rest } = props;
  return <MUIIconButton {...rest} {...material} />;
}

function BaseTooltip(props: P['baseTooltip']) {
  const { material, ...rest } = props;
  return <MUITooltip {...rest} {...material} />;
}

function BaseSkeleton(props: P['baseSkeleton']) {
  const { material, ...rest } = props;
  return <MUISkeleton {...rest} {...material} />;
}

function BaseSwitch(props: P['baseSwitch']) {
  const { material, ...rest } = props;
  return <MUISwitch {...rest} {...material} />;
}

function BaseMenuList(props: P['baseMenuList']) {
  const { material, ...rest } = props;
  return <MUIMenuList {...rest} {...material} />;
}

function BaseMenuItem(props: P['baseMenuItem']) {
  const { inert, iconStart, iconEnd, children, ...other } = props;
  if (inert) {
    (other as any).disableRipple = true;
  }
  return React.createElement(MUIMenuItem, other, [
    iconStart && <MUIListItemIcon key="1">{iconStart}</MUIListItemIcon>,
    <MUIListItemText key="2">{children}</MUIListItemText>,
    iconEnd && <MUIListItemIcon key="3">{iconEnd}</MUIListItemIcon>,
  ]);
}

function BaseTextField(props: P['baseTextField']) {
  // MaterialUI v5 doesn't support slotProps, until we drop v5 support we need to
  // translate the pattern.
  const { slotProps, ...rest } = props;
  return (
    <MUITextField
      variant="outlined"
      {...rest}
      inputProps={slotProps?.htmlInput}
      InputProps={transformInputProps(slotProps?.input as any)}
      InputLabelProps={{
        shrink: true,
        ...(slotProps as any)?.inputLabel,
      }}
    />
  );
}

function BaseAutocomplete(props: P['baseAutocomplete']) {
  const rootProps = useGridRootProps();
  const {
    id,
    multiple,
    freeSolo,
    options,
    getOptionLabel,
    isOptionEqualToValue,
    value,
    onChange,
    label,
    placeholder,
    slotProps,
    ...rest
  } = props;

  return (
    <MUIAutocomplete<string, true, false, true>
      id={id}
      multiple={multiple}
      freeSolo={freeSolo}
      options={options}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      value={value}
      onChange={onChange}
      renderTags={(currentValue, getTagProps) =>
        currentValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <MUIChip
              key={key}
              variant="outlined"
              size="small"
              label={typeof option === 'string' ? option : getOptionLabel?.(option as any)}
              {...tagProps}
            />
          );
        })
      }
      renderInput={(params) => {
        const { inputProps, InputProps, InputLabelProps, ...inputRest } = params;
        return (
          <rootProps.slots.baseTextField
            {...inputRest}
            label={label}
            placeholder={placeholder}
            slotProps={{
              input: InputProps,
              inputLabel: InputLabelProps,
              htmlInput: inputProps,
            }}
            {...slotProps?.textField}
            {...rootProps.slotProps?.baseTextField}
          />
        );
      }}
      {...rest}
    />
  );
}

function BaseInput(props: P['baseInput']) {
  return <MUIInputBase {...transformInputProps(props)} />;
}

function transformInputProps(props: P['baseInput'] | undefined) {
  if (!props) {
    return undefined;
  }

  const { slotProps, ...rest } = props;
  const result = rest as Partial<MUIInputBaseProps>;

  if (result.startAdornment) {
    result.startAdornment = (
      <InputAdornment position="start">{result.startAdornment}</InputAdornment>
    );
  }

  if (result.endAdornment) {
    result.endAdornment = <InputAdornment position="end">{result.endAdornment}</InputAdornment>;
  }

  if (slotProps?.htmlInput) {
    if (result.inputProps) {
      result.inputProps = { ...result.inputProps, ...slotProps?.htmlInput };
    } else {
      result.inputProps = slotProps?.htmlInput;
    }
  }

  return result;
}

const transformOrigin = {
  'bottom-start': 'top left',
  'bottom-end': 'top right',
};

function BasePopper(props: P['basePopper']) {
  const { flip, onDidShow, onDidHide } = props;
  const modifiers = React.useMemo(() => {
    const result = [] as NonNullable<MUIPopperProps['modifiers']>;
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
        phase: 'main' as const,
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

  let content: any;
  if (!props.transition) {
    content = wrappers(props, props.children);
  } else {
    const handleExited = (popperOnExited: (() => void) | undefined) => (node: HTMLElement) => {
      if (popperOnExited) {
        popperOnExited();
      }

      if (props.onExited) {
        props.onExited(node);
      }
    };

    content = ({ TransitionProps, placement }: any) =>
      wrappers(
        props,
        <MUIGrow
          {...TransitionProps}
          style={{ transformOrigin: transformOrigin[placement as keyof typeof transformOrigin] }}
          onExited={handleExited(TransitionProps?.onExited)}
        >
          <MUIPaper>{props.children}</MUIPaper>
        </MUIGrow>,
      );
  }

  return (
    <MUIPopper
      id={props.id}
      className={props.className}
      open={props.open}
      anchorEl={props.target as any}
      transition={props.transition}
      placement={props.placement}
      modifiers={modifiers}
    >
      {content}
    </MUIPopper>
  );
}

function wrappers(props: PopperProps, content: any) {
  return focusTrapWrapper(props, clickAwayWrapper(props, content));
}

function clickAwayWrapper(props: PopperProps, content: any) {
  if (props.onClickAway === undefined) {
    return content;
  }
  return (
    <ClickAwayListener
      onClickAway={props.onClickAway as any}
      touchEvent={props.clickAwayTouchEvent}
      mouseEvent={props.clickAwayMouseEvent}
    >
      {content}
    </ClickAwayListener>
  );
}

function focusTrapWrapper(props: PopperProps, content: any) {
  if (props.focusTrap === undefined) {
    return content;
  }
  return (
    <MUIFocusTrap open disableEnforceFocus disableAutoFocus>
      <div tabIndex={-1}>{content}</div>
    </MUIFocusTrap>
  );
}

function BaseSelectOption({ native, ...props }: NonNullable<P['baseSelectOption']>) {
  if (native) {
    return <option {...props} />;
  }
  return <MUIMenuItem {...props} />;
}
