// TODO rows v6: Adapt to new lazy loading api
import * as React from 'react';
import {
  DataGridPro,
  getDataGridUtilityClass,
  GridColumns,
  DataGridProProps,
  GridEventListener,
  GridGroupingColDefOverride,
  GridRenderCellParams,
  GridRowModel,
  GridRowsProp,
  GridGroupNode,
  useGridApiContext,
  useGridApiRef,
  useGridRootProps,
} from '@mui/x-data-grid-pro';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';

export const isNavigationKey = (key: string) =>
  key === 'Home' ||
  key === 'End' ||
  key.indexOf('Arrow') === 0 ||
  key.indexOf('Page') === 0 ||
  key === ' ';

interface Row {
  hierarchy: string[];
  jobTitle: string;
  recruitmentDate: Date;
  id: number;
  descendantCount?: number;
  childrenFetched?: boolean;
}

const ALL_ROWS: GridRowModel<Row>[] = [
  {
    hierarchy: ['Sarah'],
    jobTitle: 'Head of Human Resources',
    recruitmentDate: new Date(2020, 8, 12),
    id: 0,
  },
  {
    hierarchy: ['Thomas'],
    jobTitle: 'Head of Sales',
    recruitmentDate: new Date(2017, 3, 4),
    id: 1,
  },
  {
    hierarchy: ['Thomas', 'Robert'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 11, 20),
    id: 2,
  },
  {
    hierarchy: ['Thomas', 'Karen'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 10, 14),
    id: 3,
  },
  {
    hierarchy: ['Thomas', 'Nancy'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2017, 10, 29),
    id: 4,
  },
  {
    hierarchy: ['Thomas', 'Daniel'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 7, 21),
    id: 5,
  },
  {
    hierarchy: ['Thomas', 'Christopher'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 7, 20),
    id: 6,
  },
  {
    hierarchy: ['Thomas', 'Donald'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2019, 6, 28),
    id: 7,
  },
  {
    hierarchy: ['Mary'],
    jobTitle: 'Head of Engineering',
    recruitmentDate: new Date(2016, 3, 14),
    id: 8,
  },
  {
    hierarchy: ['Mary', 'Jennifer'],
    jobTitle: 'Tech lead front',
    recruitmentDate: new Date(2016, 5, 17),
    id: 9,
  },
  {
    hierarchy: ['Mary', 'Jennifer', 'Anna'],
    jobTitle: 'Front-end developer',
    recruitmentDate: new Date(2019, 11, 7),
    id: 10,
  },
  {
    hierarchy: ['Mary', 'Michael'],
    jobTitle: 'Tech lead devops',
    recruitmentDate: new Date(2021, 7, 1),
    id: 11,
  },
  {
    hierarchy: ['Mary', 'Linda'],
    jobTitle: 'Tech lead back',
    recruitmentDate: new Date(2017, 0, 12),
    id: 12,
  },
  {
    hierarchy: ['Mary', 'Linda', 'Elizabeth'],
    jobTitle: 'Back-end developer',
    recruitmentDate: new Date(2019, 2, 22),
    id: 13,
  },
  {
    hierarchy: ['Mary', 'Linda', 'William'],
    jobTitle: 'Back-end developer',
    recruitmentDate: new Date(2018, 4, 19),
    id: 14,
  },
];

const columns: GridColumns = [
  { field: 'jobTitle', headerName: 'Job Title', width: 200 },
  {
    field: 'recruitmentDate',
    headerName: 'Recruitment Date',
    type: 'date',
    width: 150,
  },
];

const getChildren = (parentPath: string[]) => {
  const parentPathStr = parentPath.join('-');
  return ALL_ROWS.filter(
    (row) => row.hierarchy.slice(0, -1).join('-') === parentPathStr,
  );
};

/**
 * This is a naive implementation with terrible performances on a real dataset.
 * This fake server is only here for demonstration purposes.
 */
const fakeDataFetcher = (parentPath: string[] = []) =>
  new Promise<GridRowModel<Row>[]>((resolve) => {
    setTimeout(() => {
      const rows = getChildren(parentPath).map((row) => ({
        ...row,
        descendantCount: getChildren(row.hierarchy).length,
      }));
      resolve(rows);
    }, 500 + Math.random() * 300);
  });

const getTreeDataPath: DataGridProProps['getTreeDataPath'] = (row) => row.hierarchy;

const useUtilityClasses = (ownerState: { classes: DataGridProProps['classes'] }) => {
  const { classes } = ownerState;

  const slots = {
    root: ['treeDataGroupingCell'],
    toggle: ['treeDataGroupingCellToggle'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

interface GroupingCellWithLazyLoadingProps
  extends GridRenderCellParams<any, any, any, GridGroupNode> {
  hideDescendantCount?: boolean;
}

/**
 * Reproduce the behavior of the `GridTreeDataGroupingCell` component in `@mui/x-data-grid-pro`
 * But base the amount of children on a `row.descendantCount` property rather than on the internal lookups.
 */
const GroupingCellWithLazyLoading = (props: GroupingCellWithLazyLoadingProps) => {
  const { id, field, rowNode, row, hideDescendantCount, formattedValue } = props;

  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses({ classes: rootProps.classes });

  const Icon = rowNode.childrenExpanded
    ? rootProps.components.TreeDataCollapseIcon
    : rootProps.components.TreeDataExpandIcon;

  const handleKeyDown: IconButtonProps['onKeyDown'] = (event) => {
    if (event.key === ' ') {
      event.stopPropagation();
    }
    if (isNavigationKey(event.key) && !event.shiftKey) {
      apiRef.current.publishEvent('cellNavigationKeyDown', props, event);
    }
  };

  const handleClick: IconButtonProps['onClick'] = (event) => {
    apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
    apiRef.current.setCellFocus(id, field);
    event.stopPropagation();
  };

  return (
    <Box className={classes.root} sx={{ ml: rowNode.depth * 2 }}>
      <div className={classes.toggle}>
        {row.descendantCount > 0 && (
          <IconButton
            size="small"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            aria-label={
              rowNode.childrenExpanded
                ? apiRef.current.getLocaleText('treeDataCollapse')
                : apiRef.current.getLocaleText('treeDataExpand')
            }
          >
            <Icon fontSize="inherit" />
          </IconButton>
        )}
      </div>
      <span>
        {formattedValue === undefined ? rowNode.groupingKey : formattedValue}
        {!hideDescendantCount && row.descendantCount > 0
          ? ` (${row.descendantCount})`
          : ''}
      </span>
    </Box>
  );
};

const CUSTOM_GROUPING_COL_DEF: GridGroupingColDefOverride = {
  renderCell: (params) => (
    <GroupingCellWithLazyLoading {...(params as GroupingCellWithLazyLoadingProps)} />
  ),
};

export default function TreeDataLazyLoading() {
  const apiRef = useGridApiRef();
  const [rows, setRows] = React.useState<GridRowsProp>([]);

  React.useEffect(() => {
    fakeDataFetcher().then(setRows);

    const handleRowExpansionChange: GridEventListener<'rowExpansionChange'> = async (
      node,
    ) => {
      const row = apiRef.current.getRow(node.id) as Row | null;

      if (!node.childrenExpanded || !row || row.childrenFetched) {
        return;
      }

      apiRef.current.updateRows([
        {
          id: `placeholder-children-${node.id}`,
          hierarchy: [...row.hierarchy, ''],
        },
      ]);

      const childrenRows = await fakeDataFetcher(row.hierarchy);
      apiRef.current.updateRows([
        ...childrenRows,
        { id: node.id, childrenFetched: true },
        { id: `placeholder-children-${node.id}`, _action: 'delete' },
      ]);

      if (childrenRows.length) {
        apiRef.current.setRowChildrenExpansion(node.id, true);
      }
    };

    /**
     * By default, the grid does not toggle the expansion of rows with 0 children
     * We need to override the `cellKeyDown` event listener to force the expansion if there are children on the server
     */
    const handleCellKeyDown: GridEventListener<'cellKeyDown'> = (params, event) => {
      const cellParams = apiRef.current.getCellParams(params.id, params.field);
      if (cellParams.colDef.type === 'treeDataGroup' && event.key === ' ') {
        event.stopPropagation();
        event.preventDefault();
        event.defaultMuiPrevented = true;

        apiRef.current.setRowChildrenExpansion(
          params.id,
          !(params.rowNode as GridGroupNode).childrenExpanded,
        );
      }
    };

    apiRef.current.subscribeEvent('rowExpansionChange', handleRowExpansionChange);
    apiRef.current.subscribeEvent('cellKeyDown', handleCellKeyDown, {
      isFirst: true,
    });
  }, [apiRef]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        treeData
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        getTreeDataPath={getTreeDataPath}
        groupingColDef={CUSTOM_GROUPING_COL_DEF}
        disableChildrenFiltering
      />
    </div>
  );
}
