'use client';
import * as React from 'react';
import {
  GridEditModes,
  GridRowId,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid-premium';

interface UseRowEditHandlersParams {
  id: GridRowId;
  field: string;
  onClose?: () => void;
}

/**
 * Hook that provides keyboard event handlers for custom edit cells
 * to work correctly in both cell and row edit modes.
 *
 * In row edit mode:
 * - Tab moves focus to the next/previous editable cell
 * - Enter/Escape are stopped from propagating to prevent exiting row edit
 *
 * In cell edit mode:
 * - Default behavior is preserved
 */
export function useRowEditHandlers(params: UseRowEditHandlersParams) {
  const { id, field, onClose } = params;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const isRowEditMode = rootProps.editMode === GridEditModes.Row;

  const moveFocusToNextCell = React.useCallback(
    (shiftKey: boolean) => {
      const editableFields = apiRef.current
        .getVisibleColumns()
        .filter(
          (column) =>
            column.type === 'actions' ||
            apiRef.current.isCellEditable(apiRef.current.getCellParams(id, column.field)),
        )
        .map((column) => column.field);

      const currentIndex = editableFields.indexOf(field);
      if (currentIndex === -1) {
        return;
      }

      const nextIndex = shiftKey ? currentIndex - 1 : currentIndex + 1;

      if (nextIndex < 0 || nextIndex >= editableFields.length) {
        // At boundary - exit row edit mode
        apiRef.current.stopRowEditMode({
          id,
          field,
          cellToFocusAfter: shiftKey ? 'left' : 'right',
        });
        return;
      }

      apiRef.current.setCellFocus(id, editableFields[nextIndex]);
    },
    [apiRef, id, field],
  );

  /**
   * Handle Tab key in row edit mode.
   * Closes any open popup and moves focus to the next/previous editable cell.
   */
  const handleTabKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!isRowEditMode || event.key !== 'Tab') {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      onClose?.();
      moveFocusToNextCell(event.shiftKey);
    },
    [isRowEditMode, onClose, moveFocusToNextCell],
  );

  /**
   * Prevent Enter/Escape from bubbling in row edit mode.
   * This prevents the grid from exiting row edit when selecting from a dropdown.
   */
  const handleEnterEscapeKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!isRowEditMode) {
        return;
      }
      if (event.key === 'Enter' || event.key === 'Escape') {
        event.stopPropagation();
      }
    },
    [isRowEditMode],
  );

  /**
   * Combined handler for menus/listboxes that need to handle both Tab and Enter/Escape.
   */
  const handleMenuKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      handleEnterEscapeKeyDown(event);
      handleTabKeyDown(event);
    },
    [handleEnterEscapeKeyDown, handleTabKeyDown],
  );

  return {
    handleTabKeyDown,
    handleEnterEscapeKeyDown,
    handleMenuKeyDown,
    moveFocusToNextCell,
  };
}
