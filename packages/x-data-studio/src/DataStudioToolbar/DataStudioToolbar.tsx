'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import type { SxProps } from '@mui/system';
import { styled } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import {
  GridSearchIcon,
  GridUndoIcon,
  GridRedoIcon,
  GridViewColumnIcon,
  GridFilterListIcon,
  GridDownloadIcon,
  GridClearIcon,
  GridExpandMoreIcon,
  GridCheckIcon,
  GridArrowDownwardIcon,
  GridArrowUpwardIcon,
  GridCloseIcon,
  GridAddIcon,
  gridQuickFilterValuesSelector,
  gridFilterActiveItemsSelector,
  gridDensitySelector,
  useGridSelector,
  type GridDensity,
  type GridColDef,
  type GridInitialState,
  type GridSortModel,
} from '@mui/x-data-grid';
import type { RefObject } from '@mui/x-internals/types';
import { useResizeObserver } from '@mui/x-internals/useResizeObserver';
import {
  useDataStudioToolbarUtilityClasses,
  type DataStudioToolbarClasses,
} from './dataStudioToolbarClasses';
import type { DataStudioSheet } from '../DataStudio/DataStudio.types';
import {
  FunctionsIcon,
  MoreVertIcon,
  SortIcon,
  GroupIcon,
  PivotIcon,
  RefreshIcon,
  SaveIcon,
  ResetIcon,
  AutosizeIcon,
  PinIcon,
} from './icons';

type ApiRefLike = RefObject<any | null>;

export interface DataStudioToolbarProps {
  /**
   * Reference to the active grid's API. When `null`, the toolbar renders in a disabled state.
   */
  apiRef: ApiRefLike;
  /**
   * Whether the inline Data Grid is the active surface. `false` when a custom
   * view type (chart, pivot, …) owns the main pane — those bring their own grid,
   * so the toolbar's grid-bound controls would dereference a detached `apiRef`.
   * Defaults to `true` for backwards compatibility.
   * @default true
   */
  gridActive?: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DataStudioToolbarClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  className?: string;
  /**
   * @ignore
   * Currently active view (or `null` when a dataSource tab is active without a view).
   * Provided by the parent `<DataStudio>`; absent when the toolbar is rendered standalone.
   */
  activeSheet?: DataStudioSheet | null;
  /**
   * @ignore
   * Baseline grid state used when the user clicks "Reset view" — typically the current view's
   * `initialState` or the active dataSource's default initial state. Provided by the parent
   * `<DataStudio>`; absent when the toolbar is rendered standalone.
   */
  baselineInitialState?: GridInitialState;
  /**
   * @ignore
   * Called by the toolbar when the user saves the current grid state as a new view.
   * Provided by the parent `<DataStudio>`; absent when the toolbar is rendered standalone.
   */
  onSaveCurrentView?: (input: { label: string; initialState: GridInitialState }) => void;
  /**
   * @ignore
   * Called by the toolbar's "Add row" button. When omitted, the button is hidden.
   * Sourced from the active dataSource's `onAddRow` callback.
   */
  onAddRow?: () => void | Promise<void>;
}

const DataStudioToolbarRoot = styled('div', {
  name: 'MuiDataStudioToolbar',
  slot: 'Root',
})(({ theme }) => ({
  position: 'relative',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  height: 44,
  borderRadius: 999,
  padding: theme.spacing(0, 1),
  margin: theme.spacing(0.5, 1),
  backgroundColor: (theme.vars || theme).palette.background.paper,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  overflow: 'hidden',
  flexWrap: 'nowrap',
  '& > *': {
    alignSelf: 'center',
  },
}));

const DataStudioToolbarGroup = styled('div', {
  name: 'MuiDataStudioToolbar',
  slot: 'Group',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  flex: '0 0 auto',
}));

const DataStudioToolbarDivider = styled(Divider, {
  name: 'MuiDataStudioToolbar',
  slot: 'Divider',
})(({ theme }) => ({
  height: 20,
  margin: theme.spacing(0, 0.5),
  borderColor: (theme.vars || theme).palette.divider,
  flex: '0 0 auto',
  alignSelf: 'center',
}));

const DataStudioToolbarSearch = styled('div', {
  name: 'MuiDataStudioToolbar',
  slot: 'Search',
})({
  flex: '1 1 160px',
  minWidth: 160,
  maxWidth: 320,
  display: 'flex',
});

const SearchInput = styled(OutlinedInput)(({ theme }) => ({
  flex: '1 1 160px',
  minWidth: 160,
  maxWidth: 320,
  height: 32,
  fontSize: '0.8125rem',
  borderRadius: 999,
  paddingLeft: theme.spacing(0.5),
  paddingRight: theme.spacing(0.5),
  transition: theme.transitions.create(['border-color', 'box-shadow'], {
    duration: theme.transitions.duration.shortest,
  }),
  '& .MuiOutlinedInput-notchedOutline': {
    border: `1px solid ${(theme.vars || theme).palette.divider}`,
    transition: theme.transitions.create('border-color', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: (theme.vars || theme).palette.text.disabled,
  },
  '&.Mui-focused': {
    boxShadow: `0 0 0 3px ${theme.alpha((theme.vars || theme).palette.primary.main, 0.12)}`,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: (theme.vars || theme).palette.primary.main,
    borderWidth: 1,
  },
  '& .MuiOutlinedInput-input': {
    height: 32,
    boxSizing: 'border-box',
    padding: theme.spacing(0, 0.5),
    lineHeight: 'normal',
  },
}));

const DensityTrigger = styled(Button)(({ theme }) => ({
  minWidth: 96,
  height: 32,
  textTransform: 'none',
  fontWeight: 400,
  fontSize: '0.8125rem',
  lineHeight: 'normal',
  padding: theme.spacing(0, 1),
  justifyContent: 'space-between',
  backgroundColor: theme.alpha((theme.vars || theme).palette.text.primary, 0.04),
  transition: theme.transitions.create(['background-color', 'border-color'], {
    duration: theme.transitions.duration.shortest,
  }),
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
  },
  '& .MuiButton-endIcon': {
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  '&[aria-expanded="true"] .MuiButton-endIcon': {
    transform: 'rotate(180deg)',
  },
}));

// Sheets-style "Add row" pill: text + leading icon, sized to nest into the 44px
// toolbar pill without dominating it. Lives right after the search input.
const AddRowButton = styled(Button)(({ theme }) => ({
  height: 32,
  textTransform: 'none',
  fontWeight: 400,
  fontSize: '0.8125rem',
  padding: theme.spacing(0, 1),
  borderRadius: 999,
}));

const ToolbarIconButton = styled(IconButton)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  padding: theme.spacing(0.75),
  borderRadius: '50%',
  color: (theme.vars || theme).palette.text.primary,
  transition: theme.transitions.create(['background-color', 'box-shadow', 'color'], {
    duration: theme.transitions.duration.shortest,
  }),
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
  },
  '&:active': {
    backgroundColor: (theme.vars || theme).palette.action.selected,
  },
  '&.Mui-selected, &[data-active="true"]': {
    backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.16),
    color: (theme.vars || theme).palette.primary.main,
    '&:hover': {
      backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.24),
    },
  },
  '& svg': { fontSize: 20 },
  // Expand the tappable area on coarse pointers without growing the visual box.
  '@media (pointer: coarse)': {
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: -6,
    },
  },
}));

const SaveViewPopperPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 1.5),
  borderRadius: 8,
  boxShadow: theme.shadows[4],
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const SaveViewInput = styled(OutlinedInput)(({ theme }) => ({
  width: 220,
  height: 32,
  fontSize: '0.875rem',
  paddingLeft: theme.spacing(0.5),
  paddingRight: theme.spacing(0.5),
  '& .MuiOutlinedInput-input': {
    height: 32,
    boxSizing: 'border-box',
    padding: theme.spacing(0, 0.5),
    lineHeight: 1,
  },
}));

const DataStudioToolbarGhost = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: -9999,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  height: 44,
  padding: theme.spacing(0, 1),
  visibility: 'hidden',
  pointerEvents: 'none',
  flexWrap: 'nowrap',
  whiteSpace: 'nowrap',
  width: 'max-content',
}));

const DataStudioToolbarOverflowPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  height: 44,
  borderRadius: 999,
  padding: theme.spacing(0, 1),
  backgroundColor: (theme.vars || theme).palette.background.paper,
  boxShadow: theme.shadows[3],
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  '& > *': {
    alignSelf: 'center',
  },
}));

// ---------------- Local selectors ----------------
// We avoid importing Premium-only selectors so the toolbar can run against any grid tier;
// each selector reads from `apiRef.current.state` directly and falls back to a safe default.

const historyEnabledSelector = (apiRef: ApiRefLike) =>
  Boolean(apiRef.current?.state?.history?.enabled);

const historyCanUndoSelector = (apiRef: ApiRefLike) =>
  (apiRef.current?.state?.history?.currentPosition ?? -1) >= 0;

const historyCanRedoSelector = (apiRef: ApiRefLike) => {
  const stack = apiRef.current?.state?.history?.stack;
  const pos = apiRef.current?.state?.history?.currentPosition ?? -1;
  return Array.isArray(stack) && pos < stack.length - 1;
};

const gridColumnsSelector = (apiRef: ApiRefLike): GridColDef[] => {
  const lookup = apiRef.current?.state?.columns?.lookup;
  const order: string[] | undefined = apiRef.current?.state?.columns?.orderedFields;
  if (!lookup || !order) {
    return [];
  }
  return order.map((field) => lookup[field]).filter(Boolean);
};

const sortModelSelector = (apiRef: ApiRefLike): GridSortModel =>
  apiRef.current?.state?.sorting?.sortModel ?? [];

const focusedColumnHeaderFieldSelector = (apiRef: ApiRefLike): string | null =>
  apiRef.current?.state?.focus?.columnHeader?.field ?? null;

const pivotActiveSelector = (apiRef: ApiRefLike): boolean =>
  Boolean(apiRef.current?.state?.pivoting?.active);

// Pivot sidebar open: reads Premium's `state.sidebar` shape directly so the
// toolbar stays tier-agnostic (no Premium-specific imports). The Premium enum
// value for the pivot sidebar is the string `'pivot'`.
const pivotPanelOpenSelector = (apiRef: ApiRefLike): boolean => {
  const sidebar = apiRef.current?.state?.sidebar;
  return Boolean(sidebar?.open && sidebar?.value === 'pivot');
};

const rowGroupingModelSelector = (apiRef: ApiRefLike): string[] => {
  const model = apiRef.current?.state?.rowGrouping?.model;
  return Array.isArray(model) ? model : [];
};

const pinnedColumnsSelector = (
  apiRef: ApiRefLike,
): { left?: string[]; right?: string[] } | null => {
  // The Pro `pinnedColumns` state is keyed under different paths depending on grid version;
  // try the documented one first and fall back to apiRef.current.getPinnedColumns().
  const fromState = apiRef.current?.state?.pinnedColumns;
  if (fromState && (Array.isArray(fromState.left) || Array.isArray(fromState.right))) {
    return fromState;
  }
  const fromApi = apiRef.current?.getPinnedColumns?.();
  return fromApi ?? null;
};

const DENSITY_LABELS: Record<GridDensity, string> = {
  compact: 'Compact',
  standard: 'Standard',
  comfortable: 'Comfortable',
};

const DENSITY_ORDER: GridDensity[] = ['compact', 'standard', 'comfortable'];

type AggregationFn = 'sum' | 'avg' | 'min' | 'max' | 'size';

const AGGREGATION_OPTIONS: { value: AggregationFn; label: string }[] = [
  { value: 'sum', label: 'Sum' },
  { value: 'avg', label: 'Average' },
  { value: 'min', label: 'Min' },
  { value: 'max', label: 'Max' },
  { value: 'size', label: 'Count' },
];

function DataStudioToolbar(props: DataStudioToolbarProps) {
  const {
    apiRef,
    gridActive = true,
    classes: classesProp,
    sx,
    className,
    activeSheet,
    baselineInitialState,
    onSaveCurrentView,
    onAddRow,
  } = props;
  const classes = useDataStudioToolbarUtilityClasses(classesProp);

  const [apiBound, setApiBound] = React.useState<boolean>(
    () => gridActive && Boolean(apiRef.current?.state),
  );
  React.useEffect(() => {
    // Drop the binding when a custom view type owns the pane so the grid-bound
    // controls stop reading the detached `apiRef`; re-poll when it returns.
    if (!gridActive) {
      setApiBound(false);
      return undefined;
    }
    if (apiBound) {
      return undefined;
    }
    let cancelled = false;
    let frameId: number | null = null;
    const check = () => {
      if (cancelled) {
        return;
      }
      if (apiRef.current?.state) {
        setApiBound(true);
      } else {
        frameId = requestAnimationFrame(check);
      }
    };
    check();
    return () => {
      cancelled = true;
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [apiRef, apiBound, gridActive]);

  return (
    <DataStudioToolbarRoot
      role="toolbar"
      aria-label="Data Studio toolbar"
      className={clsx(classes.root, className)}
      sx={sx}
    >
      {gridActive && apiBound ? (
        <ActiveToolbar
          apiRef={apiRef}
          classes={classes}
          activeSheet={activeSheet ?? null}
          baselineInitialState={baselineInitialState}
          onSaveCurrentView={onSaveCurrentView}
          onAddRow={onAddRow}
        />
      ) : (
        <DisabledToolbar classes={classes} />
      )}
    </DataStudioToolbarRoot>
  );
}

DataStudioToolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  activeSheet: PropTypes.object,
  apiRef: PropTypes.shape({ current: PropTypes.any }),
  baselineInitialState: PropTypes.object,
  classes: PropTypes.object,
  className: PropTypes.string,
  onAddRow: PropTypes.func,
  onSaveCurrentView: PropTypes.func,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

function DisabledToolbar({ classes }: { classes: DataStudioToolbarClasses }) {
  return (
    <DataStudioToolbarGroup className={classes.group}>
      <DataStudioToolbarSearch className={classes.search}>
        <SearchInput
          size="small"
          placeholder="Search"
          disabled
          startAdornment={
            <InputAdornment position="start">
              <GridSearchIcon fontSize="small" />
            </InputAdornment>
          }
        />
      </DataStudioToolbarSearch>
    </DataStudioToolbarGroup>
  );
}


interface ActiveToolbarProps {
  apiRef: ApiRefLike;
  classes: DataStudioToolbarClasses;
  activeSheet: DataStudioSheet | null;
  baselineInitialState: GridInitialState | undefined;
  onSaveCurrentView: ((input: { label: string; initialState: GridInitialState }) => void) | undefined;
  onAddRow: (() => void | Promise<void>) | undefined;
}

interface ToolbarGroupSpec {
  id: string;
  render: () => React.ReactElement;
}

const END_GROUP_WIDTH = 90;
const OVERFLOW_TRIGGER_WIDTH = 36;

function ActiveToolbar({
  apiRef,
  classes,
  activeSheet,
  baselineInitialState,
  onSaveCurrentView,
  onAddRow,
}: ActiveToolbarProps) {
  // ----- Grid selectors -----
  const quickFilterValues = useGridSelector(apiRef, gridQuickFilterValuesSelector);
  const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
  const density = useGridSelector(apiRef, gridDensitySelector);
  const columns = useGridSelector(apiRef, gridColumnsSelector);
  const sortModel = useGridSelector(apiRef, sortModelSelector);
  const focusedHeaderField = useGridSelector(apiRef, focusedColumnHeaderFieldSelector);
  const pivotActive = useGridSelector(apiRef, pivotActiveSelector);
  const groupingModel = useGridSelector(apiRef, rowGroupingModelSelector);
  const pinnedColumns = useGridSelector(apiRef, pinnedColumnsSelector);

  const historyEnabled = useGridSelector(apiRef, historyEnabledSelector);
  const canUndo = useGridSelector(apiRef, historyCanUndoSelector);
  const canRedo = useGridSelector(apiRef, historyCanRedoSelector);

  // ----- Capability gates (derived once) -----
  const hasAggregation = typeof apiRef.current?.setAggregationModel === 'function';
  const hasExcelExport = typeof apiRef.current?.exportDataAsExcel === 'function';
  const hasRowGrouping = typeof apiRef.current?.addRowGroupingCriteria === 'function';
  // Pivot is exposed via the Premium sidebar API (`showSidebar`/`hideSidebar`).
  // We still rely on the legacy `setPivotActive` presence as a tier check.
  const hasPivoting =
    typeof apiRef.current?.setPivotActive === 'function' &&
    typeof apiRef.current?.showSidebar === 'function';
  const hasAutosize = typeof apiRef.current?.autosizeColumns === 'function';
  const hasPinning = typeof apiRef.current?.pinColumn === 'function';
  const hasDataSource = Boolean(apiRef.current?.connector);

  // ----- Search state (synced to quick filter) -----
  const [searchDraft, setSearchDraft] = React.useState(() =>
    Array.isArray(quickFilterValues) ? quickFilterValues.join(' ') : '',
  );
  const lastJoinedRef = React.useRef<string>(searchDraft);
  React.useEffect(() => {
    const joined = Array.isArray(quickFilterValues) ? quickFilterValues.join(' ') : '';
    if (joined !== lastJoinedRef.current) {
      lastJoinedRef.current = joined;
      setSearchDraft(joined);
    }
  }, [quickFilterValues]);

  const commitSearch = React.useCallback(
    (value: string) => {
      const values = value.split(/\s+/).filter(Boolean);
      lastJoinedRef.current = values.join(' ');
      apiRef.current?.setQuickFilterValues?.(values);
    },
    [apiRef],
  );

  const handleSearchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value;
      setSearchDraft(next);
      commitSearch(next);
    },
    [commitSearch],
  );

  const handleSearchClear = React.useCallback(() => {
    setSearchDraft('');
    commitSearch('');
  }, [commitSearch]);

  // ----- Density menu -----
  const [densityAnchor, setDensityAnchor] = React.useState<HTMLElement | null>(null);
  const handleDensityClick = (event: React.MouseEvent<HTMLElement>) =>
    setDensityAnchor(event.currentTarget);
  const handleDensityClose = () => setDensityAnchor(null);
  const handleDensitySelect = (next: GridDensity) => {
    apiRef.current?.setDensity?.(next);
    handleDensityClose();
  };

  // ----- Numeric column lookup (consumed by aggregation only) -----
  const numericFields = React.useMemo(
    () => columns.filter((c) => c.type === 'number').map((c) => c.field),
    [columns],
  );

  // ----- Sort menu -----
  const [sortAnchor, setSortAnchor] = React.useState<HTMLElement | null>(null);
  const handleSortClick = (event: React.MouseEvent<HTMLElement>) =>
    setSortAnchor(event.currentTarget);
  const handleSortClose = () => setSortAnchor(null);

  const sortableColumns = React.useMemo(
    () => columns.filter((c) => c.sortable !== false),
    [columns],
  );
  const sortedFieldsSet = React.useMemo(
    () => new Set(sortModel.map((item) => item.field)),
    [sortModel],
  );
  const addableSortColumns = sortableColumns.filter((c) => !sortedFieldsSet.has(c.field));

  const handleSortToggle = (field: string) => {
    const current = sortModel.find((item) => item.field === field);
    const nextDirection = current?.sort === 'asc' ? 'desc' : 'asc';
    apiRef.current?.sortColumn?.(field, nextDirection, true);
  };
  const handleSortRemove = (field: string) => {
    const next = sortModel.filter((item) => item.field !== field);
    apiRef.current?.setSortModel?.(next);
  };
  const handleSortAdd = (field: string) => {
    apiRef.current?.sortColumn?.(field, 'asc', true);
  };
  const handleSortClear = () => {
    apiRef.current?.setSortModel?.([]);
    handleSortClose();
  };

  // ----- Clear all filters -----
  const hasActiveFilters = (activeFilters?.length ?? 0) > 0 || searchDraft.length > 0;
  const handleClearAllFilters = () => {
    apiRef.current?.setFilterModel?.({ items: [] });
    apiRef.current?.setQuickFilterValues?.([]);
    setSearchDraft('');
  };

  // ----- Column visibility / autosize / pin -----
  const handleColumnsClick = () => {
    apiRef.current?.showPreferences?.('columns');
  };
  const handleAutosize = () => {
    apiRef.current?.autosizeColumns?.({ includeOutliers: true, includeHeaders: true });
  };

  const [pinAnchor, setPinAnchor] = React.useState<HTMLElement | null>(null);
  const handlePinClick = (event: React.MouseEvent<HTMLElement>) =>
    setPinAnchor(event.currentTarget);
  const handlePinClose = () => setPinAnchor(null);
  const pinTargetField = focusedHeaderField;
  const isPinnedLeft = Boolean(pinTargetField && pinnedColumns?.left?.includes(pinTargetField));
  const isPinnedRight = Boolean(pinTargetField && pinnedColumns?.right?.includes(pinTargetField));
  const handlePinLeft = () => {
    if (pinTargetField) {
      apiRef.current?.pinColumn?.(pinTargetField, 'left');
    }
    handlePinClose();
  };
  const handlePinRight = () => {
    if (pinTargetField) {
      apiRef.current?.pinColumn?.(pinTargetField, 'right');
    }
    handlePinClose();
  };
  const handleUnpin = () => {
    if (pinTargetField) {
      apiRef.current?.unpinColumn?.(pinTargetField);
    }
    handlePinClose();
  };

  // ----- Filter panel -----
  const handleFilterClick = () => {
    apiRef.current?.showFilterPanel?.();
  };

  // ----- Row grouping menu -----
  const [groupAnchor, setGroupAnchor] = React.useState<HTMLElement | null>(null);
  const handleGroupClick = (event: React.MouseEvent<HTMLElement>) =>
    setGroupAnchor(event.currentTarget);
  const handleGroupClose = () => setGroupAnchor(null);
  const groupableColumns = React.useMemo(
    () => columns.filter((c) => c.groupable !== false),
    [columns],
  );
  const groupingSet = React.useMemo(() => new Set(groupingModel), [groupingModel]);
  const addableGroupColumns = groupableColumns.filter((c) => !groupingSet.has(c.field));
  const handleGroupRemove = (field: string) => {
    apiRef.current?.removeRowGroupingCriteria?.(field);
  };
  const handleGroupAdd = (field: string) => {
    apiRef.current?.addRowGroupingCriteria?.(field);
  };
  const handleGroupClear = () => {
    groupingModel.forEach((field) => apiRef.current?.removeRowGroupingCriteria?.(field));
    handleGroupClose();
  };

  // ----- Pivot sidebar (replaces the legacy on/off toggle) -----
  // The button opens the Premium pivot side panel; clicking it again hides
  // the sidebar. Pivot mode itself flips when the user actually configures
  // pivoting in the panel, not when this button is clicked.
  const pivotPanelOpen = useGridSelector(apiRef, pivotPanelOpenSelector);
  const pivotPanelTriggerId = React.useId();
  const pivotPanelId = React.useId();
  const handlePivotPanelToggle = () => {
    if (pivotPanelOpen) {
      apiRef.current?.hideSidebar?.();
    } else {
      apiRef.current?.showSidebar?.('pivot', pivotPanelId, pivotPanelTriggerId);
    }
  };

  // ----- Aggregation menu -----
  const [aggAnchor, setAggAnchor] = React.useState<HTMLElement | null>(null);
  const handleAggClick = (event: React.MouseEvent<HTMLElement>) =>
    setAggAnchor(event.currentTarget);
  const handleAggClose = () => setAggAnchor(null);
  const handleAggSelect = (fn: AggregationFn) => {
    if (numericFields.length > 0) {
      const next: Record<string, AggregationFn> = {};
      numericFields.forEach((field) => {
        next[field] = fn;
      });
      apiRef.current?.setAggregationModel?.(next);
    }
    handleAggClose();
  };
  const handleAggClear = () => {
    apiRef.current?.setAggregationModel?.({});
    handleAggClose();
  };

  // ----- View management -----
  const handleRefresh = () => {
    apiRef.current?.connector?.fetchRows?.();
  };

  const [saveViewAnchor, setSaveViewAnchor] = React.useState<HTMLElement | null>(null);
  const [saveViewName, setSaveViewName] = React.useState('');
  const handleSaveViewOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSaveViewName('');
    setSaveViewAnchor(event.currentTarget);
  };
  const handleSaveViewClose = () => setSaveViewAnchor(null);
  const handleSaveViewSubmit = () => {
    if (!onSaveCurrentView) {
      handleSaveViewClose();
      return;
    }
    const exportedState: GridInitialState | undefined = apiRef.current?.exportState?.();
    onSaveCurrentView({
      label: saveViewName.trim() || 'New view',
      initialState: exportedState ?? {},
    });
    handleSaveViewClose();
  };

  const handleResetView = () => {
    if (baselineInitialState) {
      apiRef.current?.restoreState?.(baselineInitialState);
    } else {
      apiRef.current?.restoreState?.({});
    }
  };

  // ----- Export menu -----
  const [exportAnchor, setExportAnchor] = React.useState<HTMLElement | null>(null);
  const handleExportClick = (event: React.MouseEvent<HTMLElement>) =>
    setExportAnchor(event.currentTarget);
  const handleExportClose = () => setExportAnchor(null);
  const handleExportCsv = () => {
    apiRef.current?.exportDataAsCsv?.();
    handleExportClose();
  };
  const handleExportExcel = () => {
    apiRef.current?.exportDataAsExcel?.();
    handleExportClose();
  };
  const handleExportPrint = () => {
    apiRef.current?.exportDataAsPrint?.();
    handleExportClose();
  };

  // ----- Build groups -----
  const middleGroups: ToolbarGroupSpec[] = [];

  if (onAddRow) {
    middleGroups.push({
      id: 'add-row',
      render: () => (
        <DataStudioToolbarGroup className={classes.group}>
          <Tooltip title="Add row">
            <AddRowButton
              size="small"
              color="primary"
              aria-label="Add row"
              startIcon={<GridAddIcon fontSize="small" />}
              onClick={() => {
                void onAddRow();
              }}
            >
              Add row
            </AddRowButton>
          </Tooltip>
        </DataStudioToolbarGroup>
      ),
    });
  }

  if (historyEnabled) {
    middleGroups.push({
      id: 'history',
      render: () => (
        <DataStudioToolbarGroup className={classes.group}>
          <Tooltip title="Undo">
            <span>
              <ToolbarIconButton
                size="small"
                aria-label="Undo"
                disabled={!canUndo}
                onClick={() => apiRef.current?.history?.undo?.()}
              >
                <GridUndoIcon fontSize="small" />
              </ToolbarIconButton>
            </span>
          </Tooltip>
          <Tooltip title="Redo">
            <span>
              <ToolbarIconButton
                size="small"
                aria-label="Redo"
                disabled={!canRedo}
                onClick={() => apiRef.current?.history?.redo?.()}
              >
                <GridRedoIcon fontSize="small" />
              </ToolbarIconButton>
            </span>
          </Tooltip>
        </DataStudioToolbarGroup>
      ),
    });
  }

  middleGroups.push({
    id: 'density',
    render: () => (
      <DataStudioToolbarGroup className={classes.group}>
        <Tooltip title={`Row density: ${DENSITY_LABELS[density] ?? 'Standard'}`}>
          <DensityTrigger
            size="small"
            color="inherit"
            aria-haspopup="true"
            aria-expanded={Boolean(densityAnchor)}
            onClick={handleDensityClick}
            endIcon={<GridExpandMoreIcon fontSize="small" />}
          >
            {DENSITY_LABELS[density] ?? 'Standard'}
          </DensityTrigger>
        </Tooltip>
      </DataStudioToolbarGroup>
    ),
  });

  // Reset view is always available (restoreState falls back to an empty initial
  // state), so the view-management group is always rendered. Refresh and Save
  // each gate themselves on the relevant capability inside the group body.
  const showViewManagementGroup = true;
  if (showViewManagementGroup) {
    middleGroups.push({
      id: 'view-mgmt',
      render: () => (
        <DataStudioToolbarGroup className={classes.group}>
          {hasDataSource ? (
            <Tooltip title="Refresh data">
              <ToolbarIconButton size="small" aria-label="Refresh data" onClick={handleRefresh}>
                <RefreshIcon fontSize="small" />
              </ToolbarIconButton>
            </Tooltip>
          ) : null}
          {onSaveCurrentView ? (
            <Tooltip title="Save current view">
              <ToolbarIconButton
                size="small"
                aria-label="Save current view"
                aria-haspopup="true"
                aria-expanded={Boolean(saveViewAnchor)}
                onClick={handleSaveViewOpen}
              >
                <SaveIcon fontSize="small" />
              </ToolbarIconButton>
            </Tooltip>
          ) : null}
          <Tooltip
            title={
              activeSheet
                ? `Reset to "${typeof activeSheet.label === 'string' ? activeSheet.label : 'view'}" defaults`
                : 'Reset view'
            }
          >
            <ToolbarIconButton size="small" aria-label="Reset view" onClick={handleResetView}>
              <ResetIcon fontSize="small" />
            </ToolbarIconButton>
          </Tooltip>
        </DataStudioToolbarGroup>
      ),
    });
  }

  middleGroups.push({
    id: 'sort',
    render: () => (
      <DataStudioToolbarGroup className={classes.group}>
        <Tooltip
          title={
            sortModel.length === 0
              ? 'Sort'
              : `Sorted by ${sortModel.length} column${sortModel.length === 1 ? '' : 's'}`
          }
        >
          <ToolbarIconButton
            size="small"
            aria-label="Sort"
            aria-haspopup="true"
            aria-expanded={Boolean(sortAnchor)}
            onClick={handleSortClick}
          >
            <Badge
              badgeContent={sortModel.length}
              color="primary"
              invisible={sortModel.length === 0}
            >
              <SortIcon fontSize="small" />
            </Badge>
          </ToolbarIconButton>
        </Tooltip>
      </DataStudioToolbarGroup>
    ),
  });

  middleGroups.push({
    id: 'filter',
    render: () => (
      <DataStudioToolbarGroup className={classes.group}>
        <Tooltip title="Filter">
          <ToolbarIconButton size="small" aria-label="Filter" onClick={handleFilterClick}>
            <Badge badgeContent={activeFilters?.length ?? 0} color="primary">
              <GridFilterListIcon fontSize="small" />
            </Badge>
          </ToolbarIconButton>
        </Tooltip>
        {hasActiveFilters ? (
          <Tooltip title="Clear all filters">
            <ToolbarIconButton
              size="small"
              aria-label="Clear all filters"
              onClick={handleClearAllFilters}
            >
              <GridCloseIcon fontSize="small" />
            </ToolbarIconButton>
          </Tooltip>
        ) : null}
      </DataStudioToolbarGroup>
    ),
  });

  middleGroups.push({
    id: 'columns',
    render: () => (
      <DataStudioToolbarGroup className={classes.group}>
        <Tooltip title="Columns">
          <ToolbarIconButton size="small" aria-label="Columns" onClick={handleColumnsClick}>
            <GridViewColumnIcon fontSize="small" />
          </ToolbarIconButton>
        </Tooltip>
        {hasAutosize ? (
          <Tooltip title="Autosize columns">
            <ToolbarIconButton
              size="small"
              aria-label="Autosize columns"
              onClick={handleAutosize}
            >
              <AutosizeIcon fontSize="small" />
            </ToolbarIconButton>
          </Tooltip>
        ) : null}
        {hasPinning ? (
          <Tooltip
            title={
              pinTargetField
                ? `Pin column "${pinTargetField}"`
                : 'Pin column (focus a column header first)'
            }
          >
            <span>
              <ToolbarIconButton
                size="small"
                aria-label="Pin column"
                aria-haspopup="true"
                aria-expanded={Boolean(pinAnchor)}
                onClick={handlePinClick}
                disabled={!pinTargetField}
              >
                <PinIcon fontSize="small" />
              </ToolbarIconButton>
            </span>
          </Tooltip>
        ) : null}
      </DataStudioToolbarGroup>
    ),
  });

  if (hasRowGrouping || hasAggregation || hasPivoting) {
    middleGroups.push({
      id: 'analytics',
      render: () => (
        <DataStudioToolbarGroup className={classes.group}>
          {hasRowGrouping ? (
            <Tooltip
              title={
                groupingModel.length === 0
                  ? 'Group by'
                  : `Grouped by ${groupingModel.length} column${groupingModel.length === 1 ? '' : 's'}`
              }
            >
              <ToolbarIconButton
                size="small"
                aria-label="Group by"
                aria-haspopup="true"
                aria-expanded={Boolean(groupAnchor)}
                onClick={handleGroupClick}
              >
                <Badge
                  badgeContent={groupingModel.length}
                  color="primary"
                  invisible={groupingModel.length === 0}
                >
                  <GroupIcon fontSize="small" />
                </Badge>
              </ToolbarIconButton>
            </Tooltip>
          ) : null}
          {hasAggregation ? (
            <Tooltip title="Aggregate numeric columns">
              <span>
                <ToolbarIconButton
                  size="small"
                  aria-label="Aggregate"
                  aria-haspopup="true"
                  aria-expanded={Boolean(aggAnchor)}
                  onClick={handleAggClick}
                  disabled={numericFields.length === 0}
                >
                  <FunctionsIcon fontSize="small" />
                </ToolbarIconButton>
              </span>
            </Tooltip>
          ) : null}
          {hasPivoting ? (
            <Tooltip title={pivotPanelOpen ? 'Close pivot panel' : 'Open pivot panel'}>
              <ToolbarIconButton
                id={pivotPanelTriggerId}
                size="small"
                aria-label={pivotPanelOpen ? 'Close pivot panel' : 'Open pivot panel'}
                aria-haspopup="true"
                aria-expanded={pivotPanelOpen ? 'true' : undefined}
                aria-pressed={pivotPanelOpen || pivotActive}
                aria-controls={pivotPanelOpen ? pivotPanelId : undefined}
                onClick={handlePivotPanelToggle}
                data-active={pivotPanelOpen || pivotActive ? 'true' : undefined}
              >
                <PivotIcon fontSize="small" />
              </ToolbarIconButton>
            </Tooltip>
          ) : null}
        </DataStudioToolbarGroup>
      ),
    });
  }

  const searchGroup: ToolbarGroupSpec = {
    id: 'search',
    render: () => (
      <DataStudioToolbarGroup className={classes.group}>
        <DataStudioToolbarSearch className={classes.search}>
          <SearchInput
            size="small"
            placeholder="Search"
            value={searchDraft}
            onChange={handleSearchChange}
            startAdornment={
              <InputAdornment position="start">
                <GridSearchIcon fontSize="small" />
              </InputAdornment>
            }
            endAdornment={
              searchDraft ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label="Clear search"
                    onClick={handleSearchClear}
                    edge="end"
                  >
                    <GridClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null
            }
          />
        </DataStudioToolbarSearch>
      </DataStudioToolbarGroup>
    ),
  };

  const exportGroup: ToolbarGroupSpec = {
    id: 'export',
    render: () => (
      <DataStudioToolbarGroup className={classes.group}>
        <Tooltip title="Export">
          <ToolbarIconButton
            size="small"
            aria-label="Export"
            aria-haspopup="true"
            aria-expanded={Boolean(exportAnchor)}
            onClick={handleExportClick}
          >
            <GridDownloadIcon fontSize="small" />
          </ToolbarIconButton>
        </Tooltip>
      </DataStudioToolbarGroup>
    ),
  };

  // ----- Overflow detection (unchanged from the previous phase) -----
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const ghostRef = React.useRef<HTMLDivElement | null>(null);

  const [overflowedIds, setOverflowedIds] = React.useState<Set<string>>(new Set());
  const [overflowOpen, setOverflowOpen] = React.useState(false);
  const overflowTriggerRef = React.useRef<HTMLButtonElement | null>(null);

  const middleIds = middleGroups.map((g) => g.id).join('|');

  const recompute = React.useCallback(() => {
    const wrapper = wrapperRef.current;
    const ghost = ghostRef.current;
    if (!wrapper || !ghost) {
      return;
    }
    const container = wrapper.parentElement as HTMLElement | null;
    if (!container) {
      return;
    }

    const ghostLeft = ghost.getBoundingClientRect().left;
    const rightById = new Map<string, number>();
    const widthById = new Map<string, number>();
    for (const child of Array.from(ghost.children) as HTMLElement[]) {
      const id = child.dataset.toolbarGroupId;
      if (!id || id === '__divider__') {
        continue;
      }
      const rect = child.getBoundingClientRect();
      rightById.set(id, rect.right - ghostLeft);
      widthById.set(id, rect.width);
    }

    const containerWidth = container.clientWidth;
    const exportWidth = widthById.get(exportGroup.id) ?? END_GROUP_WIDTH;
    const rightReserved = exportWidth + 8;

    const cap = containerWidth - rightReserved;
    const capWithTrigger = cap - (OVERFLOW_TRIGGER_WIDTH + 8);

    const fitsUnder = (limit: number) => {
      const result: string[] = [];
      let overflowing = false;
      for (const group of middleGroups) {
        if (overflowing) {
          result.push(group.id);
          continue;
        }
        const right = rightById.get(group.id) ?? 0;
        if (right > limit) {
          overflowing = true;
          result.push(group.id);
        }
      }
      return result;
    };

    let overflow = fitsUnder(cap);
    if (overflow.length > 0) {
      overflow = fitsUnder(capWithTrigger);
    }

    const next = new Set(overflow);
    setOverflowedIds((prev) => {
      if (prev.size !== next.size) {
        return next;
      }
      for (const id of prev) {
        if (!next.has(id)) {
          return next;
        }
      }
      return prev;
    });
    // `middleGroups` is rebuilt every render; we key the callback on the joined
    // `middleIds` instead to stay referentially stable while still invalidating
    // when the group composition changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [middleIds, searchGroup.id, exportGroup.id]);

  const containerRef = React.useRef<HTMLElement | null>(null);
  const containerSetterRef = React.useCallback(() => {
    containerRef.current = wrapperRef.current?.parentElement ?? null;
  }, []);
  React.useLayoutEffect(() => {
    containerSetterRef();
  }, [containerSetterRef]);

  useResizeObserver(containerRef, recompute);
  React.useLayoutEffect(() => {
    recompute();
  }, [
    recompute,
    historyEnabled,
    hasAggregation,
    hasRowGrouping,
    hasPivoting,
    showViewManagementGroup,
    hasActiveFilters,
    pivotActive,
    pivotPanelOpen,
    sortModel.length,
    groupingModel.length,
    onAddRow,
  ]);

  const overflowGroups = middleGroups.filter((g) => overflowedIds.has(g.id));
  const visibleGroups = middleGroups.filter((g) => !overflowedIds.has(g.id));
  const showOverflowTrigger = overflowGroups.length > 0;

  React.useEffect(() => {
    if (overflowGroups.length === 0 && overflowOpen) {
      setOverflowOpen(false);
    }
  }, [overflowGroups.length, overflowOpen]);

  const renderGroups = (
    groups: ToolbarGroupSpec[],
    keyPrefix: string,
    withLeadingDivider: boolean,
  ) =>
    groups.map((group, index) => (
      <React.Fragment key={`${keyPrefix}-${group.id}`}>
        {(withLeadingDivider || index > 0) && (
          <DataStudioToolbarDivider
            orientation="vertical"
            flexItem
            className={classes.divider}
          />
        )}
        {group.render()}
      </React.Fragment>
    ));

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ display: 'contents' }} />

      <DataStudioToolbarGhost
        ref={ghostRef}
        aria-hidden="true"
        // React 19+ supports `inert` as a boolean prop. Removes the subtree
        // from the accessibility tree + focus order without affecting
        // layout/measurement (a sibling under the toolbar role with the same
        // placeholders/aria-labels would otherwise pollute screen readers and
        // testing-library queries).
        inert
      >
        <div data-toolbar-group-id={searchGroup.id}>{searchGroup.render()}</div>
        {middleGroups.map((group) => (
          <React.Fragment key={`ghost-${group.id}`}>
            <DataStudioToolbarDivider
              orientation="vertical"
              flexItem
              data-toolbar-group-id="__divider__"
            />
            <div data-toolbar-group-id={group.id}>{group.render()}</div>
          </React.Fragment>
        ))}
        <div data-toolbar-group-id={exportGroup.id}>{exportGroup.render()}</div>
      </DataStudioToolbarGhost>

      {/* Pinned start group. */}
      {searchGroup.render()}

      {/* Visible middle groups. */}
      {renderGroups(visibleGroups, 'visible', true)}

      {/* Overflow trigger — shown only when at least one group spilled. */}
      {showOverflowTrigger ? (
        <React.Fragment>
          <DataStudioToolbarDivider
            orientation="vertical"
            flexItem
            className={classes.divider}
          />
          <Tooltip title="More tools">
            <ToolbarIconButton
              ref={overflowTriggerRef}
              size="small"
              aria-label="More tools"
              aria-haspopup="true"
              aria-expanded={overflowOpen}
              onClick={() => setOverflowOpen((open) => !open)}
              data-active={overflowOpen ? 'true' : undefined}
            >
              <MoreVertIcon fontSize="small" />
            </ToolbarIconButton>
          </Tooltip>
        </React.Fragment>
      ) : null}

      {/* Pinned end group. */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
        {exportGroup.render()}
      </div>

      {/* ---------------- Detached menus ---------------- */}
      <Menu anchorEl={densityAnchor} open={Boolean(densityAnchor)} onClose={handleDensityClose}>
        {DENSITY_ORDER.map((option) => (
          <MenuItem
            key={option}
            selected={option === density}
            onClick={() => handleDensitySelect(option)}
          >
            <ListItemIcon>
              {option === density ? <GridCheckIcon fontSize="small" /> : null}
            </ListItemIcon>
            <ListItemText primary={DENSITY_LABELS[option]} />
          </MenuItem>
        ))}
      </Menu>

      <Menu anchorEl={sortAnchor} open={Boolean(sortAnchor)} onClose={handleSortClose}>
        {sortModel.length === 0 ? (
          <MenuItem disabled>No active sorting</MenuItem>
        ) : (
          sortModel.map((item) => {
            const colDef = columns.find((c) => c.field === item.field);
            const label =
              (typeof colDef?.headerName === 'string' && colDef.headerName) || item.field;
            return (
              <MenuItem key={item.field} onClick={() => handleSortToggle(item.field)}>
                <ListItemIcon>
                  {item.sort === 'asc' ? (
                    <GridArrowUpwardIcon fontSize="small" />
                  ) : (
                    <GridArrowDownwardIcon fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText primary={label} />
                <IconButton
                  size="small"
                  aria-label={`Remove sort on ${label}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleSortRemove(item.field);
                  }}
                  sx={{ marginLeft: 1 }}
                >
                  <GridCloseIcon fontSize="small" />
                </IconButton>
              </MenuItem>
            );
          })
        )}
        {addableSortColumns.length > 0
          ? [
              <Divider key="sort-divider-add" />,
              <MenuItem key="sort-add-header" disabled sx={{ opacity: '1 !important', fontSize: '0.75rem' }}>
                Add column to sort
              </MenuItem>,
              ...addableSortColumns.slice(0, 10).map((col) => {
                const label =
                  (typeof col.headerName === 'string' && col.headerName) || col.field;
                return (
                  <MenuItem
                    key={`sort-add-${col.field}`}
                    onClick={() => {
                      handleSortAdd(col.field);
                      handleSortClose();
                    }}
                  >
                    <ListItemIcon>
                      <GridArrowUpwardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={label} />
                  </MenuItem>
                );
              }),
            ]
          : null}
        {sortModel.length > 0
          ? [
              <Divider key="sort-divider-clear" />,
              <MenuItem key="sort-clear" onClick={handleSortClear}>
                Clear sort
              </MenuItem>,
            ]
          : null}
      </Menu>

      <Menu anchorEl={groupAnchor} open={Boolean(groupAnchor)} onClose={handleGroupClose}>
        {groupingModel.length === 0 ? (
          <MenuItem disabled>No active grouping</MenuItem>
        ) : (
          groupingModel.map((field) => {
            const colDef = columns.find((c) => c.field === field);
            const label = (typeof colDef?.headerName === 'string' && colDef.headerName) || field;
            return (
              <MenuItem key={field} onClick={() => handleGroupRemove(field)}>
                <ListItemIcon>
                  <GridCloseIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={label} secondary="Remove" />
              </MenuItem>
            );
          })
        )}
        {addableGroupColumns.length > 0
          ? [
              <Divider key="group-divider-add" />,
              <MenuItem key="group-add-header" disabled sx={{ opacity: '1 !important', fontSize: '0.75rem' }}>
                Add grouping
              </MenuItem>,
              ...addableGroupColumns.slice(0, 10).map((col) => {
                const label =
                  (typeof col.headerName === 'string' && col.headerName) || col.field;
                return (
                  <MenuItem
                    key={`group-add-${col.field}`}
                    onClick={() => {
                      handleGroupAdd(col.field);
                      handleGroupClose();
                    }}
                  >
                    <ListItemIcon>
                      <GroupIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={label} />
                  </MenuItem>
                );
              }),
            ]
          : null}
        {groupingModel.length > 0
          ? [
              <Divider key="group-divider-clear" />,
              <MenuItem key="group-clear" onClick={handleGroupClear}>
                Clear grouping
              </MenuItem>,
            ]
          : null}
      </Menu>

      <Menu anchorEl={pinAnchor} open={Boolean(pinAnchor)} onClose={handlePinClose}>
        <MenuItem onClick={handlePinLeft} disabled={isPinnedLeft}>
          <ListItemIcon>
            <PinIcon fontSize="small" sx={{ transform: 'rotate(-45deg)' }} />
          </ListItemIcon>
          <ListItemText primary="Pin left" />
        </MenuItem>
        <MenuItem onClick={handlePinRight} disabled={isPinnedRight}>
          <ListItemIcon>
            <PinIcon fontSize="small" sx={{ transform: 'rotate(45deg)' }} />
          </ListItemIcon>
          <ListItemText primary="Pin right" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleUnpin} disabled={!isPinnedLeft && !isPinnedRight}>
          <ListItemIcon>
            <GridCloseIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Unpin" />
        </MenuItem>
      </Menu>

      <Menu anchorEl={aggAnchor} open={Boolean(aggAnchor)} onClose={handleAggClose}>
        {AGGREGATION_OPTIONS.map((option) => (
          <MenuItem key={option.value} onClick={() => handleAggSelect(option.value)}>
            {option.label}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleAggClear}>Clear aggregation</MenuItem>
      </Menu>

      <Menu anchorEl={exportAnchor} open={Boolean(exportAnchor)} onClose={handleExportClose}>
        <MenuItem onClick={handleExportCsv}>Download as CSV</MenuItem>
        {hasExcelExport ? (
          <MenuItem onClick={handleExportExcel}>Download as Excel</MenuItem>
        ) : null}
        <MenuItem onClick={handleExportPrint}>Print</MenuItem>
      </Menu>

      {/* Save view popper — inline name input anchored to the Save button. */}
      <Popper
        open={Boolean(saveViewAnchor)}
        anchorEl={saveViewAnchor}
        placement="bottom-start"
        modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
        sx={(theme) => ({ zIndex: theme.zIndex.modal })}
        transition
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={150}>
            <div>
              <ClickAwayListener onClickAway={handleSaveViewClose}>
                <SaveViewPopperPaper>
                  <SaveViewInput
                    autoFocus
                    size="small"
                    placeholder="View name"
                    value={saveViewName}
                    onChange={(event) => setSaveViewName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        handleSaveViewSubmit();
                      } else if (event.key === 'Escape') {
                        handleSaveViewClose();
                      }
                    }}
                  />
                  <Button size="small" variant="contained" onClick={handleSaveViewSubmit}>
                    Save
                  </Button>
                </SaveViewPopperPaper>
              </ClickAwayListener>
            </div>
          </Grow>
        )}
      </Popper>

      {/* Overflow popover — a "second row" of the toolbar pill. */}
      <Popper
        open={overflowOpen && showOverflowTrigger}
        anchorEl={overflowTriggerRef.current}
        placement="bottom-end"
        modifiers={[
          { name: 'offset', options: { offset: [0, 8] } },
          { name: 'preventOverflow', options: { padding: 8 } },
        ]}
        sx={(theme) => ({ zIndex: theme.zIndex.modal })}
        transition
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={150}>
            <div>
              <ClickAwayListener onClickAway={() => setOverflowOpen(false)}>
                <DataStudioToolbarOverflowPaper>
                  {renderGroups(overflowGroups, 'overflow', false)}
                </DataStudioToolbarOverflowPaper>
              </ClickAwayListener>
            </div>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}

export { DataStudioToolbar };
