import * as React from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/system';
import {
  useGridSelector,
  useGridRootProps,
  useGridApiContext,
  gridRowsLookupSelector,
  type GridRowId,
  type GridBasicGroupNode,
  type GridValidRowModel,
  type GridRenderCellParams,
  type GridDataSourceGroupNode,
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

const IconWrapper = styled('div')({
  flex: '0 0 28px',
  alignSelf: 'stretch',
  marginRight: '8px',
});

interface NestedPaginationGroupingCellProps extends GridRenderCellParams<
  any,
  any,
  any,
  GridDataSourceGroupNode
> {
  setExpandedRows: React.Dispatch<React.SetStateAction<GridValidRowModel[]>>;
  depth: number;
}

interface GroupingIconProps extends Pick<
  NestedPaginationGroupingCellProps,
  'id' | 'field' | 'row' | 'setExpandedRows' | 'depth'
> {
  descendantCount: number;
  groupingKey: GridBasicGroupNode['groupingKey'];
  expanded: boolean;
}

function GroupingIcon(props: GroupingIconProps) {
  const apiRef = useGridApiContext();
  const {
    groupingKey,
    id,
    field,
    descendantCount,
    row,
    depth,
    expanded,
    setExpandedRows,
  } = props;

  const handleClick = useEventCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      // Avoid showing outdated rows while loading
      apiRef.current?.setRows([]);
      if (!expanded) {
        setExpandedRows((prev) => [
          ...prev,
          {
            ...row,
            groupingKey,
            expanded: true,
            depth,
          },
        ]);
      } else {
        setExpandedRows((prev) => {
          const index = prev.findIndex((r) => r.id === id);
          return prev.slice(0, index);
        });
      }
      apiRef.current.setCellFocus(id, field);
      event.stopPropagation();
    },
  );

  const Icon = expanded ? ExpandMore : ChevronRight;

  return (
    <IconWrapper>
      {descendantCount === -1 || descendantCount > 0 ? (
        <IconButton
          size="small"
          onClick={handleClick}
          tabIndex={-1}
          aria-label={`${expanded ? 'Hide' : 'Show'} children`}
        >
          <Icon fontSize="inherit" />
        </IconButton>
      ) : null}
    </IconWrapper>
  );
}

export default function NestedPaginationGroupingCell(
  props: NestedPaginationGroupingCellProps,
) {
  const { id, field, formattedValue, rowNode, setExpandedRows, depth } = props;

  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const row = useGridSelector(apiRef, gridRowSelector, id);

  let descendantCount = 0;
  if (row) {
    descendantCount = rootProps.dataSource?.getChildrenCount?.(row) ?? 0;
  }

  let marginFactor = row?.depth ? row.depth : rowNode.depth;
  if (!row.expanded && depth > 0) {
    marginFactor = depth;
  }

  return (
    <Stack
      alignItems="center"
      width="100%"
      flexDirection="row"
      marginLeft={marginFactor * 2}
    >
      <GroupingIcon
        id={id}
        field={field}
        groupingKey={rowNode.groupingKey}
        expanded={row.expanded || rowNode.childrenExpanded}
        row={row}
        setExpandedRows={setExpandedRows}
        depth={depth}
        descendantCount={descendantCount}
      />
      <span>
        {formattedValue === undefined
          ? (rowNode.groupingKey ?? row.groupingKey)
          : formattedValue}
        {descendantCount > 0 ? ` (${descendantCount})` : ''}
      </span>
    </Stack>
  );
}
