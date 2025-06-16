import * as React from 'react';
import Box from '@mui/material/Box';
import {
  GridRenderCellParams,
  GridDataSourceGroupNode,
  useGridSelector,
  useGridRootProps,
  useGridApiContext,
  GridValidRowModel,
  gridRowsLookupSelector,
  type GridRowId,
  type GridBasicGroupNode,
} from '@mui/x-data-grid-pro';
import { createSelector } from '@mui/x-data-grid-pro/internals';
import useEventCallback from '@mui/utils/useEventCallback';
import IconButton from '@mui/material/IconButton';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ExpandMore from '@mui/icons-material/ExpandMore';

const gridRowSelector = createSelector(
  gridRowsLookupSelector,
  (lookup, id: GridRowId) => lookup[id],
);

interface NestedPaginationGroupingCellProps
  extends GridRenderCellParams<any, any, any, GridDataSourceGroupNode> {
  setExpandedRows: React.Dispatch<React.SetStateAction<GridValidRowModel[]>>;
  nestedLevelRef: React.RefObject<number>;
}

interface GroupingIconProps
  extends Pick<
    NestedPaginationGroupingCellProps,
    'id' | 'field' | 'row' | 'setExpandedRows' | 'nestedLevelRef'
  > {
  descendantCount: number;
  groupingKey: GridBasicGroupNode['groupingKey'];
  expanded: boolean;
}

function GroupingIcon(props: GroupingIconProps) {
  const apiRef = useGridApiContext();
  const { groupingKey, id, field, descendantCount, row, nestedLevelRef, expanded } =
    props;

  const handleClick = useEventCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      apiRef.current?.setRows([]);
      if (!expanded) {
        props.setExpandedRows((prev) => [
          ...prev,
          {
            ...row,
            groupingKey,
            expanded: true,
            depth: nestedLevelRef.current,
          },
        ]);
      } else {
        props.setExpandedRows((prev) => {
          const index = prev.findIndex((r) => r.id === id);
          return prev.slice(0, index);
        });
      }
      apiRef.current.setCellFocus(id, field);
      event.stopPropagation();
    },
  );

  const Icon = expanded ? ExpandMore : ChevronRight;

  return descendantCount > 0 ? (
    <IconButton
      size="small"
      onClick={handleClick}
      tabIndex={-1}
      aria-label={`${expanded ? 'Hide' : 'Show'} children`}
    >
      <Icon fontSize="inherit" />
    </IconButton>
  ) : null;
}

export default function NestedPaginationGroupingCell(
  props: NestedPaginationGroupingCellProps,
) {
  const { id, field, formattedValue, rowNode, setExpandedRows, nestedLevelRef } =
    props;

  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const row = useGridSelector(apiRef, gridRowSelector, id);

  let descendantCount = 0;
  if (row) {
    descendantCount = Math.max(
      rootProps.dataSource?.getChildrenCount?.(row) ?? 0,
      0,
    );
  }

  let depth = row.depth ? row.depth : rowNode.depth;
  if (!row.expanded && nestedLevelRef.current > 0) {
    depth = nestedLevelRef.current;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        ml: depth * 2,
      }}
    >
      <div
        style={{
          flex: '0 0 28px',
          alignSelf: 'stretch',
          marginRight: '8px',
        }}
      >
        <GroupingIcon
          id={id}
          field={field}
          groupingKey={rowNode.groupingKey}
          expanded={row.expanded || rowNode.childrenExpanded}
          row={row}
          setExpandedRows={setExpandedRows}
          nestedLevelRef={nestedLevelRef}
          descendantCount={descendantCount}
        />
      </div>
      <span>
        {formattedValue === undefined
          ? (rowNode.groupingKey ?? row.groupingKey)
          : formattedValue}
        {descendantCount > 0 ? ` (${descendantCount})` : ''}
      </span>
    </Box>
  );
}
