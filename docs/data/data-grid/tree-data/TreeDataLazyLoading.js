// TODO rows v6: Adapt to new lazy loading api
import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

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

const fakeDataFetcher = (parentPath = []) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const rows = getChildren(parentPath).map((row) => ({
        ...row,
        descendantCount: getChildren(row.hierarchy).length,
      }));
      if (parentPath.length !== 0 && Math.random() > 0.7) {
        // 30% probablity of failure
        reject(new Error('Network call failed randomly'));
      }
      resolve(rows);
    }, 1000 + Math.random() * 300);
  });

const getTreeDataPath = (row) => row.hierarchy;

const initRows = [];

export default function TreeDataLazyLoading() {
  const apiRef = useGridApiRef();
  const [loading, setLoading] = React.useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const onFetchRowChildren = React.useCallback(
    async ({ row, helpers }) => {
      if (showSnackbar) {
        setShowSnackbar(false);
      }
      try {
        if (!row) {
          setLoading(true);
        }
        const path = row ? getTreeDataPath(row) : [];
        const data = await fakeDataFetcher(path);
        helpers.success(data);
        if (!row) {
          setLoading(false);
        }
      } catch (error) {
        // simulate network error
        helpers.error();
        setShowSnackbar(true);
        console.error(error);
      }
    },
    [showSnackbar],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        loading={loading}
        treeData
        apiRef={apiRef}
        rows={initRows}
        columns={columns}
        getTreeDataPath={getTreeDataPath}
        onFetchRowChildren={onFetchRowChildren}
        isServerSideRow={(row) => row.descendantCount > 0}
        rowsLoadingMode="server"
      />
      <Snackbar
        open={showSnackbar}
        onClose={() => setShowSnackbar(false)}
        autoHideDuration={6000}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="error">
          Could not fetch data, please try again.
        </Alert>
      </Snackbar>
    </div>
  );
}
