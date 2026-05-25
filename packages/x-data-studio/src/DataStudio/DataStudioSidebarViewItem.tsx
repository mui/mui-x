'use client';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { createSvgIcon } from '@mui/material/utils';
import { styled } from '../internals/zero-styled';
import type { DataStudioView } from './DataStudio.types';
import type { DataStudioStateApi } from './useDataStudioState';

const MoreHorizIcon = createSvgIcon(
  <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />,
  'MoreHoriz',
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
const ArrowUpIcon = createSvgIcon(
  <path d="m7.41 15.41 4.59-4.58 4.59 4.58L18 14l-6-6-6 6z" />,
  'ArrowDropUp',
);
const ArrowDownIcon = createSvgIcon(<path d="m7 10 5 5 5-5z" />, 'ArrowDropDown');

const SIDEBAR_VIEW_ITEM_KEBAB_CLASS = 'MuiDataStudio-SidebarViewItemKebab';

const SidebarViewItemRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  minWidth: 0,
  width: '100%',
  overflow: 'hidden',
  // Hover affordance: the kebab is hidden by default and revealed when the
  // user hovers the row (or when keyboard focus lands on it, for a11y).
  // The menu pops the button to `data-open="true"` while open so it stays
  // visible during interaction.
  [`& .${SIDEBAR_VIEW_ITEM_KEBAB_CLASS}`]: {
    opacity: 0,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  [`&:hover .${SIDEBAR_VIEW_ITEM_KEBAB_CLASS}, & .${SIDEBAR_VIEW_ITEM_KEBAB_CLASS}:focus-visible, & .${SIDEBAR_VIEW_ITEM_KEBAB_CLASS}[data-open="true"]`]:
    {
      opacity: 1,
    },
}));

const SidebarViewItemKebab = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.25),
  borderRadius: 4,
  color: (theme.vars || theme).palette.text.secondary,
  flex: '0 0 auto',
  '& svg': { fontSize: 16 },
}));

const SidebarViewItemLabel = styled('span')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
  minWidth: 0,
  display: 'block',
});

const SidebarViewItemRenameInput = styled(InputBase)({
  font: 'inherit',
  color: 'inherit',
  flex: 1,
  minWidth: 0,
  '& input': {
    padding: 0,
    font: 'inherit',
    color: 'inherit',
  },
});

export interface DataStudioSidebarViewItemProps {
  view: DataStudioView;
  index: number;
  total: number;
  state: Pick<
    DataStudioStateApi,
    'renameView' | 'duplicateView' | 'deleteView' | 'moveView' | 'selectView'
  >;
}

export function DataStudioSidebarViewItem(props: DataStudioSidebarViewItemProps) {
  const { view, index, total, state } = props;
  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);
  const [renameDraft, setRenameDraft] = React.useState<string | null>(null);

  const beginRename = () => {
    setRenameDraft(String(view.label ?? ''));
  };

  const commitRename = () => {
    if (renameDraft === null) {
      return;
    }
    const trimmed = renameDraft.trim();
    if (trimmed.length > 0) {
      state.renameView(view.id, trimmed);
    }
    setRenameDraft(null);
  };

  const cancelRename = () => {
    setRenameDraft(null);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    // The kebab sits inside the tree-item label; stop the click before it
    // bubbles to the TreeItem and triggers selection.
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const isRenaming = renameDraft !== null;
  const canMoveUp = index > 0;
  const canMoveDown = index < total - 1;

  return (
    <SidebarViewItemRoot>
      {isRenaming ? (
        <SidebarViewItemRenameInput
          autoFocus
          value={renameDraft ?? ''}
          onChange={(event) => setRenameDraft(event.target.value)}
          onBlur={commitRename}
          onClick={(event) => event.stopPropagation()}
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
        <SidebarViewItemLabel onDoubleClick={beginRename}>{view.label}</SidebarViewItemLabel>
      )}
      <SidebarViewItemKebab
        className={SIDEBAR_VIEW_ITEM_KEBAB_CLASS}
        data-open={menuAnchor ? 'true' : undefined}
        size="small"
        aria-label={`View options for ${String(view.label)}`}
        onClick={handleOpenMenu}
      >
        <MoreHorizIcon fontSize="inherit" />
      </SidebarViewItemKebab>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={(event) => {
            event.stopPropagation();
            handleCloseMenu();
            beginRename();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={(event) => {
            event.stopPropagation();
            handleCloseMenu();
            state.duplicateView(view.id);
          }}
        >
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={(event) => {
            event.stopPropagation();
            handleCloseMenu();
            state.deleteView(view.id);
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          disabled={!canMoveUp}
          onClick={(event) => {
            event.stopPropagation();
            handleCloseMenu();
            state.moveView(view.id, -1);
          }}
        >
          <ListItemIcon>
            <ArrowUpIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move up</ListItemText>
        </MenuItem>
        <MenuItem
          disabled={!canMoveDown}
          onClick={(event) => {
            event.stopPropagation();
            handleCloseMenu();
            state.moveView(view.id, 1);
          }}
        >
          <ListItemIcon>
            <ArrowDownIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move down</ListItemText>
        </MenuItem>
      </Menu>
    </SidebarViewItemRoot>
  );
}
