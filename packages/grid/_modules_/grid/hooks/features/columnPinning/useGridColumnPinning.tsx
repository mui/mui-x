import * as React from 'react';
import MuiDivider from '@mui/material/Divider';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridComponentProps } from '../../../GridComponentProps';
import {
  visibleGridColumnsSelector,
  gridColumnsMetaSelector,
  gridVisibleColumnFieldsSelector,
} from '../columns/gridColumnsSelector';
import { GridCellIndexCoordinates } from '../../../models/gridCell';
import { GridPreProcessingGroup } from '../../core/preProcessing';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridEvents } from '../../../models/events';
import { gridClasses } from '../../../gridClasses';
import { useGridRegisterPreProcessor } from '../../core/preProcessing/useGridRegisterPreProcessor';
import { GridColumnPinningMenuItems } from '../../../components/menu/columnMenu/GridColumnPinningMenuItems';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridColumnPinningApi, GridPinnedPosition } from '../../../models/api/gridColumnPinningApi';
import { gridPinnedColumnsSelector } from './columnPinningSelector';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { useGridState } from '../../utils/useGridState';
import { useGridSelector } from '../../utils/useGridSelector';
import { filterColumns } from '../../../../../x-data-grid-pro/src/DataGridProVirtualScroller';
import { GridRowParams } from '../../../models/params/gridRowParams';
import { MuiEvent } from '../../../models/muiEvent';
import { GridColumnsRawState } from '../columns/gridColumnsState';

const Divider = () => <MuiDivider onClick={(event) => event.stopPropagation()} />;

export const useGridColumnPinning = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    'initialState' | 'disableColumnPinning' | 'pinnedColumns' | 'onPinnedColumnsChange'
  >,
): void => {
  useGridStateInit(apiRef, (state) => ({
    ...state,
    pinnedColumns: {
      left: !props.disableColumnPinning ? props.initialState?.pinnedColumns?.left : undefined,
      right: !props.disableColumnPinning ? props.initialState?.pinnedColumns?.right : undefined,
    },
  }));
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const pinnedColumns = useGridSelector(apiRef, gridPinnedColumnsSelector);

  // Each visible row (not to be confused with a filter result) is composed of a central .MuiDataGrid-row element
  // and up to two additional .MuiDataGrid-row's, one for the columns pinned to the left and another
  // for those on the right side. When hovering any of these elements, the :hover styles are applied only to
  // the row element that was actually hovered, not its additional siblings. To make it look like a contiguous row,
  // this method adds/removes the .Mui-hovered class to all of the row elements inside one visible row.
  const updateHoveredClassOnSiblingRows = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (props.disableColumnPinning) {
        return;
      }

      if (!Array.isArray(pinnedColumns.left) && !Array.isArray(pinnedColumns.right)) {
        return;
      }

      const nbLeftPinnedColumns = pinnedColumns.left?.length ?? 0;
      const nbRightPinnedColumns = pinnedColumns.right?.length ?? 0;
      if (nbLeftPinnedColumns + nbRightPinnedColumns === 0) {
        return;
      }

      const index = event.currentTarget.dataset.rowindex;
      const rowElements = apiRef.current.windowRef!.current!.querySelectorAll(
        `.${gridClasses.row}[data-rowindex="${index}"]`,
      );
      rowElements.forEach((row) => {
        if (event.type === 'mouseenter') {
          row.classList.add('Mui-hovered');
        } else {
          row.classList.remove('Mui-hovered');
        }
      });
    },
    [apiRef, pinnedColumns.left, pinnedColumns.right, props.disableColumnPinning],
  );

  const handleMouseEnter = React.useCallback(
    (params: GridRowParams, event: MuiEvent<React.MouseEvent<HTMLElement>>) => {
      updateHoveredClassOnSiblingRows(event);
    },
    [updateHoveredClassOnSiblingRows],
  );

  const handleMouseLeave = React.useCallback(
    (params: GridRowParams, event: MuiEvent<React.MouseEvent<HTMLElement>>) => {
      updateHoveredClassOnSiblingRows(event);
    },
    [updateHoveredClassOnSiblingRows],
  );

  useGridApiEventHandler(apiRef, GridEvents.rowMouseEnter, handleMouseEnter);
  useGridApiEventHandler(apiRef, GridEvents.rowMouseLeave, handleMouseLeave);

  const calculateScrollLeft = React.useCallback(
    (initialValue, params: Partial<GridCellIndexCoordinates>) => {
      if (props.disableColumnPinning) {
        return initialValue;
      }

      const visibleColumnFields = gridVisibleColumnFieldsSelector(apiRef.current.state);
      const [leftPinnedColumns, rightPinnedColumns] = filterColumns(
        pinnedColumns,
        visibleColumnFields,
      );

      if (!params.colIndex || (leftPinnedColumns.length === 0 && rightPinnedColumns.length === 0)) {
        return initialValue;
      }

      const visibleColumns = visibleGridColumnsSelector(apiRef.current.state);
      const columnsMeta = gridColumnsMetaSelector(apiRef.current.state);
      const clientWidth = apiRef.current.windowRef!.current!.clientWidth;
      const scrollLeft = apiRef.current.windowRef!.current!.scrollLeft;
      const offsetWidth = visibleColumns[params.colIndex].computedWidth;
      const offsetLeft = columnsMeta.positions[params.colIndex];

      const leftPinnedColumnsWidth = columnsMeta.positions[leftPinnedColumns.length];
      const rightPinnedColumnsWidth =
        columnsMeta.totalWidth -
        columnsMeta.positions[columnsMeta.positions.length - rightPinnedColumns.length];

      const elementBottom = offsetLeft + offsetWidth;
      if (elementBottom - (clientWidth - rightPinnedColumnsWidth) > scrollLeft) {
        const left = elementBottom - (clientWidth - rightPinnedColumnsWidth);
        return { ...initialValue, left };
      }
      if (offsetLeft < scrollLeft + leftPinnedColumnsWidth) {
        const left = offsetLeft - leftPinnedColumnsWidth;
        return { ...initialValue, left };
      }
      return initialValue;
    },
    [apiRef, pinnedColumns, props.disableColumnPinning],
  );

  const addColumnMenuButtons = React.useCallback(
    (initialValue: JSX.Element[]) => {
      if (props.disableColumnPinning) {
        return initialValue;
      }

      return [...initialValue, <Divider />, <GridColumnPinningMenuItems />];
    },
    [props.disableColumnPinning],
  );

  const reorderPinnedColumns = React.useCallback(
    (columnsState: GridColumnsRawState) => {
      if (columnsState.all.length === 0 || props.disableColumnPinning) {
        return columnsState;
      }

      const [leftPinnedColumns, rightPinnedColumns] = filterColumns(
        pinnedColumns,
        columnsState.all,
      );

      if (leftPinnedColumns.length === 0 && rightPinnedColumns.length === 0) {
        return columnsState;
      }

      const centerColumns = columnsState.all.filter((field) => {
        return !leftPinnedColumns.includes(field) && !rightPinnedColumns.includes(field);
      });

      return {
        ...columnsState,
        all: [...leftPinnedColumns, ...centerColumns, ...rightPinnedColumns],
      };
    },
    [pinnedColumns, props.disableColumnPinning],
  );

  const checkIfCanBeReordered = React.useCallback(
    (initialValue, { targetIndex }: { targetIndex: number }) => {
      const visibleColumnFields = gridVisibleColumnFieldsSelector(apiRef.current.state);
      const [leftPinnedColumns, rightPinnedColumns] = filterColumns(
        pinnedColumns,
        visibleColumnFields,
      );

      if (leftPinnedColumns.length === 0 && rightPinnedColumns.length === 0) {
        return initialValue;
      }

      if (leftPinnedColumns.length > 0 && targetIndex < leftPinnedColumns.length) {
        return false;
      }

      if (rightPinnedColumns.length > 0) {
        const visibleColumns = visibleGridColumnsSelector(apiRef.current.state);
        const firstRightPinnedColumnIndex = visibleColumns.length - rightPinnedColumns.length;
        return targetIndex >= firstRightPinnedColumnIndex ? false : initialValue;
      }

      return initialValue;
    },
    [apiRef, pinnedColumns],
  );

  useGridRegisterPreProcessor(apiRef, GridPreProcessingGroup.scrollToIndexes, calculateScrollLeft);
  useGridRegisterPreProcessor(apiRef, GridPreProcessingGroup.columnMenu, addColumnMenuButtons);
  useGridRegisterPreProcessor(apiRef, GridPreProcessingGroup.hydrateColumns, reorderPinnedColumns);
  useGridRegisterPreProcessor(apiRef, GridPreProcessingGroup.canBeReordered, checkIfCanBeReordered);

  apiRef.current.unstable_updateControlState({
    stateId: 'pinnedColumns',
    propModel: props.pinnedColumns,
    propOnChange: props.onPinnedColumnsChange,
    stateSelector: gridPinnedColumnsSelector,
    changeEvent: GridEvents.pinnedColumnsChange,
  });

  const checkIfEnabled = React.useCallback(
    (methodName) => {
      if (props.disableColumnPinning) {
        throw new Error(
          `MUI: You cannot call \`apiRef.current.${methodName}\` when \`disableColumnPinning\` is true.`,
        );
      }
    },
    [props.disableColumnPinning],
  );

  const pinColumn = React.useCallback<GridColumnPinningApi['pinColumn']>(
    (field: string, side: GridPinnedPosition) => {
      checkIfEnabled('pinColumn');

      if (apiRef.current.isColumnPinned(field) === side) {
        return;
      }

      setGridState((state) => {
        const otherSide =
          side === GridPinnedPosition.right ? GridPinnedPosition.left : GridPinnedPosition.right;
        const newPinnedColumns = {
          ...state.pinnedColumns,
          [side]: [...(state.pinnedColumns[side] || []), field],
          [otherSide]: (state.pinnedColumns[otherSide] || []).filter((column) => column !== field),
        };
        return { ...state, pinnedColumns: newPinnedColumns };
      });
      forceUpdate();
    },
    [apiRef, forceUpdate, setGridState, checkIfEnabled],
  );

  const unpinColumn = React.useCallback<GridColumnPinningApi['unpinColumn']>(
    (field: string) => {
      checkIfEnabled('unpinColumn');
      setGridState((state) => {
        const newPinnedColumns = {
          ...state.pinnedColumns,
          left: (state.pinnedColumns.left || []).filter((column) => column !== field),
          right: (state.pinnedColumns.right || []).filter((column) => column !== field),
        };
        return { ...state, pinnedColumns: newPinnedColumns };
      });
      forceUpdate();
    },
    [forceUpdate, setGridState, checkIfEnabled],
  );

  const getPinnedColumns = React.useCallback<GridColumnPinningApi['getPinnedColumns']>(() => {
    checkIfEnabled('getPinnedColumns');
    return gridPinnedColumnsSelector(apiRef.current.state);
  }, [apiRef, checkIfEnabled]);

  const setPinnedColumns = React.useCallback<GridColumnPinningApi['setPinnedColumns']>(
    (newPinnedColumns) => {
      checkIfEnabled('setPinnedColumns');
      setGridState((state) => ({ ...state, pinnedColumns: newPinnedColumns }));
      forceUpdate();
    },
    [forceUpdate, setGridState, checkIfEnabled],
  );

  const isColumnPinned = React.useCallback<GridColumnPinningApi['isColumnPinned']>(
    (field) => {
      checkIfEnabled('isColumnPinned');
      const leftPinnedColumns = pinnedColumns.left || [];
      if (leftPinnedColumns.includes(field)) {
        return GridPinnedPosition.left;
      }
      const rightPinnedColumns = pinnedColumns.right || [];
      if (rightPinnedColumns.includes(field)) {
        return GridPinnedPosition.right;
      }
      return false;
    },
    [pinnedColumns.left, pinnedColumns.right, checkIfEnabled],
  );

  const columnPinningApi: GridColumnPinningApi = {
    pinColumn,
    unpinColumn,
    getPinnedColumns,
    setPinnedColumns,
    isColumnPinned,
  };
  useGridApiMethod(apiRef, columnPinningApi, 'columnPinningApi');

  React.useEffect(() => {
    if (props.pinnedColumns) {
      apiRef.current.setPinnedColumns(props.pinnedColumns);
    }
  }, [apiRef, props.pinnedColumns]);
};
