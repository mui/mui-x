import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import composeClasses from '@mui/utils/composeClasses';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { getDataGridUtilityClass } from '../../../constants';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '../../../colDef';
import { GRID_CHECKBOX_SELECTION_FIELD } from '../../../colDef/gridColDef.constants';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';

type OwnerState = { classes: DataGridProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  return React.useMemo(() => {
    const slots = {
      cellCheckbox: ['cellCheckbox'],
      columnHeaderCheckbox: ['columnHeaderCheckbox'],
    };

    return composeClasses(slots, getDataGridUtilityClass, classes);
  }, [classes]);
};

export const useGridRowSelectionPreProcessors = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  props: DataGridProcessedProps,
) => {
  const ownerState = { classes: props.classes };
  const classes = useUtilityClasses(ownerState);

  const updateSelectionColumn = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const selectionColumn: GridColDef = {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        cellClassName: classes.cellCheckbox,
        headerClassName: classes.columnHeaderCheckbox,
        headerName: apiRef.current.getLocaleText('checkboxSelectionHeaderName'),
      };

      const shouldHaveSelectionColumn = props.checkboxSelection;
      const hasSelectionColumn = columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD] != null;

      if (shouldHaveSelectionColumn && !hasSelectionColumn) {
        columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD] = selectionColumn;
        columnsState.orderedFields = [GRID_CHECKBOX_SELECTION_FIELD, ...columnsState.orderedFields];
      } else if (!shouldHaveSelectionColumn && hasSelectionColumn) {
        delete columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD];
        columnsState.orderedFields = columnsState.orderedFields.filter(
          (field) => field !== GRID_CHECKBOX_SELECTION_FIELD,
        );
      } else if (shouldHaveSelectionColumn && hasSelectionColumn) {
        columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD] = {
          ...selectionColumn,
          ...columnsState.lookup[GRID_CHECKBOX_SELECTION_FIELD],
        };
        // If the column is not in the columns array (not a custom selection column), move it to the beginning of the column order
        if (!props.columns.some((col) => col.field === GRID_CHECKBOX_SELECTION_FIELD)) {
          columnsState.orderedFields = [
            GRID_CHECKBOX_SELECTION_FIELD,
            ...columnsState.orderedFields.filter(
              (field) => field !== GRID_CHECKBOX_SELECTION_FIELD,
            ),
          ];
        }
      }

      // Ensure the checkbox selection column is visually the first column by pinning it to the
      // left edge when it is auto-inserted due to `checkboxSelection`.
      // Note: We no longer consider RTL here; we always use the left side.
      // Respect explicit user pinning (left or right) and avoid re-applying if already pinned first.
      // Update the pinnedColumns slice directly via setState.
      const api = apiRef.current as any;
      const pinned = api?.state?.pinnedColumns;

      if (pinned) {
        const left: string[] = Array.isArray(pinned.left) ? pinned.left : [];
        const right: string[] = Array.isArray(pinned.right) ? pinned.right : [];

        if (shouldHaveSelectionColumn) {
          const alreadyPinned =
            left.includes(GRID_CHECKBOX_SELECTION_FIELD) || right.includes(GRID_CHECKBOX_SELECTION_FIELD);

          // Only auto-pin the checkbox to the LEFT edge if there are other pinned columns
          // on the left already. Otherwise, keep it unpinned.
          const leftWithoutCheckbox = left.filter((f) => f !== GRID_CHECKBOX_SELECTION_FIELD);

          if (!alreadyPinned && leftWithoutCheckbox.length > 0) {
            const newLeft = [GRID_CHECKBOX_SELECTION_FIELD, ...leftWithoutCheckbox];
            const newRight = right;

            const changed =
              newLeft.length !== left.length || newLeft[0] !== left[0];

            if (changed) {
              api.setState((state: any) => ({
                ...state,
                pinnedColumns: { left: newLeft, right: newRight },
              }));
            }
          } else if (alreadyPinned && left.includes(GRID_CHECKBOX_SELECTION_FIELD) && leftWithoutCheckbox.length === 0) {
            // If the checkbox is pinned on the LEFT but would be alone on that edge,
            // unpin it from the left to avoid a solitary pinned checkbox.
            const newLeft = left.filter((f) => f !== GRID_CHECKBOX_SELECTION_FIELD);
            const newRight = right;

            const changed = newLeft.length !== left.length;
            if (changed) {
              api.setState((state: any) => ({
                ...state,
                pinnedColumns: { left: newLeft, right: newRight },
              }));
            }
          }
          // If it's already pinned (possibly by the user) or there are no other left pinned columns,
          // we do nothing: respect explicit user pinning and avoid pinning when alone.
        } else {
          // Checkbox selection disabled: clean up any leftover pinning of the checkbox column.
          const newLeft = left.filter((f) => f !== GRID_CHECKBOX_SELECTION_FIELD);
          const newRight = right.filter((f) => f !== GRID_CHECKBOX_SELECTION_FIELD);
          if (newLeft.length !== left.length || newRight.length !== right.length) {
            api.setState((state: any) => ({
              ...state,
              pinnedColumns: { left: newLeft, right: newRight },
            }));
          }
        }
      }

      return columnsState;
    },
    [apiRef, classes, props.columns, props.checkboxSelection],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateSelectionColumn);
};
