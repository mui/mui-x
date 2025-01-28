import * as React from 'react';
import MUIBadge from '@mui/material/Badge';
import MUICheckbox from '@mui/material/Checkbox';
import MUICircularProgress from '@mui/material/CircularProgress';
import MUIDivider from '@mui/material/Divider';
import MUIFocusTrap from '@mui/material/Unstable_TrapFocus';
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
import MUIClickAwayListener from '@mui/material/ClickAwayListener';
import MUIGrow from '@mui/material/Grow';
import MUIPaper from '@mui/material/Paper';
import MUIInputLabel from '@mui/material/InputLabel';
import MUIChip from '@mui/material/Chip';
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
import type { PopperProps } from '../models/gridBaseSlots';

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
  baseBadge: MUIBadge,
  baseCheckbox: MUICheckbox,
  baseCircularProgress: MUICircularProgress,
  baseDivider: MUIDivider,
  baseLinearProgress: MUILinearProgress,
  baseMenuList: MUIMenuList,
  baseMenuItem: BaseMenuItem,
  baseTextField: MUITextField,
  baseFormControl: MUIFormControl,
  baseSelect: MUISelect,
  baseButton: MUIButton,
  baseIconButton: MUIIconButton,
  baseInputAdornment: MUIInputAdornment,
  baseTooltip: MUITooltip,
  basePopper: BasePopper,
  baseInputLabel: MUIInputLabel,
  baseSelectOption: MUISelectOption,
  baseSkeleton: MUISkeleton,
  baseChip: MUIChip,
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

const transformOrigin = {
  'bottom-start': 'top left',
  'bottom-end': 'top right',
};

function BasePopper(props: GridSlotProps['basePopper']) {
  const { flip, onDidMount, onDidUnmount } = props;
  const modifiers = React.useMemo(() => {
    const result = [];
    if (flip) {
      result.push({
        name: 'flip',
        enabled: true,
        options: {
          rootBoundary: 'document',
        },
      });
    }
    if (onDidMount || onDidUnmount) {
      result.push({
        name: 'isPlaced',
        enabled: true,
        phase: 'main' as const,
        fn: () => {
          onDidMount?.();
        },
        effect: () => () => {
          onDidUnmount?.(false);
        },
      });
    }
    return result;
  }, [flip, onDidMount, onDidUnmount]);

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
  return clickAwayWrapper(props, focusTrapWrapper(props, content));
}

function clickAwayWrapper(props: PopperProps, content: any) {
  if (props.onClickAway === undefined) {
    return content;
  }
  return (
    <MUIClickAwayListener
      onClickAway={props.onClickAway as any}
      touchEvent={props.clickAwayTouchEvent}
      mouseEvent={props.clickAwayMouseEvent}
    >
      {content}
    </MUIClickAwayListener>
  );
}

function focusTrapWrapper(props: PopperProps, content: any) {
  if (props.focusTrap === undefined) {
    return content;
  }
  return (
    <MUIFocusTrap open disableEnforceFocus isEnabled={() => props.focusTrapEnabled ?? false}>
      {content}
    </MUIFocusTrap>
  );
}
