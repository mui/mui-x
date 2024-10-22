import * as React from 'react';
import MUIBadge from '@mui/material/Badge';
import MUICheckbox from '@mui/material/Checkbox';
import MUIClickAwayListener from '@mui/material/ClickAwayListener';
import MUIDivider from '@mui/material/Divider';
import MUITextField from '@mui/material/TextField';
import MUIFormControl from '@mui/material/FormControl';
import MUISelect from '@mui/material/Select';
import MUIButton from '@mui/material/Button';
import MUIIconButton from '@mui/material/IconButton';
import MUIInputAdornment from '@mui/material/InputAdornment';
import MUITooltip from '@mui/material/Tooltip';
import MUIPaper from '@mui/material/Paper';
import MUIPopper from '@mui/material/Popper';
import MUIInputLabel from '@mui/material/InputLabel';
import MUIChip from '@mui/material/Chip';
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
import type { GridBaseSlots, GridSlotProps } from '../models/gridSlotsComponent';
import MUISelectOption from './components/MUISelectOption';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

const PopperV8 = React.forwardRef<HTMLDivElement, GridSlotProps['basePopperV8']>((props, ref) => {
  const rootProps = useGridRootProps();
  const { children, onClose, ...other } = props;

  // anchorEl FIXME
  // const ownerState = rootProps; FIXME: pass to style overrides

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  return (
    <MUIPopper
      ref={ref}
      placement="bottom-start"
      anchorEl={null}
      modifiers={undefined /* modifiers FIXME */}
      {...other}
    >
      <MUIClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
        <MUIPaper
          elevation={8}
          onKeyDown={handleKeyDown}
        >
          {children}
        </MUIPaper>
      </MUIClickAwayListener>
    </MUIPopper>
  );
});


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
};

const materialSlots: GridBaseSlots & GridIconSlotsComponent = {
  ...iconSlots,
  baseBadge: MUIBadge,
  baseCheckbox: MUICheckbox,
  baseDivider: MUIDivider,
  baseTextField: MUITextField,
  baseFormControl: MUIFormControl,
  baseSelect: MUISelect,
  baseButton: MUIButton,
  baseIconButton: MUIIconButton,
  baseInputAdornment: MUIInputAdornment,
  baseTooltip: MUITooltip,
  basePopper: MUIPopper,
  basePopperV8: PopperV8,
  baseInputLabel: MUIInputLabel,
  baseSelectOption: MUISelectOption,
  baseChip: MUIChip,
};

export default materialSlots;
