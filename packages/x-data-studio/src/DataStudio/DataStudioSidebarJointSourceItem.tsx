'use client';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createSvgIcon } from '@mui/material/utils';
import { styled } from '../internals/zero-styled';

// A "merge/join" glyph: two branches converging into one.
const JoinIcon = createSvgIcon(
  <path d="M7 3H4v2h3c2.21 0 4 1.79 4 4v9h2v-4.59l2.3 2.3 1.4-1.42L13 11.17V9c0-3.31-2.69-6-6-6zm10 0c-2.05 0-3.81 1.23-4.59 3h2.34c.55-.6 1.34-1 2.25-1h3V3h-3z" />,
  'Join',
);
const MoreHorizIcon = createSvgIcon(
  <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />,
  'MoreHoriz',
);
const EditIcon = createSvgIcon(
  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.9959.9959 0 0 0 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />,
  'Edit',
);
const DeleteIcon = createSvgIcon(
  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />,
  'Delete',
);

const SIDEBAR_JOINT_ITEM_KEBAB_CLASS = 'MuiDataStudio-SidebarJointSourceItemKebab';

const SidebarJointSourceItemRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  minWidth: 0,
  width: '100%',
  overflow: 'hidden',
  [`& .${SIDEBAR_JOINT_ITEM_KEBAB_CLASS}`]: {
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shortest,
    }),
    opacity: 0.5,
    '@media (hover: hover)': {
      opacity: 0,
    },
  },
  [`&:hover .${SIDEBAR_JOINT_ITEM_KEBAB_CLASS}, & .${SIDEBAR_JOINT_ITEM_KEBAB_CLASS}:focus-visible, & .${SIDEBAR_JOINT_ITEM_KEBAB_CLASS}[data-open="true"]`]:
    {
      opacity: 1,
    },
}));

const SidebarJointSourceItemKebab = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  borderRadius: 4,
  color: (theme.vars || theme).palette.text.secondary,
  flex: '0 0 auto',
  '& svg': { fontSize: 16 },
}));

const SidebarJointSourceItemTypeIcon = styled('span')(({ theme }) => ({
  flex: '0 0 auto',
  display: 'inline-flex',
  alignItems: 'center',
  color: (theme.vars || theme).palette.text.secondary,
  '& svg': { fontSize: 16 },
}));

const SidebarJointSourceItemLabel = styled('span')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
  minWidth: 0,
  display: 'block',
});

export interface DataStudioSidebarJointSourceItemProps {
  label: React.ReactNode;
  jointSourceId: string;
  onEdit: (jointSourceId: string) => void;
  onDelete: (jointSourceId: string) => void;
}

/**
 * Sidebar row for a user-created joint source: a join icon, the label, and a
 * hover/kebab menu with Edit and Delete.
 * @param {DataStudioSidebarJointSourceItemProps} props The item props.
 * @returns {React.JSX.Element} The sidebar row.
 */
export function DataStudioSidebarJointSourceItem(
  props: DataStudioSidebarJointSourceItemProps,
): React.JSX.Element {
  const { label, jointSourceId, onEdit, onDelete } = props;
  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    // The kebab sits inside the tree-item label; stop the click before it
    // bubbles to the TreeItem and triggers selection.
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  return (
    <SidebarJointSourceItemRoot>
      <SidebarJointSourceItemTypeIcon aria-hidden>
        <JoinIcon fontSize="inherit" />
      </SidebarJointSourceItemTypeIcon>
      <SidebarJointSourceItemLabel>{label}</SidebarJointSourceItemLabel>
      <SidebarJointSourceItemKebab
        className={SIDEBAR_JOINT_ITEM_KEBAB_CLASS}
        data-open={menuAnchor ? 'true' : undefined}
        size="small"
        aria-label={`Joint source options for ${String(label)}`}
        onClick={handleOpenMenu}
      >
        <MoreHorizIcon fontSize="inherit" />
      </SidebarJointSourceItemKebab>

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
            onEdit(jointSourceId);
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={(event) => {
            event.stopPropagation();
            handleCloseMenu();
            onDelete(jointSourceId);
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </SidebarJointSourceItemRoot>
  );
}
