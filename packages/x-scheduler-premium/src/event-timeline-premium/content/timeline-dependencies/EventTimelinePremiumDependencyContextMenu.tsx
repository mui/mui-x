'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditRounded from '@mui/icons-material/EditRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import type {
  SchedulerDependencyEditor,
  SchedulerDependencyId,
} from '@mui/x-scheduler-internals-premium/models';

export interface DependencyContextMenuState {
  /**
   * `false` while the menu closes: the rest is kept so it does not render empty.
   */
  open: boolean;
  dependencyId: SchedulerDependencyId;
  anchorPosition: { top: number; left: number };
  /**
   * In overlay coordinates, unlike `anchorPosition`.
   */
  editorAnchor: SchedulerDependencyEditor['anchor'];
  editorResourceIds: Pick<SchedulerDependencyEditor, 'sourceResourceId' | 'targetResourceId'>;
}

interface EventTimelinePremiumDependencyContextMenuProps {
  state: DependencyContextMenuState | null;
  onClose: () => void;
}

// TODO(dependencies public flip, #23420): move to localeText.
const DEPENDENCY_CONTEXT_MENU_TEXT = {
  ariaLabel: 'Dependency actions',
  edit: 'Edit dependency',
  showDetails: 'Show details',
  delete: 'Delete',
};

/**
 * Right-click menu of a dependency arrow: Edit and Delete, or Show details when read-only.
 */
export function EventTimelinePremiumDependencyContextMenu(
  props: EventTimelinePremiumDependencyContextMenuProps,
) {
  const { state, onClose } = props;
  const store = useEventTimelinePremiumStoreContext();
  const isReadOnly = useStore(store, eventTimelinePremiumDependencySelectors.isReadOnly);

  if (state === null) {
    return null;
  }

  const handleEdit = () => {
    onClose();
    store.openDependencyEditor(state.dependencyId, state.editorAnchor, state.editorResourceIds);
  };

  const handleDelete = () => {
    onClose();
    store.deleteSelectedDependency();
  };

  return (
    <Menu
      open={state.open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={state.anchorPosition}
      slotProps={{ list: { 'aria-label': DEPENDENCY_CONTEXT_MENU_TEXT.ariaLabel } }}
    >
      <MenuItem onClick={handleEdit}>
        <ListItemIcon>
          {isReadOnly ? <SearchRounded fontSize="small" /> : <EditRounded fontSize="small" />}
        </ListItemIcon>
        <ListItemText>
          {isReadOnly
            ? DEPENDENCY_CONTEXT_MENU_TEXT.showDetails
            : DEPENDENCY_CONTEXT_MENU_TEXT.edit}
        </ListItemText>
      </MenuItem>
      {!isReadOnly && (
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText>{DEPENDENCY_CONTEXT_MENU_TEXT.delete}</ListItemText>
        </MenuItem>
      )}
    </Menu>
  );
}
