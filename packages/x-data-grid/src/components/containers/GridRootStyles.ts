import { CSSInterpolation } from '@mui/system';
import {
  alpha,
  styled,
  darken,
  lighten,
  decomposeColor,
  recomposeColor,
  Theme,
} from '@mui/material/styles';
import type {} from '../../themeAugmentation/overrides';
import { gridClasses as c } from '../../constants/gridClasses';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { GridStateCommunity } from '../../models/gridStateCommunity';

export type OwnerState = DataGridProcessedProps;

function getBorderColor(theme: Theme) {
  if (theme.vars) {
    return theme.vars.palette.TableCell.border;
  }
  if (theme.palette.mode === 'light') {
    return lighten(alpha(theme.palette.divider, 1), 0.88);
  }
  return darken(alpha(theme.palette.divider, 1), 0.68);
}

const columnHeaderStyles = {
  [`& .${c.iconButtonContainer}`]: {
    visibility: 'visible',
    width: 'auto',
  },
  [`& .${c.menuIcon}`]: {
    width: 'auto',
    visibility: 'visible',
  },
};

const columnSeparatorTargetSize = 10;
const columnSeparatorOffset = -5;

const focusOutlineWidth = 1;

const separatorIconDragStyles = {
  width: 3,
  rx: 1.5,
  x: 10.5,
};

// Emotion thinks it knows better than us which selector we should use.
// https://github.com/emotion-js/emotion/issues/1105#issuecomment-1722524968
const ignoreSsrWarning =
  '/* emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason */';

const shouldShowBorderTopRightRadiusSelector = (state: GridStateCommunity) =>
  state.dimensions.hasScrollX &&
  (!state.dimensions.hasScrollY || state.dimensions.scrollbarSize === 0);

export const GridRootStyles = styled('div', {
  name: 'MuiDataGrid',
  slot: 'Root',
  overridesResolver: (props, styles) => [
    // Root overrides
    styles.root,
    { [`&.${c.autoHeight}`]: styles.autoHeight },
    { [`&.${c.autosizing}`]: styles.autosizing },
    { [`&.${c['root--densityStandard']}`]: styles['root--densityStandard'] },
    { [`&.${c['root--densityComfortable']}`]: styles['root--densityComfortable'] },
    { [`&.${c['root--densityCompact']}`]: styles['root--densityCompact'] },
    { [`&.${c['root--disableUserSelection']}`]: styles['root--disableUserSelection'] },
    { [`&.${c['root--noToolbar']}`]: styles['root--noToolbar'] },
    { [`&.${c.withVerticalBorder}`]: styles.withVerticalBorder },

    // Child element overrides
    // - Only declare overrides here for class names that are not applied to `styled` components.
    // - For `styled` components, declare overrides in the component itself.
    { [`& .${c.actionsCell}`]: styles.actionsCell },
    { [`& .${c.booleanCell}`]: styles.booleanCell },
    { [`& .${c.cell}`]: styles.cell },
    { [`& .${c['cell--editable']}`]: styles['cell--editable'] },
    { [`& .${c['cell--editing']}`]: styles['cell--editing'] },
    { [`& .${c['cell--flex']}`]: styles['cell--flex'] },
    { [`& .${c['cell--pinnedLeft']}`]: styles['cell--pinnedLeft'] },
    { [`& .${c['cell--pinnedRight']}`]: styles['cell--pinnedRight'] },
    { [`& .${c['cell--rangeBottom']}`]: styles['cell--rangeBottom'] },
    { [`& .${c['cell--rangeLeft']}`]: styles['cell--rangeLeft'] },
    { [`& .${c['cell--rangeRight']}`]: styles['cell--rangeRight'] },
    { [`& .${c['cell--rangeTop']}`]: styles['cell--rangeTop'] },
    { [`& .${c['cell--selectionMode']}`]: styles['cell--selectionMode'] },
    { [`& .${c['cell--textCenter']}`]: styles['cell--textCenter'] },
    { [`& .${c['cell--textLeft']}`]: styles['cell--textLeft'] },
    { [`& .${c['cell--textRight']}`]: styles['cell--textRight'] },
    { [`& .${c['cell--withLeftBorder']}`]: styles['cell--withLeftBorder'] },
    { [`& .${c['cell--withRightBorder']}`]: styles['cell--withRightBorder'] },
    { [`& .${c.cellCheckbox}`]: styles.cellCheckbox },
    { [`& .${c.cellEmpty}`]: styles.cellEmpty },
    { [`& .${c.cellOffsetLeft}`]: styles.cellOffsetLeft },
    { [`& .${c.cellSkeleton}`]: styles.cellSkeleton },
    { [`& .${c.checkboxInput}`]: styles.checkboxInput },
    { [`& .${c.columnHeader}`]: styles.columnHeader },
    { [`& .${c['columnHeader--alignCenter']}`]: styles['columnHeader--alignCenter'] },
    { [`& .${c['columnHeader--alignLeft']}`]: styles['columnHeader--alignLeft'] },
    { [`& .${c['columnHeader--alignRight']}`]: styles['columnHeader--alignRight'] },
    { [`& .${c['columnHeader--dragging']}`]: styles['columnHeader--dragging'] },
    { [`& .${c['columnHeader--emptyGroup']}`]: styles['columnHeader--emptyGroup'] },
    { [`& .${c['columnHeader--filledGroup']}`]: styles['columnHeader--filledGroup'] },
    { [`& .${c['columnHeader--filtered']}`]: styles['columnHeader--filtered'] },
    { [`& .${c['columnHeader--last']}`]: styles['columnHeader--last'] },
    { [`& .${c['columnHeader--lastUnpinned']}`]: styles['columnHeader--lastUnpinned'] },
    { [`& .${c['columnHeader--moving']}`]: styles['columnHeader--moving'] },
    { [`& .${c['columnHeader--numeric']}`]: styles['columnHeader--numeric'] },
    { [`& .${c['columnHeader--pinnedLeft']}`]: styles['columnHeader--pinnedLeft'] },
    { [`& .${c['columnHeader--pinnedRight']}`]: styles['columnHeader--pinnedRight'] },
    { [`& .${c['columnHeader--siblingFocused']}`]: styles['columnHeader--siblingFocused'] },
    { [`& .${c['columnHeader--sortable']}`]: styles['columnHeader--sortable'] },
    { [`& .${c['columnHeader--sorted']}`]: styles['columnHeader--sorted'] },
    { [`& .${c['columnHeader--withLeftBorder']}`]: styles['columnHeader--withLeftBorder'] },
    { [`& .${c['columnHeader--withRightBorder']}`]: styles['columnHeader--withRightBorder'] },
    { [`& .${c.columnHeaderCheckbox}`]: styles.columnHeaderCheckbox },
    { [`& .${c.columnHeaderDraggableContainer}`]: styles.columnHeaderDraggableContainer },
    { [`& .${c.columnHeaderTitleContainer}`]: styles.columnHeaderTitleContainer },
    { [`& .${c.columnHeaderTitleContainerContent}`]: styles.columnHeaderTitleContainerContent },
    { [`& .${c.columnSeparator}`]: styles.columnSeparator },
    { [`& .${c['columnSeparator--resizable']}`]: styles['columnSeparator--resizable'] },
    { [`& .${c['columnSeparator--resizing']}`]: styles['columnSeparator--resizing'] },
    { [`& .${c['columnSeparator--sideLeft']}`]: styles['columnSeparator--sideLeft'] },
    { [`& .${c['columnSeparator--sideRight']}`]: styles['columnSeparator--sideRight'] },
    { [`& .${c['container--bottom']}`]: styles['container--bottom'] },
    { [`& .${c['container--top']}`]: styles['container--top'] },
    { [`& .${c.detailPanelToggleCell}`]: styles.detailPanelToggleCell },
    { [`& .${c['detailPanelToggleCell--expanded']}`]: styles['detailPanelToggleCell--expanded'] },
    { [`& .${c.editBooleanCell}`]: styles.editBooleanCell },
    { [`& .${c.filterIcon}`]: styles.filterIcon },
    { [`& .${c['filler--borderBottom']}`]: styles['filler--borderBottom'] },
    { [`& .${c['filler--pinnedLeft']}`]: styles['filler--pinnedLeft'] },
    { [`& .${c['filler--pinnedRight']}`]: styles['filler--pinnedRight'] },
    { [`& .${c.groupingCriteriaCell}`]: styles.groupingCriteriaCell },
    {
      [`& .${c.groupingCriteriaCellLoadingContainer}`]: styles.groupingCriteriaCellLoadingContainer,
    },
    { [`& .${c.groupingCriteriaCellToggle}`]: styles.groupingCriteriaCellToggle },
    { [`& .${c.headerFilterRow}`]: styles.headerFilterRow },
    { [`& .${c.iconSeparator}`]: styles.iconSeparator },
    { [`& .${c.menuIcon}`]: styles.menuIcon },
    { [`& .${c.menuIconButton}`]: styles.menuIconButton },
    { [`& .${c.menuList}`]: styles.menuList },
    { [`& .${c.menuOpen}`]: styles.menuOpen },
    { [`& .${c.overlayWrapperInner}`]: styles.overlayWrapperInner },
    { [`& .${c.pinnedRows}`]: styles.pinnedRows },
    { [`& .${c['pinnedRows--bottom']}`]: styles['pinnedRows--bottom'] },
    { [`& .${c['pinnedRows--top']}`]: styles['pinnedRows--top'] },
    { [`& .${c.row}`]: styles.row },
    { [`& .${c['row--borderBottom']}`]: styles['row--borderBottom'] },
    { [`& .${c['row--detailPanelExpanded']}`]: styles['row--detailPanelExpanded'] },
    { [`& .${c['row--dragging']}`]: styles['row--dragging'] },
    { [`& .${c['row--dynamicHeight']}`]: styles['row--dynamicHeight'] },
    { [`& .${c['row--editable']}`]: styles['row--editable'] },
    { [`& .${c['row--editing']}`]: styles['row--editing'] },
    { [`& .${c['row--firstVisible']}`]: styles['row--firstVisible'] },
    { [`& .${c['row--lastVisible']}`]: styles['row--lastVisible'] },
    { [`& .${c.rowReorderCell}`]: styles.rowReorderCell },
    { [`& .${c['rowReorderCell--draggable']}`]: styles['rowReorderCell--draggable'] },
    { [`& .${c.rowReorderCellContainer}`]: styles.rowReorderCellContainer },
    { [`& .${c.rowReorderCellPlaceholder}`]: styles.rowReorderCellPlaceholder },
    { [`& .${c.rowSkeleton}`]: styles.rowSkeleton },
    { [`& .${c.scrollbar}`]: styles.scrollbar },
    { [`& .${c['scrollbar--horizontal']}`]: styles['scrollbar--horizontal'] },
    { [`& .${c['scrollbar--vertical']}`]: styles['scrollbar--vertical'] },
    { [`& .${c.scrollbarFiller}`]: styles.scrollbarFiller },
    { [`& .${c['scrollbarFiller--borderBottom']}`]: styles['scrollbarFiller--borderBottom'] },
    { [`& .${c['scrollbarFiller--borderTop']}`]: styles['scrollbarFiller--borderTop'] },
    { [`& .${c['scrollbarFiller--header']}`]: styles['scrollbarFiller--header'] },
    { [`& .${c['scrollbarFiller--pinnedRight']}`]: styles['scrollbarFiller--pinnedRight'] },
    { [`& .${c.sortIcon}`]: styles.sortIcon },
    { [`& .${c.treeDataGroupingCell}`]: styles.treeDataGroupingCell },
    {
      [`& .${c.treeDataGroupingCellLoadingContainer}`]: styles.treeDataGroupingCellLoadingContainer,
    },
    { [`& .${c.treeDataGroupingCellToggle}`]: styles.treeDataGroupingCellToggle },
    { [`& .${c.withBorderColor}`]: styles.withBorderColor },
  ],
})<{ ownerState: OwnerState }>(({ theme: t }) => {
  const apiRef = useGridPrivateApiContext();
  const shouldShowBorderTopRightRadius = useGridSelector(
    apiRef,
    shouldShowBorderTopRightRadiusSelector,
  );

  const borderColor = getBorderColor(t);
  const radius = t.shape.borderRadius;

  const containerBackground = t.vars
    ? t.vars.palette.background.default
    : (t.mixins.MuiDataGrid?.containerBackground ?? t.palette.background.default);

  const pinnedBackground = t.mixins.MuiDataGrid?.pinnedBackground ?? containerBackground;

  const overlayBackground = t.vars
    ? `rgba(${t.vars.palette.background.defaultChannel} / ${t.vars.palette.action.disabledOpacity})`
    : alpha(t.palette.background.default, t.palette.action.disabledOpacity);

  const hoverOpacity = (t.vars || t).palette.action.hoverOpacity;
  const hoverColor = (t.vars || t).palette.action.hover;

  const selectedOpacity = (t.vars || t).palette.action.selectedOpacity;
  const selectedHoverOpacity = t.vars
    ? (`calc(${hoverOpacity} + ${selectedOpacity})` as unknown as number) // TODO: Improve type
    : hoverOpacity + selectedOpacity;
  const selectedBackground = t.vars
    ? `rgba(${t.vars.palette.primary.mainChannel} / ${selectedOpacity})`
    : alpha(t.palette.primary.main, selectedOpacity);

  const selectedHoverBackground = t.vars
    ? `rgba(${t.vars.palette.primary.mainChannel} / ${selectedHoverOpacity})`
    : alpha(t.palette.primary.main, selectedHoverOpacity);

  const blendFn = t.vars ? blendCssVars : blend;

  const getPinnedBackgroundStyles = (backgroundColor: string) => ({
    [`& .${c['cell--pinnedLeft']}, & .${c['cell--pinnedRight']}`]: {
      backgroundColor,
      '&.Mui-selected': {
        backgroundColor: blendFn(backgroundColor, selectedBackground, selectedOpacity),
        '&:hover': {
          backgroundColor: blendFn(backgroundColor, selectedBackground, selectedHoverOpacity),
        },
      },
    },
  });

  const pinnedBackgroundColor = blendFn(pinnedBackground, hoverColor, hoverOpacity);
  const pinnedHoverStyles = getPinnedBackgroundStyles(pinnedBackgroundColor);

  const pinnedSelectedBackgroundColor = blendFn(
    pinnedBackground,
    selectedBackground,
    selectedOpacity,
  );
  const pinnedSelectedStyles = getPinnedBackgroundStyles(pinnedSelectedBackgroundColor);

  const pinnedSelectedHoverBackgroundColor = blendFn(
    pinnedBackground,
    selectedHoverBackground,
    selectedHoverOpacity,
  );
  const pinnedSelectedHoverStyles = getPinnedBackgroundStyles(pinnedSelectedHoverBackgroundColor);

  const selectedStyles = {
    backgroundColor: selectedBackground,
    '&:hover': {
      backgroundColor: selectedHoverBackground,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: selectedBackground,
      },
    },
  };

  const gridStyle: CSSInterpolation = {
    '--unstable_DataGrid-radius': typeof radius === 'number' ? `${radius}px` : radius,
    '--unstable_DataGrid-headWeight': t.typography.fontWeightMedium,
    '--unstable_DataGrid-overlayBackground': overlayBackground,

    '--DataGrid-containerBackground': containerBackground,
    '--DataGrid-pinnedBackground': pinnedBackground,
    '--DataGrid-rowBorderColor': borderColor,

    '--DataGrid-cellOffsetMultiplier': 2,
    '--DataGrid-width': '0px',
    '--DataGrid-hasScrollX': '0',
    '--DataGrid-hasScrollY': '0',
    '--DataGrid-scrollbarSize': '10px',
    '--DataGrid-rowWidth': '0px',
    '--DataGrid-columnsTotalWidth': '0px',
    '--DataGrid-leftPinnedWidth': '0px',
    '--DataGrid-rightPinnedWidth': '0px',
    '--DataGrid-headerHeight': '0px',
    '--DataGrid-headersTotalHeight': '0px',
    '--DataGrid-topContainerHeight': '0px',
    '--DataGrid-bottomContainerHeight': '0px',

    flex: 1,
    boxSizing: 'border-box',
    position: 'relative',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor,
    borderRadius: 'var(--unstable_DataGrid-radius)',
    color: (t.vars || t).palette.text.primary,
    ...t.typography.body2,
    outline: 'none',
    height: '100%',
    display: 'flex',
    minWidth: 0, // See https://github.com/mui/mui-x/issues/8547
    minHeight: 0,
    flexDirection: 'column',
    overflow: 'hidden',
    overflowAnchor: 'none', // Keep the same scrolling position
    [`.${c.main} > *:first-child${ignoreSsrWarning}`]: {
      borderTopLeftRadius: 'var(--unstable_DataGrid-radius)',
      borderTopRightRadius: 'var(--unstable_DataGrid-radius)',
    },
    [`&.${c.autoHeight}`]: {
      height: 'auto',
    },
    [`&.${c.autosizing}`]: {
      [`& .${c.columnHeaderTitleContainerContent} > *`]: {
        overflow: 'visible !important',
      },
      '@media (hover: hover)': {
        [`& .${c.menuIcon}`]: {
          width: '0 !important',
          visibility: 'hidden !important',
        },
      },
      [`& .${c.cell}`]: {
        overflow: 'visible !important',
        whiteSpace: 'nowrap',
        minWidth: 'max-content !important',
        maxWidth: 'max-content !important',
      },
      [`& .${c.groupingCriteriaCell}`]: {
        width: 'unset',
      },
      [`& .${c.treeDataGroupingCell}`]: {
        width: 'unset',
      },
    },
    [`& .${c.columnHeader}, & .${c.cell}`]: {
      WebkitTapHighlightColor: 'transparent',
      padding: '0 10px',
      boxSizing: 'border-box',
    },
    [`& .${c.columnHeader}:focus-within, & .${c.cell}:focus-within`]: {
      outline: `solid ${
        t.vars
          ? `rgba(${t.vars.palette.primary.mainChannel} / 0.5)`
          : alpha(t.palette.primary.main, 0.5)
      } ${focusOutlineWidth}px`,
      outlineOffset: focusOutlineWidth * -1,
    },
    [`& .${c.columnHeader}:focus, & .${c.cell}:focus`]: {
      outline: `solid ${t.palette.primary.main} ${focusOutlineWidth}px`,
      outlineOffset: focusOutlineWidth * -1,
    },
    // Hide the column separator when:
    // - the column is focused and has an outline
    // - the next column is focused and has an outline
    // - the column has a left or right border
    // - the next column is pinned right and has a left border
    [`& .${c.columnHeader}:focus,
      & .${c['columnHeader--withLeftBorder']},
      & .${c['columnHeader--withRightBorder']},
      & .${c['columnHeader--siblingFocused']},
      & .${c['virtualScroller--hasScrollX']} .${c['columnHeader--lastUnpinned']},
      & .${c['virtualScroller--hasScrollX']} .${c['columnHeader--last']}
      `]: {
      [`& .${c.columnSeparator}`]: {
        opacity: 0,
      },
      // Show resizable separators at all times on touch devices
      '@media (hover: none)': {
        [`& .${c['columnSeparator--resizable']}`]: {
          opacity: 1,
        },
      },
      [`& .${c['columnSeparator--resizable']}:hover`]: {
        opacity: 1,
      },
    },
    [`&.${c['root--noToolbar']} [aria-rowindex="1"] [aria-colindex="1"]`]: {
      borderTopLeftRadius: 'calc(var(--unstable_DataGrid-radius) - 1px)',
    },
    [`&.${c['root--noToolbar']} [aria-rowindex="1"] .${c['columnHeader--last']}`]: {
      borderTopRightRadius: shouldShowBorderTopRightRadius
        ? 'calc(var(--unstable_DataGrid-radius) - 1px)'
        : undefined,
    },
    [`& .${c.columnHeaderCheckbox}, & .${c.cellCheckbox}`]: {
      padding: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    [`& .${c.columnHeader}`]: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    [`& .${c['virtualScroller--hasScrollX']} .${c['columnHeader--last']}`]: {
      overflow: 'hidden',
    },
    [`& .${c['columnHeader--sorted']} .${c.iconButtonContainer}, & .${c['columnHeader--filtered']} .${c.iconButtonContainer}`]:
      {
        visibility: 'visible',
        width: 'auto',
      },
    [`& .${c.columnHeader}:not(.${c['columnHeader--sorted']}) .${c.sortIcon}`]: {
      opacity: 0,
      transition: t.transitions.create(['opacity'], {
        duration: t.transitions.duration.shorter,
      }),
    },
    [`& .${c.columnHeaderTitleContainer}`]: {
      display: 'flex',
      alignItems: 'center',
      gap: t.spacing(0.25),
      minWidth: 0,
      flex: 1,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    [`& .${c.columnHeaderTitleContainerContent}`]: {
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    },
    [`& .${c['columnHeader--filledGroup']} .${c.columnHeaderTitleContainer}`]: {
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      boxSizing: 'border-box',
    },
    [`& .${c.sortIcon}, & .${c.filterIcon}`]: {
      fontSize: 'inherit',
    },
    [`& .${c['columnHeader--sortable']}`]: {
      cursor: 'pointer',
    },
    [`& .${c['columnHeader--alignCenter']} .${c.columnHeaderTitleContainer}`]: {
      justifyContent: 'center',
    },
    [`& .${c['columnHeader--alignRight']} .${c.columnHeaderDraggableContainer}, & .${c['columnHeader--alignRight']} .${c.columnHeaderTitleContainer}`]:
      {
        flexDirection: 'row-reverse',
      },
    [`& .${c['columnHeader--alignCenter']} .${c.menuIcon}`]: {
      marginLeft: 'auto',
    },
    [`& .${c['columnHeader--alignRight']} .${c.menuIcon}`]: {
      marginRight: 'auto',
      marginLeft: -5,
    },
    [`& .${c['columnHeader--moving']}`]: {
      backgroundColor: (t.vars || t).palette.action.hover,
    },
    [`& .${c['columnHeader--pinnedLeft']}, & .${c['columnHeader--pinnedRight']}`]: {
      position: 'sticky',
      zIndex: 40, // Should be above the column separator
      background: 'var(--DataGrid-pinnedBackground)',
    },
    [`& .${c.columnSeparator}`]: {
      position: 'absolute',
      overflow: 'hidden',
      zIndex: 30,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: columnSeparatorTargetSize,
      color: borderColor,
    },
    [`& .${c.columnHeaders}`]: {
      width: 'var(--DataGrid-rowWidth)',
    },
    '@media (hover: hover)': {
      [`& .${c.columnHeader}:hover`]: columnHeaderStyles,
      [`& .${c.columnHeader}:not(.${c['columnHeader--sorted']}):hover .${c.sortIcon}`]: {
        opacity: 0.5,
      },
    },
    '@media (hover: none)': {
      [`& .${c.columnHeader}`]: columnHeaderStyles,
      [`& .${c.columnHeader}:focus,
        & .${c['columnHeader--siblingFocused']}`]: {
        [`.${c['columnSeparator--resizable']}`]: {
          color: (t.vars || t).palette.primary.main,
        },
      },
    },
    [`& .${c['columnSeparator--sideLeft']}`]: {
      left: columnSeparatorOffset,
    },
    [`& .${c['columnSeparator--sideRight']}`]: {
      right: columnSeparatorOffset,
    },
    [`& .${c['columnHeader--withRightBorder']} .${c['columnSeparator--sideLeft']}`]: {
      left: columnSeparatorOffset - 0.5,
    },
    [`& .${c['columnHeader--withRightBorder']} .${c['columnSeparator--sideRight']}`]: {
      right: columnSeparatorOffset - 0.5,
    },
    [`& .${c['columnSeparator--resizable']}`]: {
      cursor: 'col-resize',
      touchAction: 'none',
      [`&.${c['columnSeparator--resizing']}`]: {
        color: (t.vars || t).palette.primary.main,
      },
      // Always appear as draggable on touch devices
      '@media (hover: none)': {
        [`& .${c.iconSeparator} rect`]: separatorIconDragStyles,
      },
      '@media (hover: hover)': {
        '&:hover': {
          color: (t.vars || t).palette.primary.main,
          [`& .${c.iconSeparator} rect`]: separatorIconDragStyles,
        },
      },
      '& svg': {
        pointerEvents: 'none',
      },
    },
    [`& .${c.iconSeparator}`]: {
      color: 'inherit',
      transition: t.transitions.create(['color', 'width'], {
        duration: t.transitions.duration.shortest,
      }),
    },
    [`& .${c.menuIcon}`]: {
      width: 0,
      visibility: 'hidden',
      fontSize: 20,
      marginRight: -5,
      display: 'flex',
      alignItems: 'center',
    },
    [`.${c.menuOpen}`]: {
      visibility: 'visible',
      width: 'auto',
    },

    [`& .${c.headerFilterRow}`]: {
      [`& .${c.columnHeader}`]: {
        boxSizing: 'border-box',
        borderBottom: '1px solid var(--DataGrid-rowBorderColor)',
      },
    },

    /* Bottom border of the top-container */
    [`& .${c['row--borderBottom']} .${c.columnHeader},
      & .${c['row--borderBottom']} .${c.filler},
      & .${c['row--borderBottom']} .${c.scrollbarFiller}`]: {
      borderBottom: `1px solid var(--DataGrid-rowBorderColor)`,
    },
    [`& .${c['row--borderBottom']} .${c.cell}`]: {
      borderBottom: `1px solid var(--rowBorderColor)`,
    },

    /* Row styles */
    [`.${c.row}`]: {
      display: 'flex',
      width: 'var(--DataGrid-rowWidth)',
      breakInside: 'avoid', // Avoid the row to be broken in two different print pages.

      '--rowBorderColor': 'var(--DataGrid-rowBorderColor)',

      [`&.${c['row--firstVisible']}`]: {
        '--rowBorderColor': 'transparent',
      },

      '&:hover': {
        backgroundColor: (t.vars || t).palette.action.hover,
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
      },
      [`&.${c.rowSkeleton}:hover`]: {
        backgroundColor: 'transparent',
      },
      '&.Mui-selected': selectedStyles,
    },
    [`& .${c['container--top']}, & .${c['container--bottom']}`]: {
      '[role=row]': {
        background: 'var(--DataGrid-containerBackground)',
      },
    },

    /* Cell styles */
    [`& .${c.cell}`]: {
      flex: '0 0 auto',
      height: 'var(--height)',
      width: 'var(--width)',
      lineHeight: 'calc(var(--height) - 1px)', // -1px for the border

      boxSizing: 'border-box',
      borderTop: `1px solid var(--rowBorderColor)`,

      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      '&.Mui-selected': selectedStyles,
    },
    [`& .${c['virtualScrollerContent--overflowed']} .${c['row--lastVisible']} .${c.cell}`]: {
      borderTopColor: 'transparent',
    },
    [`& .${c['pinnedRows--top']} :first-of-type`]: {
      [`& .${c.cell}, .${c.scrollbarFiller}`]: {
        borderTop: 'none',
      },
    },
    [`&.${c['root--disableUserSelection']} .${c.cell}`]: {
      userSelect: 'none',
    },
    [`& .${c['row--dynamicHeight']} > .${c.cell}`]: {
      whiteSpace: 'initial',
      lineHeight: 'inherit',
    },
    [`& .${c.cellEmpty}`]: {
      flex: 1,
      padding: 0,
      height: 'unset',
    },
    [`& .${c.cell}.${c['cell--selectionMode']}`]: {
      cursor: 'default',
    },
    [`& .${c.cell}.${c['cell--editing']}`]: {
      padding: 1,
      display: 'flex',
      boxShadow: t.shadows[2],
      backgroundColor: (t.vars || t).palette.background.paper,
      '&:focus-within': {
        outline: `${focusOutlineWidth}px solid ${(t.vars || t).palette.primary.main}`,
        outlineOffset: focusOutlineWidth * -1,
      },
    },
    [`& .${c['row--editing']}`]: {
      boxShadow: t.shadows[2],
    },
    [`& .${c['row--editing']} .${c.cell}`]: {
      boxShadow: t.shadows[0],
      backgroundColor: (t.vars || t).palette.background.paper,
    },
    [`& .${c.editBooleanCell}`]: {
      display: 'flex',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    [`& .${c.booleanCell}[data-value="true"]`]: {
      color: (t.vars || t).palette.text.secondary,
    },
    [`& .${c.booleanCell}[data-value="false"]`]: {
      color: (t.vars || t).palette.text.disabled,
    },
    [`& .${c.actionsCell}`]: {
      display: 'inline-flex',
      alignItems: 'center',
      gridGap: t.spacing(1),
    },
    [`& .${c.rowReorderCell}`]: {
      display: 'inline-flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: (t.vars || t).palette.action.disabledOpacity,
    },
    [`& .${c['rowReorderCell--draggable']}`]: {
      cursor: 'move',
      opacity: 1,
    },
    [`& .${c.rowReorderCellContainer}`]: {
      padding: 0,
      display: 'flex',
      alignItems: 'stretch',
    },
    [`.${c.withBorderColor}`]: {
      borderColor,
    },
    [`& .${c['cell--withLeftBorder']}, & .${c['columnHeader--withLeftBorder']}`]: {
      borderLeftColor: 'var(--DataGrid-rowBorderColor)',
      borderLeftWidth: '1px',
      borderLeftStyle: 'solid',
    },
    [`& .${c['cell--withRightBorder']}, & .${c['columnHeader--withRightBorder']}`]: {
      borderRightColor: 'var(--DataGrid-rowBorderColor)',
      borderRightWidth: '1px',
      borderRightStyle: 'solid',
    },
    [`& .${c['cell--flex']}`]: {
      display: 'flex',
      alignItems: 'center',
      lineHeight: 'inherit',
    },
    [`& .${c['cell--textLeft']}`]: {
      textAlign: 'left',
      justifyContent: 'flex-start',
    },
    [`& .${c['cell--textRight']}`]: {
      textAlign: 'right',
      justifyContent: 'flex-end',
    },
    [`& .${c['cell--textCenter']}`]: {
      textAlign: 'center',
      justifyContent: 'center',
    },
    [`& .${c['cell--pinnedLeft']}, & .${c['cell--pinnedRight']}`]: {
      position: 'sticky',
      zIndex: 30,
      background: 'var(--DataGrid-pinnedBackground)',
      '&.Mui-selected': {
        backgroundColor: pinnedSelectedBackgroundColor,
      },
    },
    [`& .${c.virtualScrollerContent} .${c.row}`]: {
      '&:hover': pinnedHoverStyles,
      '&.Mui-selected': pinnedSelectedStyles,
      '&.Mui-selected:hover': pinnedSelectedHoverStyles,
    },
    [`& .${c.cellOffsetLeft}`]: {
      flex: '0 0 auto',
      display: 'inline-block',
    },
    [`& .${c.cellSkeleton}`]: {
      flex: '0 0 auto',
      height: '100%',
      display: 'inline-flex',
      alignItems: 'center',
    },
    [`& .${c.columnHeaderDraggableContainer}`]: {
      display: 'flex',
      width: '100%',
      height: '100%',
    },
    [`& .${c.rowReorderCellPlaceholder}`]: {
      display: 'none',
    },
    [`& .${c['columnHeader--dragging']}, & .${c['row--dragging']}`]: {
      background: (t.vars || t).palette.background.paper,
      padding: '0 12px',
      borderRadius: 'var(--unstable_DataGrid-radius)',
      opacity: (t.vars || t).palette.action.disabledOpacity,
    },
    [`& .${c['row--dragging']}`]: {
      background: (t.vars || t).palette.background.paper,
      padding: '0 12px',
      borderRadius: 'var(--unstable_DataGrid-radius)',
      opacity: (t.vars || t).palette.action.disabledOpacity,

      [`& .${c.rowReorderCellPlaceholder}`]: {
        display: 'flex',
      },
    },
    [`& .${c.treeDataGroupingCell}`]: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    [`& .${c.treeDataGroupingCellToggle}`]: {
      flex: '0 0 28px',
      alignSelf: 'stretch',
      marginRight: t.spacing(2),
    },
    [`& .${c.treeDataGroupingCellLoadingContainer}, .${c.groupingCriteriaCellLoadingContainer}`]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    },
    [`& .${c.groupingCriteriaCell}`]: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    [`& .${c.groupingCriteriaCellToggle}`]: {
      flex: '0 0 28px',
      alignSelf: 'stretch',
      marginRight: t.spacing(2),
    },

    /* ScrollbarFiller styles */
    [`.${c.scrollbarFiller}`]: {
      minWidth: 'calc(var(--DataGrid-hasScrollY) * var(--DataGrid-scrollbarSize))',
      alignSelf: 'stretch',
      [`&.${c['scrollbarFiller--borderTop']}`]: {
        borderTop: '1px solid var(--DataGrid-rowBorderColor)',
      },
      [`&.${c['scrollbarFiller--borderBottom']}`]: {
        borderBottom: '1px solid var(--DataGrid-rowBorderColor)',
      },
      [`&.${c['scrollbarFiller--pinnedRight']}`]: {
        backgroundColor: 'var(--DataGrid-pinnedBackground)',
        position: 'sticky',
        right: 0,
      },
    },

    [`& .${c.filler}`]: {
      flex: '1 0 auto',
    },
    [`& .${c['filler--borderBottom']}`]: {
      borderBottom: '1px solid var(--DataGrid-rowBorderColor)',
    },

    /* Hide grid rows, row filler, and vertical scrollbar when skeleton overlay is visible */
    [`& .${c['main--hasSkeletonLoadingOverlay']}`]: {
      [`& .${c.virtualScrollerContent}`]: {
        // We use visibility hidden so that the virtual scroller content retains its height.
        // Position fixed is used to remove the virtual scroller content from the flow.
        // https://github.com/mui/mui-x/issues/14061
        position: 'fixed',
        visibility: 'hidden',
      },
      [`& .${c['scrollbar--vertical']}, & .${c.pinnedRows}, & .${c.virtualScroller} > .${c.filler}`]:
        {
          display: 'none',
        },
    },
  };

  return gridStyle;
});

/**
 * Blend a transparent overlay color with a background color, resulting in a single
 * RGB color.
 */
function blend(background: string, overlay: string, opacity: number, gamma: number = 1) {
  const f = (b: number, o: number) =>
    Math.round((b ** (1 / gamma) * (1 - opacity) + o ** (1 / gamma) * opacity) ** gamma);

  const backgroundColor = decomposeColor(background);
  const overlayColor = decomposeColor(overlay);

  const rgb = [
    f(backgroundColor.values[0], overlayColor.values[0]),
    f(backgroundColor.values[1], overlayColor.values[1]),
    f(backgroundColor.values[2], overlayColor.values[2]),
  ] as const;

  return recomposeColor({
    type: 'rgb',
    values: rgb as any,
  });
}

const removeOpacity = (color: string) => `rgb(from ${color} r g b / 1)`;
function blendCssVars(background: string, overlay: string, opacity: string | number) {
  return `color-mix(in srgb,${background}, ${removeOpacity(overlay)} calc(${opacity} * 100%))`;
}
