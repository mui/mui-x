import * as React from 'react';
import {
  DataGridPremium,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridCellCheckboxRenderer,
  GridColDef,
  GridColumnHeaderParams,
  gridFilteredSortedRowIdsSelector,
  GridHeaderCheckbox,
  GridRenderCellParams,
  selectedIdsLookupSelector,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
  GridApi,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const checkboxColumn = (apiRef: React.MutableRefObject<GridApi>): GridColDef => {
  return {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    renderHeader: (params) => {
      const children = gridFilteredSortedRowIdsSelector(
        apiRef.current.state,
        apiRef.current.instanceId,
      ).filter((id) => !id.toString().includes('auto-generated'));

      const selectionLookup = selectedIdsLookupSelector(
        apiRef.current.state,
        apiRef.current.instanceId,
      );

      const indeterminate =
        children?.some((child) => selectionLookup[child] === undefined) &&
        children?.some((child) => selectionLookup[child] !== undefined);

      const checked =
        Object.keys(selectionLookup).length > 0 &&
        children?.every((child) => selectionLookup[child] !== undefined);
      const data: GridColumnHeaderParams & {
        indeterminate?: boolean;
        checked?: boolean;
        disabled?: boolean;
        onClick?: (e: MouseEvent) => void;
      } = {
        ...params,
        onClick: (e) => {
          apiRef.current.selectRows(children, indeterminate || !checked);
          e.preventDefault();
        },
        indeterminate,
        checked,
      };
      return <GridHeaderCheckbox {...data} />;
    },
    renderCell: (params) => {
      const { rowNode } = params;

      if (rowNode.type !== 'group') {
        return <GridCellCheckboxRenderer {...params} />;
      }

      const selectionLookup = selectedIdsLookupSelector(
        apiRef.current.state,
        apiRef.current.instanceId,
      );
      const children = apiRef.current.getRowGroupChildren({
        groupId: rowNode.id,
        applyFiltering: true,
        applySorting: true,
      });

      const indeterminate =
        children?.some((child) => selectionLookup[child] === undefined) &&
        children?.some((child) => selectionLookup[child] !== undefined);

      const checked = children?.every(
        (child) => selectionLookup[child] !== undefined,
      );

      const extraData: GridRenderCellParams & {
        indeterminate?: boolean;
        checked?: boolean;
        disabled?: boolean;
        onClick?: (e: MouseEvent) => void;
      } = {
        ...params,
        disabled: false,
        onClick: (e) => {
          if (rowNode.type === 'group') {
            if (children) {
              apiRef.current.selectRows(children, indeterminate || !checked);
            }
            e.preventDefault();
          }
        },
        indeterminate,
        checked,
      };

      return <GridCellCheckboxRenderer {...extraData} />;
    },
  };
};

export default function RowGroupingCheckboxSelection() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company'],
      },
    },
  });

  const columns = React.useMemo(
    () => [checkboxColumn(apiRef), ...data.columns],
    [apiRef, data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        columns={columns}
        apiRef={apiRef}
        checkboxSelection
        initialState={initialState}
      />
    </div>
  );
}
