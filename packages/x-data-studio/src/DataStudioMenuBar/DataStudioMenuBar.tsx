'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import type { SxProps } from '@mui/system';
import { styled, useColorScheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  GridUndoIcon,
  GridRedoIcon,
  GridDownloadIcon,
  GridViewColumnIcon,
  GridFilterListIcon,
  GridCheckIcon,
  useGridSelector,
  type GridDensity,
} from '@mui/x-data-grid';
import type { RefObject } from '@mui/x-internals/types';
import {
  StarIcon,
  FolderIcon,
  CloudDoneIcon,
  HistoryIcon,
  AccountCircleIcon,
  VideoCamIcon,
  ShareIcon,
  SparkleIcon,
  PrintIcon,
  FunctionsIcon,
  InsertCommentIcon,
  BrightnessIcon,
  ChevronRightIcon,
} from '../DataStudioToolbar/icons';
import {
  useDataStudioMenuBarUtilityClasses,
  type DataStudioMenuBarClasses,
} from './dataStudioMenuBarClasses';

type ApiRefLike = RefObject<any | null>;

export interface DataStudioMenuBarProps {
  /**
   * Reference to the active grid's API. When `null`, menu items render in a disabled state.
   */
  apiRef: ApiRefLike;
  /**
   * Document title shown in the top row.
   */
  title?: React.ReactNode;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DataStudioMenuBarClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  className?: string;
}

const DataStudioMenuBarRoot = styled('div', {
  name: 'MuiDataStudioMenuBar',
  slot: 'Root',
})(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: (theme.vars || theme).palette.background.paper,
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

// Sizing tokens — pulled to the top so brand size, title indent and menu-strip
// indent stay in sync if any of them changes.
const MENU_BAR_HORIZONTAL_PADDING = 12; // px — same on the top row and the menu strip
const BRAND_SIZE = 36;
const BRAND_TITLE_GAP = 12;
// Where the title (and menu strip) start, measured from the menubar left edge.
const TITLE_INDENT = MENU_BAR_HORIZONTAL_PADDING + BRAND_SIZE + BRAND_TITLE_GAP;
const ICON_BUTTON_SIZE = 32;
const RIGHT_CLUSTER_ICON = 20;

const DataStudioMenuBarTopRow = styled('div', {
  name: 'MuiDataStudioMenuBar',
  slot: 'TopRow',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 1.5),
  gap: `${BRAND_TITLE_GAP}px`,
  minHeight: 48,
}));

const DataStudioMenuBarBrand = styled('div', {
  name: 'MuiDataStudioMenuBar',
  slot: 'Brand',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: BRAND_SIZE,
  height: BRAND_SIZE,
  borderRadius: 8,
  backgroundColor: '#16a05b',
  color: theme.palette.common.white,
  fontSize: '1.125rem',
  fontWeight: 700,
  flex: '0 0 auto',
}));

const DataStudioMenuBarTitleWrapper = styled('div', {
  name: 'MuiDataStudioMenuBar',
  slot: 'Title',
})({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  flex: '0 1 auto',
});

const DataStudioMenuBarTitleRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  minWidth: 0,
}));

const DataStudioMenuBarTitleText = styled(Typography)({
  fontSize: '1.125rem',
  fontWeight: 500,
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const DataStudioMenuBarStatus = styled('div', {
  name: 'MuiDataStudioMenuBar',
  slot: 'TitleStatus',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  marginLeft: theme.spacing(0.5),
  color: (theme.vars || theme).palette.text.secondary,
  '& .MuiIconButton-root': {
    width: 28,
    height: 28,
    padding: 4,
  },
}));

const DataStudioMenuBarSpacer = styled('div')({
  flex: '1 1 auto',
});

const DataStudioMenuBarRightCluster = styled('div', {
  name: 'MuiDataStudioMenuBar',
  slot: 'RightCluster',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  flex: '0 0 auto',
  color: (theme.vars || theme).palette.text.secondary,
  '& .MuiIconButton-root': {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    padding: (ICON_BUTTON_SIZE - RIGHT_CLUSTER_ICON) / 2,
    color: 'inherit',
  },
}));

const DataStudioMenuBarMenuStrip = styled('div', {
  name: 'MuiDataStudioMenuBar',
  slot: 'MenuStrip',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  // Match the top-row horizontal padding so the strip sits flush with the title's
  // text baseline (TITLE_INDENT accounts for padding + brand width + gap).
  padding: theme.spacing(0.5, 1),
  // paddingLeft: TITLE_INDENT,
  gap: theme.spacing(0.25),
}));

const DataStudioMenuBarMenuTrigger = styled(Button)(({ theme }) => ({
  minWidth: 0,
  height: 28,
  padding: theme.spacing(0, 1),
  textTransform: 'none',
  fontWeight: 400,
  fontSize: '0.8125rem',
  lineHeight: 1,
  color: (theme.vars || theme).palette.text.primary,
  borderRadius: 4,
}));

const DataStudioMenuBarShareButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: 999,
  padding: theme.spacing(0.5, 2),
  fontWeight: 500,
  fontSize: '0.875rem',
  backgroundColor: '#c2e7ff',
  color: '#001d35',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#a8d6f2',
    boxShadow: 'none',
  },
  '&.Mui-disabled': {
    backgroundColor: '#c2e7ff',
    color: '#001d35',
    opacity: 0.65,
  },
}));

const DataStudioMenuBarUpgradeButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: 999,
  padding: theme.spacing(0.5, 1.75),
  fontWeight: 500,
  fontSize: '0.875rem',
  color: (theme.vars || theme).palette.text.primary,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundColor: 'transparent',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
    boxShadow: 'none',
  },
  '&.Mui-disabled': {
    color: (theme.vars || theme).palette.text.primary,
    border: `1px solid ${(theme.vars || theme).palette.divider}`,
    backgroundColor: 'transparent',
    opacity: 0.7,
  },
}));

const DENSITY_LABELS: Record<GridDensity, string> = {
  compact: 'Compact',
  standard: 'Standard',
  comfortable: 'Comfortable',
};

const DENSITY_ORDER: GridDensity[] = ['compact', 'standard', 'comfortable'];

type ThemeModeValue = 'system' | 'light' | 'dark';

const THEME_MODES: Array<{ value: ThemeModeValue; label: string }> = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const historyEnabledSelector = (apiRef: ApiRefLike) =>
  Boolean(apiRef.current?.state?.history?.enabled);

const historyCanUndoSelector = (apiRef: ApiRefLike) =>
  (apiRef.current?.state?.history?.currentPosition ?? -1) >= 0;

const historyCanRedoSelector = (apiRef: ApiRefLike) => {
  const stack = apiRef.current?.state?.history?.stack;
  const pos = apiRef.current?.state?.history?.currentPosition ?? -1;
  return Array.isArray(stack) && pos < stack.length - 1;
};

const gridDensityPathSelector = (apiRef: ApiRefLike): GridDensity =>
  (apiRef.current?.state?.density as GridDensity) ?? 'standard';

type MenuName = 'file' | 'edit' | 'view' | 'insert' | 'format' | 'data' | 'tools' | 'help';

const MENU_LABELS: Record<MenuName, string> = {
  file: 'File',
  edit: 'Edit',
  view: 'View',
  insert: 'Insert',
  format: 'Format',
  data: 'Data',
  tools: 'Tools',
  help: 'Help',
};

const MENU_ORDER: MenuName[] = [
  'file',
  'edit',
  'view',
  'insert',
  'format',
  'data',
  'tools',
  'help',
];

function DataStudioMenuBar(props: DataStudioMenuBarProps) {
  const { apiRef, title, classes: classesProp, sx, className } = props;
  const classes = useDataStudioMenuBarUtilityClasses(classesProp);

  // Same boot-order pattern as the toolbar: poll requestAnimationFrame until the grid binds
  // `apiRef.current` (the grid mounts as a sibling and the dataset may load async).
  const [apiBound, setApiBound] = React.useState<boolean>(() => Boolean(apiRef.current?.state));
  React.useEffect(() => {
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
  }, [apiRef, apiBound]);

  return (
    <DataStudioMenuBarRoot className={clsx(classes.root, className)} sx={sx}>
      {/* <DataStudioMenuBarTopRow className={classes.topRow}>
        <DataStudioMenuBarBrand className={classes.brand} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 3h12l6 6v12H3z" opacity="0.95" />
            <path d="M15 3v6h6" fill="white" opacity="0.45" />
          </svg>
        </DataStudioMenuBarBrand>
        <DataStudioMenuBarTitleWrapper className={classes.title}>
          <DataStudioMenuBarTitleRow>
            <DataStudioMenuBarTitleText>{title ?? 'Untitled studio'}</DataStudioMenuBarTitleText>
            <DataStudioMenuBarStatus className={classes.titleStatus}>
              <Tooltip title="Add to favorites (coming soon)">
                <span>
                  <IconButton size="small" disabled aria-label="Favorite">
                    <StarIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Move (coming soon)">
                <span>
                  <IconButton size="small" disabled aria-label="Move">
                    <FolderIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Saved locally">
                <IconButton size="small" aria-label="Saved">
                  <CloudDoneIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </DataStudioMenuBarStatus>
          </DataStudioMenuBarTitleRow>
        </DataStudioMenuBarTitleWrapper>
        <DataStudioMenuBarSpacer />
        <DataStudioMenuBarRightCluster className={classes.rightCluster}>
          <Tooltip title="Version history (coming soon)">
            <span>
              <IconButton size="small" disabled aria-label="Version history">
                <HistoryIcon sx={{ fontSize: RIGHT_CLUSTER_ICON }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Open chat (coming soon)">
            <span>
              <IconButton size="small" disabled aria-label="Open chat">
                <InsertCommentIcon sx={{ fontSize: RIGHT_CLUSTER_ICON }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Start a meeting (coming soon)">
            <span>
              <IconButton size="small" disabled aria-label="Meeting">
                <VideoCamIcon sx={{ fontSize: RIGHT_CLUSTER_ICON }} />
              </IconButton>
            </span>
          </Tooltip>
          <DataStudioMenuBarShareButton
            disableElevation
            startIcon={<ShareIcon sx={{ fontSize: 18 }} />}
            disabled
          >
            Share
          </DataStudioMenuBarShareButton>
          <DataStudioMenuBarUpgradeButton
            disableElevation
            startIcon={<SparkleIcon sx={{ fontSize: 18 }} />}
            disabled
          >
            Upgrade
          </DataStudioMenuBarUpgradeButton>
          <Tooltip title="AI assistant (coming soon)">
            <span>
              <IconButton size="small" disabled aria-label="AI assistant">
                <SparkleIcon sx={{ fontSize: RIGHT_CLUSTER_ICON }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Account">
            <span>
              <IconButton size="small" disabled aria-label="Account">
                <AccountCircleIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </span>
          </Tooltip>
        </DataStudioMenuBarRightCluster>
      </DataStudioMenuBarTopRow> */}
      <DataStudioMenuBarMenuStrip className={classes.menuStrip} role="menubar">
        {apiBound ? (
          <ActiveMenuStrip apiRef={apiRef} classes={classes} />
        ) : (
          <DisabledMenuStrip classes={classes} />
        )}
      </DataStudioMenuBarMenuStrip>
    </DataStudioMenuBarRoot>
  );
}

DataStudioMenuBar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({ current: PropTypes.any }),
  classes: PropTypes.object,
  className: PropTypes.string,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  title: PropTypes.node,
} as any;

function DisabledMenuStrip({ classes }: { classes: DataStudioMenuBarClasses }) {
  return (
    <React.Fragment>
      {MENU_ORDER.map((name) => (
        <DataStudioMenuBarMenuTrigger
          key={name}
          className={classes.menuTrigger}
          disabled
          aria-label={MENU_LABELS[name]}
        >
          {MENU_LABELS[name]}
        </DataStudioMenuBarMenuTrigger>
      ))}
    </React.Fragment>
  );
}

function ActiveMenuStrip({
  apiRef,
  classes,
}: {
  apiRef: ApiRefLike;
  classes: DataStudioMenuBarClasses;
}) {
  const [openMenu, setOpenMenu] = React.useState<MenuName | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [themeAnchor, setThemeAnchor] = React.useState<HTMLElement | null>(null);

  // `useColorScheme()` is the supported entry point for switching MUI's CSS-variables
  // color modes. When the host app is not wrapped in `CssVarsProvider`, the hook returns
  // an empty `allColorSchemes` and `setMode` is a no-op — we use that signal to disable
  // the menu item with a tooltip instead of presenting controls that do nothing.
  const { mode, setMode, allColorSchemes } = useColorScheme();
  const supportsColorScheme = Array.isArray(allColorSchemes) && allColorSchemes.length > 0;

  const handleOpen = (name: MenuName) => (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenu(name);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setOpenMenu(null);
    setAnchorEl(null);
    setThemeAnchor(null);
  };

  const handleOpenThemeSubmenu = (event: React.MouseEvent<HTMLElement>) => {
    setThemeAnchor(event.currentTarget);
  };
  const handleCloseThemeSubmenu = () => {
    setThemeAnchor(null);
  };
  const handleSelectThemeMode = (value: ThemeModeValue) => {
    setMode(value);
    setThemeAnchor(null);
    handleClose();
  };

  const canUndo = useGridSelector(apiRef, historyCanUndoSelector);
  const canRedo = useGridSelector(apiRef, historyCanRedoSelector);
  const historyEnabled = useGridSelector(apiRef, historyEnabledSelector);
  const density = useGridSelector(apiRef, gridDensityPathSelector);

  const hasExcelExport = typeof apiRef.current?.exportDataAsExcel === 'function';
  const hasAggregation = typeof apiRef.current?.setAggregationModel === 'function';

  const exec = (fn: () => void) => () => {
    handleClose();
    fn();
  };

  return (
    <React.Fragment>
      {MENU_ORDER.map((name) => (
        <DataStudioMenuBarMenuTrigger
          key={name}
          className={classes.menuTrigger}
          aria-haspopup="true"
          aria-expanded={openMenu === name}
          onClick={handleOpen(name)}
        >
          {MENU_LABELS[name]}
        </DataStudioMenuBarMenuTrigger>
      ))}

      <Menu anchorEl={anchorEl} open={openMenu === 'file'} onClose={handleClose}>
        <MenuItem onClick={exec(() => apiRef.current?.exportDataAsCsv?.())}>
          <ListItemIcon>
            <GridDownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Download as CSV" />
        </MenuItem>
        {hasExcelExport ? (
          <MenuItem onClick={exec(() => apiRef.current?.exportDataAsExcel?.())}>
            <ListItemIcon>
              <GridDownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Download as Excel" />
          </MenuItem>
        ) : null}
        <Divider />
        <MenuItem onClick={exec(() => apiRef.current?.exportDataAsPrint?.())}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Print" />
        </MenuItem>
      </Menu>

      <Menu anchorEl={anchorEl} open={openMenu === 'edit'} onClose={handleClose}>
        <MenuItem
          disabled={!historyEnabled || !canUndo}
          onClick={exec(() => apiRef.current?.history?.undo?.())}
        >
          <ListItemIcon>
            <GridUndoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Undo" />
        </MenuItem>
        <MenuItem
          disabled={!historyEnabled || !canRedo}
          onClick={exec(() => apiRef.current?.history?.redo?.())}
        >
          <ListItemIcon>
            <GridRedoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Redo" />
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <ListItemText primary="Copy" secondary="⌘C" />
        </MenuItem>
        <MenuItem disabled>
          <ListItemText primary="Paste" secondary="⌘V" />
        </MenuItem>
      </Menu>

      <Menu anchorEl={anchorEl} open={openMenu === 'view'} onClose={handleClose}>
        <MenuItem disabled>
          <ListItemText primary="Density" />
        </MenuItem>
        {DENSITY_ORDER.map((option) => (
          <MenuItem
            key={option}
            selected={option === density}
            onClick={exec(() => apiRef.current?.setDensity?.(option))}
            sx={{ pl: 4 }}
          >
            <ListItemIcon>
              {option === density ? <GridCheckIcon fontSize="small" /> : null}
            </ListItemIcon>
            <ListItemText primary={DENSITY_LABELS[option]} />
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={exec(() => apiRef.current?.showPreferences?.('columns'))}>
          <ListItemIcon>
            <GridViewColumnIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Show columns…" />
        </MenuItem>
        <Divider />
        {supportsColorScheme ? (
          <MenuItem
            onClick={handleOpenThemeSubmenu}
            aria-haspopup="true"
            aria-expanded={Boolean(themeAnchor)}
          >
            <ListItemIcon>
              <BrightnessIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Theme mode" />
            <ChevronRightIcon fontSize="small" />
          </MenuItem>
        ) : (
          <Tooltip
            title="Theme mode is available when the host app uses CssVarsProvider"
            placement="right"
          >
            <span>
              <MenuItem disabled>
                <ListItemIcon>
                  <BrightnessIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Theme mode" />
                <ChevronRightIcon fontSize="small" />
              </MenuItem>
            </span>
          </Tooltip>
        )}
      </Menu>

      <Menu
        anchorEl={themeAnchor}
        open={Boolean(themeAnchor)}
        onClose={handleCloseThemeSubmenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {THEME_MODES.map(({ value, label }) => (
          <MenuItem
            key={value}
            selected={mode === value}
            onClick={() => handleSelectThemeMode(value)}
          >
            <ListItemIcon>
              {mode === value ? <GridCheckIcon fontSize="small" /> : null}
            </ListItemIcon>
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Menu>

      <Menu anchorEl={anchorEl} open={openMenu === 'insert'} onClose={handleClose}>
        <MenuItem disabled>
          <ListItemText primary="Insert link" />
        </MenuItem>
        <MenuItem disabled>
          <ListItemText primary="Insert comment" />
        </MenuItem>
        <MenuItem disabled>
          <ListItemText primary="Insert chart" />
        </MenuItem>
      </Menu>

      <Menu anchorEl={anchorEl} open={openMenu === 'format'} onClose={handleClose}>
        <MenuItem disabled>
          <ListItemText primary="Format" secondary="Configured per-column at column definition" />
        </MenuItem>
      </Menu>

      <Menu anchorEl={anchorEl} open={openMenu === 'data'} onClose={handleClose}>
        <MenuItem onClick={exec(() => apiRef.current?.showFilterPanel?.())}>
          <ListItemIcon>
            <GridFilterListIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Create a filter" />
        </MenuItem>
        {hasAggregation ? (
          <MenuItem
            onClick={exec(() => {
              // Apply sum to every numeric column for a quick win; users can refine via the
              // toolbar Σ menu or column header menus.
              const lookup = apiRef.current?.state?.columns?.lookup ?? {};
              const order = apiRef.current?.state?.columns?.orderedFields ?? [];
              const model: Record<string, string> = {};
              for (const field of order) {
                if (lookup[field]?.type === 'number') {
                  model[field] = 'sum';
                }
              }
              apiRef.current?.setAggregationModel?.(model);
            })}
          >
            <ListItemIcon>
              <FunctionsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Sum all numeric columns" />
          </MenuItem>
        ) : null}
      </Menu>

      <Menu anchorEl={anchorEl} open={openMenu === 'tools'} onClose={handleClose}>
        <MenuItem disabled>
          <ListItemText primary="Tools" secondary="Coming soon" />
        </MenuItem>
      </Menu>

      <Menu anchorEl={anchorEl} open={openMenu === 'help'} onClose={handleClose}>
        <MenuItem
          component="a"
          href="https://mui.com/x/react-data-studio/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClose}
        >
          <ListItemText primary="Data Studio documentation" />
        </MenuItem>
        <MenuItem
          component="a"
          href="https://mui.com/x/react-data-grid/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClose}
        >
          <ListItemText primary="Data Grid documentation" />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export { DataStudioMenuBar };
