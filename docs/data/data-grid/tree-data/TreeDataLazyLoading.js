import * as React from 'react';
import {
  DataGridPro,
  getDataGridUtilityClass,
  useGridApiContext,
  useGridApiRef,
  useGridRootProps,
} from '@mui/x-data-grid-pro';
import { unstable_composeClasses as composeClasses, styled } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';

export const isNavigationKey = (key) =>
  key === 'Home' ||
  key === 'End' ||
  key.indexOf('Arrow') === 0 ||
  key.indexOf('Page') === 0 ||
  key === ' ';

const ALL_ROWS = [
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

const columns = [
  { field: 'jobTitle', headerName: 'Job Title', width: 200 },
  {
    field: 'recruitmentDate',
    headerName: 'Recruitment Date',
    type: 'date',
    width: 150,
  },
];

const getChildren = (parentPath) => {
  const parentPathStr = parentPath.join('-');
  return ALL_ROWS.filter(
    (row) => row.hierarchy.slice(0, -1).join('-') === parentPathStr,
  );
};

/**
 * This is a naive implementation with terrible performances on a real dataset.
 * This fake server is only here for demonstration purposes.
 */
const fakeDataFetcher = (parentPath = []) =>
  new Promise((resolve) => {
    setTimeout(
      () => {
        const rows = getChildren(parentPath).map((row) => ({
          ...row,
          descendantCount: getChildren(row.hierarchy).length,
        }));
        resolve(rows);
      },
      500 + Math.random() * 300,
    );
  });

const LoadingContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});

const getTreeDataPath = (row) => row.hierarchy;

const useUtilityClasses = (ownerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['treeDataGroupingCell'],
    toggle: ['treeDataGroupingCellToggle'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

/**
 * Reproduce the behavior of the `GridTreeDataGroupingCell` component in `@mui/x-data-grid-pro`
 * But base the amount of children on a `row.descendantCount` property rather than on the internal lookups.
 */
function GroupingCellWithLazyLoading(props) {
  const { id, rowNode, row, hideDescendantCount, formattedValue } = props;

  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses({ classes: rootProps.classes });

  const isLoading = rowNode.childrenExpanded ? !row.childrenFetched : false;

  const Icon = rowNode.childrenExpanded
    ? rootProps.slots.treeDataCollapseIcon
    : rootProps.slots.treeDataExpandIcon;

  const handleClick = () => {
    apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
  };

  return (
    <Box className={classes.root} sx={{ ml: rowNode.depth * 2 }}>
      <div className={classes.toggle}>
        {row.descendantCount > 0 &&
          (isLoading ? (
            <LoadingContainer>
              <CircularProgress size="1rem" color="inherit" />
            </LoadingContainer>
          ) : (
            <IconButton
              size="small"
              onClick={handleClick}
              tabIndex={-1}
              aria-label={
                rowNode.childrenExpanded
                  ? apiRef.current.getLocaleText('treeDataCollapse')
                  : apiRef.current.getLocaleText('treeDataExpand')
              }
            >
              <Icon fontSize="inherit" />
            </IconButton>
          ))}
      </div>
      <span>
        {formattedValue === undefined ? rowNode.groupingKey : formattedValue}
        {!hideDescendantCount && row.descendantCount > 0
          ? ` (${row.descendantCount})`
          : ''}
      </span>
    </Box>
  );
}

const CUSTOM_GROUPING_COL_DEF = {
  renderCell: (params) => <GroupingCellWithLazyLoading {...params} />,
};

// Optional
const getRowId = (row) => {
  if (typeof row?.id === 'string' && row?.id.startsWith('placeholder-children-')) {
    return row.id;
  }
  return row.id;
};

function updateRows(apiRef, rows) {
  if (!apiRef.current) {
    return;
  }
  const rowsToAdd = [...rows];
  rows.forEach((row) => {
    if (row.descendantCount && row.descendantCount > 0) {
      // Add a placeholder row to make the row expandable
      rowsToAdd.push({
        id: `placeholder-children-${getRowId(row)}`,
        hierarchy: [...row.hierarchy, ''],
      });
    }
  });
  apiRef.current.updateRows(rowsToAdd);
}

const initialRows = [];

export default function TreeDataLazyLoading() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    fakeDataFetcher().then((rowsData) => {
      updateRows(apiRef, rowsData);
    });

    const handleRowExpansionChange = async (node) => {
      const row = apiRef.current.getRow(node.id);

      if (!node.childrenExpanded || !row || row.childrenFetched) {
        return;
      }

      const childrenRows = await fakeDataFetcher(row.hierarchy);
      updateRows(apiRef, [
        ...childrenRows,
        { ...row, childrenFetched: true },
        { id: `placeholder-children-${node.id}`, _action: 'delete' },
      ]);
    };

    return apiRef.current.subscribeEvent(
      'rowExpansionChange',
      handleRowExpansionChange,
    );
  }, [apiRef]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        treeData
        apiRef={apiRef}
        rows={initialRows}
        columns={columns}
        getTreeDataPath={getTreeDataPath}
        groupingColDef={CUSTOM_GROUPING_COL_DEF}
        disableChildrenFiltering
        getRowId={getRowId}
      />
    </div>
  );
}
