import * as React from 'react';
import MUIAutocomplete from '@mui/material/Autocomplete';
import MUIBadge from '@mui/material/Badge';
import MUICheckbox from '@mui/material/Checkbox';
import MUIChip from '@mui/material/Chip';
import MUICircularProgress from '@mui/material/CircularProgress';
import MUIDivider from '@mui/material/Divider';
import MUILinearProgress from '@mui/material/LinearProgress';
import MUIListItemIcon from '@mui/material/ListItemIcon';
import MUIListItemText from '@mui/material/ListItemText';
import MUIMenuList from '@mui/material/MenuList';
import MUIMenuItem from '@mui/material/MenuItem';
import MUITextField from '@mui/material/TextField';
import MUIFormControl from '@mui/material/FormControl';
import MUISelect from '@mui/material/Select';
import MUIButton from '@mui/material/Button';
import MUIIconButton from '@mui/material/IconButton';
import MUIInputAdornment from '@mui/material/InputAdornment';
import MUITooltip from '@mui/material/Tooltip';
import MUIPopper from '@mui/material/Popper';
import MUIInputLabel from '@mui/material/InputLabel';
import MUISkeleton from '@mui/material/Skeleton';
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
  GridSaveAltIcon,
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
} from './icons';
import type { GridIconSlotsComponent } from '../models';
import type { GridBaseSlots } from '../models/gridSlotsComponent';
import type { GridSlotProps } from '../models/gridSlotsComponentsProps';
import MUISelectOption from './components/MUISelectOption';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

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
  exportIcon: GridSaveAltIcon,
  moreActionsIcon: GridMoreVertIcon,
  treeDataCollapseIcon: GridExpandMoreIcon,
  treeDataExpandIcon: GridKeyboardArrowRight,
  groupingCriteriaCollapseIcon: GridExpandMoreIcon,
  groupingCriteriaExpandIcon: GridKeyboardArrowRight,
  detailPanelExpandIcon: GridAddIcon,
  detailPanelCollapseIcon: GridRemoveIcon,
  rowReorderIcon: GridDragIcon,
  quickFilterIcon: GridSearchIcon,
  quickFilterClearIcon: GridCloseIcon,
  columnMenuHideIcon: GridVisibilityOffIcon,
  columnMenuSortAscendingIcon: GridArrowUpwardIcon,
  columnMenuSortDescendingIcon: GridArrowDownwardIcon,
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
  baseBadge: MUIBadge,
  baseCheckbox: MUICheckbox,
  baseCircularProgress: MUICircularProgress,
  baseDivider: MUIDivider,
  baseLinearProgress: MUILinearProgress,
  baseMenuList: MUIMenuList,
  baseMenuItem: BaseMenuItem,
  baseTextField: BaseTextField,
  baseFormControl: MUIFormControl,
  baseSelect: MUISelect,
  baseButton: MUIButton,
  baseIconButton: MUIIconButton,
  baseInputAdornment: MUIInputAdornment,
  baseTooltip: MUITooltip,
  basePopper: MUIPopper,
  baseInputLabel: MUIInputLabel,
  baseSelectOption: MUISelectOption,
  baseSkeleton: MUISkeleton,
};

const materialSlots: GridBaseSlots & GridIconSlotsComponent = {
  ...baseSlots,
  ...iconSlots,
};

export default materialSlots;

function BaseMenuItem(props: GridSlotProps['baseMenuItem']) {
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

function BaseTextField(props: GridSlotProps['baseTextField']) {
  // MaterialUI v5 doesn't support slotProps, until we drop v5 support we need to
  // translate the pattern.
  const { slotProps, ...rest } = props;
  return (
    <MUITextField
      variant="outlined"
      {...rest}
      inputProps={slotProps?.htmlInput}
      InputProps={slotProps?.input}
      InputLabelProps={{
        shrink: true,
        ...(slotProps as any)?.inputLabel,
      }}
    />
  );
}

function BaseAutocomplete(props: GridSlotProps['baseAutocomplete']) {
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
