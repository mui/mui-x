'use client';
import * as React from 'react';
import clsx from 'clsx';
import { createSvgIcon } from '@mui/material/utils';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { styled } from '../internals/zero-styled';
import type { DataStudioClasses } from './dataStudioClasses';
import type { DataStudioSheet, DataStudioSheetTemplate } from './DataStudio.types';

const AddIcon = createSvgIcon(<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />, 'Add');
const ArrowDropDownIcon = createSvgIcon(<path d="m7 10 5 5 5-5z" />, 'ArrowDropDown');
const ChevronLeftIcon = createSvgIcon(
  <path d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />,
  'ChevronLeft',
);
const ChevronRightIcon = createSvgIcon(
  <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />,
  'ChevronRight',
);
const EditIcon = createSvgIcon(
  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.9959.9959 0 0 0 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />,
  'Edit',
);
const ContentCopyIcon = createSvgIcon(
  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />,
  'ContentCopy',
);
const DeleteIcon = createSvgIcon(
  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />,
  'Delete',
);

// View-type glyphs (currentColor). Keyed by `sheet.type`; the implicit Table
// view and the default `'grid'` type share the table glyph.
const TableIcon = createSvgIcon(
  <path d="M10 10.02h5V21h-5V10.02zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H5c-1.1 0-2 .9-2 2v3h19V5c0-1.1-.9-2-2-2zM3 19c0 1.1.9 2 2 2h3V10H3v9z" />,
  'Table',
);
const ChartGlyph = createSvgIcon(
  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />,
  'ChartView',
);
const PivotGlyph = createSvgIcon(
  <path d="M3 3h18v18H3V3zm2 2v4h4V5H5zm6 0v4h8V5h-8zM5 11v8h4v-8H5zm6 0v8h8v-8h-8z" />,
  'PivotView',
);
const DashboardGlyph = createSvgIcon(
  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />,
  'DashboardView',
);
const SpreadsheetGlyph = createSvgIcon(
  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h14v14H5zm2-8h4v2H7v-2zm0 4h4v2H7v-2zm6-4h4v2h-4v-2zm0 4h4v2h-4v-2zM7 7h10v2H7V7z" />,
  'SpreadsheetView',
);

function getViewTypeIcon(type: string | undefined): React.ReactNode {
  switch (type) {
    case 'chart':
      return <ChartGlyph fontSize="inherit" />;
    case 'pivot':
      return <PivotGlyph fontSize="inherit" />;
    case 'dashboard':
      return <DashboardGlyph fontSize="inherit" />;
    case 'spreadsheet':
      return <SpreadsheetGlyph fontSize="inherit" />;
    default:
      return <TableIcon fontSize="inherit" />;
  }
}

// Notion-style view tab strip rendered on top of a dataset:
//   - 40px bar, bottom divider, paper background
//   - 32px pill tabs; active = primary-tinted fill + medium weight + primary text
//   - leading view-type glyph; per-view caret opens rename/duplicate/delete/move
//   - leading non-deletable "Table" tab (the dataset's raw grid)
//   - "+" opens a view-type menu (plan-gated templates) and the AI composer
const DataStudioViewTabBarRoot = styled('div', {
  name: 'MuiDataStudio',
  slot: 'ViewTabBar',
  overridesResolver: (_, styles) => styles.viewTabBar,
})(({ theme }) => ({
  flex: '0 0 auto',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  minHeight: 40,
  minWidth: 0,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundColor: (theme.vars || theme).palette.background.paper,
}));

const DataStudioViewTabBarScroller = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  minWidth: 0,
  flex: 1,
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollBehavior: 'smooth',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
});

const DataStudioViewTab = styled('div', {
  name: 'MuiDataStudio',
  slot: 'ViewTab',
  overridesResolver: (_, styles) => styles.viewTab,
  shouldForwardProp: (prop) => prop !== 'ownerActive',
})<{ ownerActive?: boolean }>(({ theme, ownerActive }) => {
  const primaryMain = (theme.vars || theme).palette.primary.main;
  return {
    display: 'inline-flex',
    alignItems: 'center',
    flex: '0 0 auto',
    height: 32,
    borderRadius: 8,
    color: ownerActive
      ? (theme.vars || theme).palette.text.primary
      : (theme.vars || theme).palette.text.secondary,
    backgroundColor: ownerActive ? theme.alpha(primaryMain, 0.1) : 'transparent',
    fontWeight: ownerActive
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
    fontSize: '0.8125rem',
    whiteSpace: 'nowrap',
    transition: theme.transitions.create(['background-color', 'color'], {
      duration: theme.transitions.duration.shortest,
    }),
    '&:hover': {
      backgroundColor: ownerActive
        ? theme.alpha(primaryMain, 0.16)
        : (theme.vars || theme).palette.action.hover,
    },
  };
});

const DataStudioViewTabButton = styled('button')(({ theme }) => {
  const primaryColor = (theme.vars || theme).palette.primary.main;
  return {
    appearance: 'none',
    border: 0,
    background: 'transparent',
    color: 'inherit',
    font: 'inherit',
    fontWeight: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    padding: theme.spacing(0, 1.25),
    borderRadius: 'inherit',
    height: '100%',
    minWidth: 0,
    '&:focus-visible': {
      outline: `2px solid ${primaryColor}`,
      outlineOffset: -2,
    },
  };
});

const DataStudioViewTabIcon = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: 16,
  flex: '0 0 auto',
});

const DataStudioViewTabLabel = styled('span')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 160,
});

const DataStudioViewTabCaret = styled(IconButton, {
  name: 'MuiDataStudio',
  slot: 'ViewTabActions',
  overridesResolver: (_, styles) => styles.viewTabActions,
})(({ theme }) => ({
  padding: 0,
  width: 22,
  height: 22,
  marginLeft: theme.spacing(-0.5),
  marginRight: theme.spacing(0.5),
  color: 'inherit',
  borderRadius: theme.shape.borderRadius,
  '& svg': { fontSize: 18 },
}));

const DataStudioViewTabRenameInput = styled(InputBase)(({ theme }) => ({
  font: 'inherit',
  color: 'inherit',
  padding: theme.spacing(0, 1.25),
  '& input': {
    padding: 0,
    width: 120,
    height: 'auto',
    font: 'inherit',
    color: 'inherit',
  },
}));

const DataStudioViewTabAddButton = styled(IconButton, {
  name: 'MuiDataStudio',
  slot: 'ViewTabAddButton',
  overridesResolver: (_, styles) => styles.viewTabAddButton,
})(({ theme }) => ({
  flex: '0 0 auto',
  width: 28,
  height: 28,
  padding: theme.spacing(0.5),
  borderRadius: 8,
  color: (theme.vars || theme).palette.text.secondary,
}));

const DataStudioViewTabBarScrollButton = styled(IconButton)(({ theme }) => ({
  flex: '0 0 auto',
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  color: (theme.vars || theme).palette.text.secondary,
}));

export interface DataStudioViewTabBarProps {
  classes: DataStudioClasses;
  /** Views scoped to the active dataset (plus any free-form views). */
  views: DataStudioSheet[];
  /** The active view id, or `null` when the Table view is active. */
  activeViewId: string | null;
  /** Whether a dataset is active (gates the Table tab + add button). */
  hasActiveDataSource: boolean;
  /** Templates surfaced in the "+" menu (plan-gated, resolved upstream). */
  templates: DataStudioSheetTemplate[];
  /** Whether the AI composer entry is offered in the "+" menu. */
  promptEnabled: boolean;
  /** Select the dataset's implicit Table view (its raw grid). */
  onSelectTable: () => void;
  onSelectView: (viewId: string) => void;
  onAddFromTemplate: (templateId: string) => void;
  onStartComposing: () => void;
  onRenameView: (viewId: string, label: string) => void;
  onDuplicateView: (viewId: string) => void;
  onDeleteView: (viewId: string) => void;
  // Move a view one position left/right among the dataset's views.
  onMoveView: (viewId: string, direction: -1 | 1) => void;
}

export function DataStudioViewTabBar(props: DataStudioViewTabBarProps) {
  const {
    classes,
    views,
    activeViewId,
    hasActiveDataSource,
    templates,
    promptEnabled,
    onSelectTable,
    onSelectView,
    onAddFromTemplate,
    onStartComposing,
    onRenameView,
    onDuplicateView,
    onDeleteView,
    onMoveView,
  } = props;

  const [renamingViewId, setRenamingViewId] = React.useState<string | null>(null);
  const [renameDraft, setRenameDraft] = React.useState('');
  const [menuState, setMenuState] = React.useState<{ viewId: string; anchor: HTMLElement } | null>(
    null,
  );
  const [addAnchor, setAddAnchor] = React.useState<HTMLElement | null>(null);

  const beginRename = (view: DataStudioSheet) => {
    setRenamingViewId(view.id);
    setRenameDraft(String(view.label ?? ''));
  };
  const commitRename = () => {
    if (renamingViewId === null) {
      return;
    }
    const trimmed = renameDraft.trim();
    if (trimmed.length > 0) {
      onRenameView(renamingViewId, trimmed);
    }
    setRenamingViewId(null);
  };
  const cancelRename = () => setRenamingViewId(null);

  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>, viewId: string) => {
    event.stopPropagation();
    setMenuState({ viewId, anchor: event.currentTarget });
  };
  const handleCloseActions = () => setMenuState(null);

  const menuView = menuState ? (views.find((view) => view.id === menuState.viewId) ?? null) : null;
  const menuViewIndex = menuView ? views.findIndex((view) => view.id === menuView.id) : -1;

  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const updateScrollState = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  React.useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) {
      return undefined;
    }
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateScrollState);
    observer?.observe(el);
    Array.from(el.children).forEach((child) => observer?.observe(child));
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      observer?.disconnect();
    };
  }, [updateScrollState, views.length]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }
    el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' });
  };

  const showScrollControls = canScrollLeft || canScrollRight;
  const tableActive = activeViewId === null;

  return (
    <DataStudioViewTabBarRoot className={classes.viewTabBar} role="tablist" aria-label="Views">
      <DataStudioViewTabBarScroller ref={scrollerRef}>
        {hasActiveDataSource ? (
          <DataStudioViewTab
            ownerActive={tableActive}
            className={clsx(
              classes.viewTab,
              classes.viewTabTable,
              tableActive && classes.viewTabActive,
            )}
          >
            <DataStudioViewTabButton
              type="button"
              role="tab"
              aria-selected={tableActive}
              onClick={onSelectTable}
            >
              <DataStudioViewTabIcon>{getViewTypeIcon(undefined)}</DataStudioViewTabIcon>
              <DataStudioViewTabLabel>Table</DataStudioViewTabLabel>
            </DataStudioViewTabButton>
          </DataStudioViewTab>
        ) : null}
        {views.map((view) => {
          const isActive = view.id === activeViewId;
          const isEditing = view.id === renamingViewId;
          return (
            <DataStudioViewTab
              key={view.id}
              ownerActive={isActive}
              className={clsx(classes.viewTab, isActive && classes.viewTabActive)}
            >
              {isEditing ? (
                <DataStudioViewTabRenameInput
                  autoFocus
                  value={renameDraft}
                  onChange={(event) => setRenameDraft(event.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      commitRename();
                    } else if (event.key === 'Escape') {
                      event.preventDefault();
                      cancelRename();
                    }
                  }}
                  inputProps={{ 'aria-label': 'Rename view' }}
                />
              ) : (
                <DataStudioViewTabButton
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelectView(view.id)}
                  onDoubleClick={() => beginRename(view)}
                >
                  <DataStudioViewTabIcon>{getViewTypeIcon(view.type)}</DataStudioViewTabIcon>
                  <DataStudioViewTabLabel>{view.label}</DataStudioViewTabLabel>
                </DataStudioViewTabButton>
              )}
              {!isEditing ? (
                <DataStudioViewTabCaret
                  className={classes.viewTabActions}
                  aria-label={`View options for ${String(view.label)}`}
                  onClick={(event) => handleOpenActions(event, view.id)}
                >
                  <ArrowDropDownIcon fontSize="inherit" />
                </DataStudioViewTabCaret>
              ) : null}
            </DataStudioViewTab>
          );
        })}
      </DataStudioViewTabBarScroller>

      {showScrollControls ? (
        <React.Fragment>
          <DataStudioViewTabBarScrollButton
            size="small"
            aria-label="Scroll views left"
            onClick={() => scrollByPage(-1)}
            disabled={!canScrollLeft}
          >
            <ChevronLeftIcon fontSize="small" />
          </DataStudioViewTabBarScrollButton>
          <DataStudioViewTabBarScrollButton
            size="small"
            aria-label="Scroll views right"
            onClick={() => scrollByPage(1)}
            disabled={!canScrollRight}
          >
            <ChevronRightIcon fontSize="small" />
          </DataStudioViewTabBarScrollButton>
        </React.Fragment>
      ) : null}

      <DataStudioViewTabAddButton
        className={classes.viewTabAddButton}
        size="small"
        aria-label="Add view"
        aria-haspopup="true"
        aria-expanded={Boolean(addAnchor)}
        onClick={(event) => setAddAnchor(event.currentTarget)}
        disabled={!hasActiveDataSource}
      >
        <AddIcon fontSize="small" />
      </DataStudioViewTabAddButton>

      <Menu
        anchorEl={menuState?.anchor ?? null}
        open={Boolean(menuState)}
        onClose={handleCloseActions}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem
          onClick={() => {
            if (menuView) {
              beginRename(menuView);
            }
            handleCloseActions();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuView) {
              onDuplicateView(menuView.id);
            }
            handleCloseActions();
          }}
        >
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuView) {
              onDeleteView(menuView.id);
            }
            handleCloseActions();
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          disabled={menuViewIndex <= 0}
          onClick={() => {
            if (menuView) {
              onMoveView(menuView.id, -1);
            }
            handleCloseActions();
          }}
        >
          <ListItemIcon>
            <ChevronLeftIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move left</ListItemText>
        </MenuItem>
        <MenuItem
          disabled={menuViewIndex === -1 || menuViewIndex >= views.length - 1}
          onClick={() => {
            if (menuView) {
              onMoveView(menuView.id, 1);
            }
            handleCloseActions();
          }}
        >
          <ListItemIcon>
            <ChevronRightIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move right</ListItemText>
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={addAnchor}
        open={Boolean(addAnchor)}
        onClose={() => setAddAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {templates.map((template) => {
          const TemplateIcon = template.icon;
          return (
            <MenuItem
              key={template.id}
              onClick={() => {
                onAddFromTemplate(template.id);
                setAddAnchor(null);
              }}
            >
              {TemplateIcon ? (
                <ListItemIcon>
                  <TemplateIcon />
                </ListItemIcon>
              ) : null}
              <ListItemText primary={template.label} secondary={template.description} />
            </MenuItem>
          );
        })}
        {promptEnabled ? <Divider /> : null}
        {promptEnabled ? (
          <MenuItem
            onClick={() => {
              onStartComposing();
              setAddAnchor(null);
            }}
          >
            <ListItemText primary="Ask Copilot…" />
          </MenuItem>
        ) : null}
      </Menu>
    </DataStudioViewTabBarRoot>
  );
}
