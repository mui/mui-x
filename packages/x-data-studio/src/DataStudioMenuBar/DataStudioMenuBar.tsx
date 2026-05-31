'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import type { SxProps } from '@mui/system';
import { styled, useColorScheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
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
  PrintIcon,
  FunctionsIcon,
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
   * Whether the inline Data Grid is the active surface. `false` when a custom
   * view type (chart, pivot, …) owns the main pane — those bring their own grid,
   * so the menu bar's grid-bound menus would dereference a detached `apiRef`.
   * Defaults to `true` for backwards compatibility.
   * @default true
   */
  gridActive?: boolean;
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


const DataStudioMenuBarMenuStrip = styled('div', {
  name: 'MuiDataStudioMenuBar',
  slot: 'MenuStrip',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  // Match the toolbar's 16px left rail: 8px strip padding + 8px trigger padding
  // lines the "File" label up with the toolbar content gutter below it.
  padding: theme.spacing(0.5, 1),
  gap: theme.spacing(0.5),
}));

const DataStudioMenuBarMenuTrigger = styled(Button)(({ theme }) => ({
  minWidth: 0,
  height: 32,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 1),
  textTransform: 'none',
  fontWeight: 400,
  fontSize: '0.8125rem',
  lineHeight: 'normal',
  color: (theme.vars || theme).palette.text.primary,
  borderRadius: 4,
  transition: theme.transitions.create(['background-color', 'border-color', 'box-shadow'], {
    duration: theme.transitions.duration.shortest,
  }),
  '&:hover': {
    backgroundColor: theme.alpha((theme.vars || theme).palette.text.primary, 0.06),
  },
  '&[aria-expanded="true"]': {
    backgroundColor: (theme.vars || theme).palette.action.selected,
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
  const { apiRef, gridActive = true, classes: classesProp, sx, className } = props;
  const classes = useDataStudioMenuBarUtilityClasses(classesProp);

  // Same boot-order pattern as the toolbar: poll requestAnimationFrame until the grid binds
  // `apiRef.current` (the grid mounts as a sibling and the dataSource may load async).
  const [apiBound, setApiBound] = React.useState<boolean>(
    () => gridActive && Boolean(apiRef.current?.state),
  );
  React.useEffect(() => {
    // When the inline grid isn't the active surface (a custom view type owns
    // the pane), drop the binding so the grid-bound menus stop reading the
    // detached `apiRef`. Re-polling resumes when the grid becomes active again.
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
    <DataStudioMenuBarRoot className={clsx(classes.root, className)} sx={sx}>
      <DataStudioMenuBarMenuStrip
        className={classes.menuStrip}
        role="toolbar"
        aria-label="Menu bar"
      >
        {gridActive && apiBound ? (
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
