'use client';
import * as React from 'react';
import clsx from 'clsx';
import { alpha } from '@mui/material/styles';
import { createSvgIcon } from '@mui/material/utils';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import type { GridValidRowModel } from '@mui/x-data-grid';
import { styled } from '../internals/zero-styled';
import type { DataStudioClasses } from './dataStudioClasses';
import type { DataStudioDataset, DataStudioView } from './DataStudio.types';
import type { DataStudioStateApi } from './useDataStudioState';

const AddIcon = createSvgIcon(<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />, 'Add');
const MenuIcon = createSvgIcon(<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />, 'Menu');
const ArrowDropDownIcon = createSvgIcon(<path d="m7 10 5 5 5-5z" />, 'ArrowDropDown');
const CheckIcon = createSvgIcon(
  <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />,
  'Check',
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
const ChevronLeftIcon = createSvgIcon(
  <path d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />,
  'ChevronLeft',
);
const ChevronRightIcon = createSvgIcon(
  <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />,
  'ChevronRight',
);
const DoubleChevronLeftIcon = createSvgIcon(
  <path d="M18.41 7.41 17 6l-6 6 6 6 1.41-1.41L13.83 12l4.58-4.59zm-6 0L11 6l-6 6 6 6 1.41-1.41L7.83 12l4.58-4.59z" />,
  'DoubleChevronLeft',
);
const DoubleChevronRightIcon = createSvgIcon(
  <path d="M5.59 7.41 7 6l6 6-6 6-1.41-1.41L10.17 12 5.59 7.41zm6 0L13 6l6 6-6 6-1.41-1.41L16.17 12l-4.58-4.59z" />,
  'DoubleChevronRight',
);

// Pixel-cloned from Google Sheets' bottom tab strip:
//   - Light off-white bar (~background.default); thin top border, ~36px tall
//   - No vertical group dividers; small flat icon buttons
//   - Plain text tabs with an always-visible dropdown caret
//   - Active tab: white "pill" + medium weight + 1px divider outline (Sheets look)
//   - Right edge: single-arrow chevrons for scrolling overflow
const DataStudioTabBarRoot = styled('div', {
  name: 'MuiDataStudio',
  slot: 'TabBar',
  overridesResolver: (_, styles) => styles.tabBar,
})(({ theme }) => ({
  flex: '0 0 auto',
  display: 'flex',
  alignItems: 'center',
  borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundColor: (theme.vars || theme).palette.background.default,
  minHeight: 36,
  minWidth: 0,
  paddingLeft: theme.spacing(0.5),
  paddingRight: theme.spacing(0.5),
}));

const DataStudioTabBarActions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  flex: '0 0 auto',
  paddingRight: theme.spacing(0.5),
}));

const DataStudioTabBarActionIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  color: (theme.vars || theme).palette.text.secondary,
}));

const DataStudioTabBarTabs = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  // gap: theme.spacing(0.25),
  minWidth: 0,
  flex: 1,
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollBehavior: 'smooth',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
}));

const DataStudioTab = styled('div', {
  name: 'MuiDataStudio',
  slot: 'Tab',
  overridesResolver: (_, styles) => styles.tab,
  shouldForwardProp: (prop) => prop !== 'ownerActive' && prop !== 'ownerKind',
})<{ ownerActive?: boolean; ownerKind: 'dataset' | 'view' }>(({
  theme,
  ownerActive,
  ownerKind,
}) => {
  const isDataset = ownerKind === 'dataset';
  const primaryMain = theme.palette.primary.main;
  const primaryColor = (theme.vars || theme).palette.primary.main;
  const divider = (theme.vars || theme).palette.divider;
  const paper = (theme.vars || theme).palette.background.paper;

  // Active tab (most emphatic): primary-tinted background + primary text + primary outline.
  // Dataset chips (idle): paper "pill" with 1px divider outline — reads as a fixed data source.
  // View chips (idle): flat / no background — reads as a user sheet.
  let backgroundColor: string;
  let hoverBackgroundColor: string;
  let textColor: string;
  let boxShadow: string;
  let fontWeight = theme.typography.fontWeightMedium;
  if (ownerActive) {
    backgroundColor = alpha(primaryMain, 0.15);
    hoverBackgroundColor = alpha(primaryMain, 0.22);
    textColor = primaryColor;
    boxShadow = `inset 0 0 0 1px ${alpha(primaryMain, 0.6)}`;
    // fontWeight = theme.typography.fontWeightBold;
  } else if (isDataset) {
    backgroundColor = alpha(primaryMain, 0.05);
    hoverBackgroundColor = (theme.vars || theme).palette.action.hover;
    textColor = (theme.vars || theme).palette.text.primary;
    boxShadow = `inset 0 0 0 1px ${divider}`;
  } else {
    backgroundColor = 'transparent';
    hoverBackgroundColor = (theme.vars || theme).palette.action.hover;
    textColor = (theme.vars || theme).palette.text.secondary;
    boxShadow = 'none';
  }

  return {
    display: 'inline-flex',
    alignItems: 'center',
    height: 36,
    // borderRadius: 8,
    fontWeight,
    color: textColor,
    backgroundColor,
    boxShadow,
    // Keep weight stable across active/inactive so labels don't reflow when selection changes.
    fontSize: '0.8125rem',
    whiteSpace: 'nowrap',
    transition: theme.transitions.create(['background-color', 'box-shadow', 'color'], {
      duration: theme.transitions.duration.shortest,
    }),
    '&:hover': {
      backgroundColor: hoverBackgroundColor,
    },
  };
});

const DataStudioTabButton = styled('button')(({ theme }) => {
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
    gap: theme.spacing(0.5),
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

const DataStudioTabLabel = styled('span')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 160,
});

const DataStudioTabCaret = styled(IconButton, {
  name: 'MuiDataStudio',
  slot: 'TabActions',
  overridesResolver: (_, styles) => styles.tabActions,
})(({ theme }) => ({
  padding: 0,
  width: 18,
  height: 18,
  marginLeft: theme.spacing(-0.25),
  marginRight: theme.spacing(0.75),
  color: (theme.vars || theme).palette.text.secondary,
  borderRadius: 4,
  '& svg': { fontSize: 16 },
}));

const DataStudioTabRenameInput = styled(InputBase)(({ theme }) => ({
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

interface DataStudioTabBarProps<R extends GridValidRowModel> {
  classes: DataStudioClasses;
  datasets: DataStudioDataset<R>[];
  state: DataStudioStateApi<R>;
}

export function DataStudioTabBar<R extends GridValidRowModel = any>(
  props: DataStudioTabBarProps<R>,
) {
  const { classes, datasets, state } = props;
  const {
    views,
    activeDatasetId,
    activeViewId,
    selectDataset,
    selectView,
    addView,
    renameView,
    duplicateView,
    deleteView,
    moveView,
  } = state;

  const [renamingViewId, setRenamingViewId] = React.useState<string | null>(null);
  const [renameDraft, setRenameDraft] = React.useState('');
  const [menuState, setMenuState] = React.useState<{
    viewId: string;
    anchor: HTMLElement;
  } | null>(null);
  const [listAnchor, setListAnchor] = React.useState<HTMLElement | null>(null);
  const [datasetsCollapsed, setDatasetsCollapsed] = React.useState(false);

  const beginRename = (view: DataStudioView) => {
    setRenamingViewId(view.id);
    setRenameDraft(String(view.label ?? ''));
  };

  const commitRename = () => {
    if (renamingViewId === null) {
      return;
    }
    const trimmed = renameDraft.trim();
    if (trimmed.length > 0) {
      renameView(renamingViewId, trimmed);
    }
    setRenamingViewId(null);
  };

  const cancelRename = () => {
    setRenamingViewId(null);
  };

  const handleAddView = () => {
    addView();
  };

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
  }, [updateScrollState, datasets.length, views.length]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }
    el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' });
  };

  const handleOpenList = (event: React.MouseEvent<HTMLButtonElement>) => {
    setListAnchor(event.currentTarget);
  };
  const handleCloseList = () => {
    setListAnchor(null);
  };

  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>, viewId: string) => {
    event.stopPropagation();
    setMenuState({ viewId, anchor: event.currentTarget });
  };
  const handleCloseActions = () => {
    setMenuState(null);
  };

  const menuView = menuState ? (views.find((view) => view.id === menuState.viewId) ?? null) : null;
  const menuViewIndex = menuView ? views.findIndex((view) => view.id === menuView.id) : -1;

  const showScrollControls = canScrollLeft || canScrollRight;

  return (
    <DataStudioTabBarRoot className={classes.tabBar}>
      <DataStudioTabBarActions>
        <DataStudioTabBarActionIconButton
          className={classes.tabAddButton}
          size="small"
          aria-label="Add view"
          onClick={handleAddView}
          disabled={datasets.length === 0}
        >
          <AddIcon fontSize="small" />
        </DataStudioTabBarActionIconButton>
        <DataStudioTabBarActionIconButton
          className={classes.tabMenuButton}
          size="small"
          aria-label="All tabs"
          onClick={handleOpenList}
          disabled={datasets.length === 0 && views.length === 0}
        >
          <MenuIcon fontSize="small" />
        </DataStudioTabBarActionIconButton>
        {datasets.length > 0 ? (
          <DataStudioTabBarActionIconButton
            size="small"
            aria-label={datasetsCollapsed ? 'Show data sources' : 'Hide data sources'}
            aria-pressed={datasetsCollapsed}
            onClick={() => setDatasetsCollapsed((value) => !value)}
          >
            {datasetsCollapsed ? (
              <DoubleChevronRightIcon fontSize="small" />
            ) : (
              <DoubleChevronLeftIcon fontSize="small" />
            )}
          </DataStudioTabBarActionIconButton>
        ) : null}
      </DataStudioTabBarActions>
      <DataStudioTabBarTabs ref={scrollerRef}>
        {datasetsCollapsed
          ? null
          : datasets.map((dataset) => {
              const isActive = activeViewId === null && dataset.id === activeDatasetId;
              return (
                <DataStudioTab
                  key={dataset.id}
                  ownerKind="dataset"
                  ownerActive={isActive}
                  className={clsx(classes.tab, classes.tabDataset, isActive && classes.tabActive)}
                >
                  <DataStudioTabButton
                    type="button"
                    onClick={() => selectDataset(dataset.id)}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <DataStudioTabLabel>{dataset.label}</DataStudioTabLabel>
                  </DataStudioTabButton>
                </DataStudioTab>
              );
            })}
        {views.map((view) => {
          const isActive = view.id === activeViewId;
          const isEditing = view.id === renamingViewId;
          return (
            <DataStudioTab
              key={view.id}
              ownerKind="view"
              ownerActive={isActive}
              className={clsx(classes.tab, classes.tabView, isActive && classes.tabActive)}
            >
              {isEditing ? (
                <DataStudioTabRenameInput
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
                <DataStudioTabButton
                  type="button"
                  onClick={() => selectView(view.id)}
                  onDoubleClick={() => beginRename(view)}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <DataStudioTabLabel>{view.label}</DataStudioTabLabel>
                </DataStudioTabButton>
              )}
              {!isEditing ? (
                <DataStudioTabCaret
                  className={classes.tabActions}
                  aria-label={`View options for ${String(view.label)}`}
                  onClick={(event) => handleOpenActions(event, view.id)}
                >
                  <ArrowDropDownIcon fontSize="inherit" />
                </DataStudioTabCaret>
              ) : null}
            </DataStudioTab>
          );
        })}
      </DataStudioTabBarTabs>
      {showScrollControls ? (
        <DataStudioTabBarActions>
          <DataStudioTabBarActionIconButton
            size="small"
            aria-label="Scroll tabs left"
            onClick={() => scrollByPage(-1)}
            disabled={!canScrollLeft}
          >
            <ChevronLeftIcon fontSize="small" />
          </DataStudioTabBarActionIconButton>
          <DataStudioTabBarActionIconButton
            size="small"
            aria-label="Scroll tabs right"
            onClick={() => scrollByPage(1)}
            disabled={!canScrollRight}
          >
            <ChevronRightIcon fontSize="small" />
          </DataStudioTabBarActionIconButton>
        </DataStudioTabBarActions>
      ) : null}

      <Menu
        anchorEl={menuState?.anchor ?? null}
        open={Boolean(menuState)}
        onClose={handleCloseActions}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
              duplicateView(menuView.id);
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
              deleteView(menuView.id);
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
              moveView(menuView.id, -1);
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
              moveView(menuView.id, 1);
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
        anchorEl={listAnchor}
        open={Boolean(listAnchor)}
        onClose={handleCloseList}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {datasets.map((dataset) => {
          const isActive = activeViewId === null && dataset.id === activeDatasetId;
          return (
            <MenuItem
              key={`ds-${dataset.id}`}
              onClick={() => {
                selectDataset(dataset.id);
                handleCloseList();
              }}
            >
              <ListItemIcon>{isActive ? <CheckIcon fontSize="small" /> : null}</ListItemIcon>
              <ListItemText>{dataset.label}</ListItemText>
            </MenuItem>
          );
        })}
        {views.length > 0 ? <Divider /> : null}
        {views.map((view) => {
          const isActive = view.id === activeViewId;
          return (
            <MenuItem
              key={`v-${view.id}`}
              onClick={() => {
                selectView(view.id);
                handleCloseList();
              }}
            >
              <ListItemIcon>{isActive ? <CheckIcon fontSize="small" /> : null}</ListItemIcon>
              <ListItemText>{view.label}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </DataStudioTabBarRoot>
  );
}
