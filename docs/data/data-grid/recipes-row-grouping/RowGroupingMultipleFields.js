import Box from '@mui/material/Box';
import {
  DataGridPremium,
  useKeepGroupedColumnsHidden,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import Chip from '@mui/material/Chip';

const SEPARATOR = '___MULTI_COL___';

const columns = [
  {
    field: 'assignee',
    headerName: 'Assignee',
    width: 150,
  },
  {
    field: 'label',
    headerName: 'Task Group',
    width: 240,
    groupingValueGetter: (value, row) => `${value}${SEPARATOR}${row.priority}`,
    renderCell: (params) => {
      if (params.rowNode.type === 'group') {
        if (params.value === undefined) {
          return null;
        }
        const val = params.value.split(SEPARATOR);
        let color = 'default';
        if (val[1] === 'High') {
          color = 'error';
        } else if (val[1] === 'Medium') {
          color = 'warning';
        } else {
          color = 'success';
        }
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <div>{val[0]}</div>
            <Chip color={color} label={val[1]} size="small" />
          </Box>
        );
      }
      return params.value;
    },
  },
  {
    field: 'detail',
    headerName: 'Detail',
    width: 360,
  },
];

const rows = [
  {
    id: 1,
    label: 'Design mockups',
    detail: 'Create initial wireframes and mockups for the new dashboard',
    assignee: 'Alice',
    priority: 'High',
  },
  {
    id: 2,
    label: 'Design mockups',
    detail: 'Design mobile responsive layouts',
    assignee: 'Alice',
    priority: 'High',
  },
  {
    id: 3,
    label: 'Design mockups',
    detail: 'Update color scheme and typography',
    assignee: 'Alice',
    priority: 'Medium',
  },
  {
    id: 4,
    label: 'Code review',
    detail: 'Review authentication module PR #123',
    assignee: 'Bob',
    priority: 'High',
  },
  {
    id: 5,
    label: 'Code review',
    detail: 'Review API endpoint refactoring',
    assignee: 'Bob',
    priority: 'Medium',
  },
  {
    id: 6,
    label: 'Code review',
    detail: 'Review database migration scripts',
    assignee: 'Bob',
    priority: 'Medium',
  },
  {
    id: 7,
    label: 'Design mockups',
    detail: 'Create icon set for navigation',
    assignee: 'Charlie',
    priority: 'Low',
  },
  {
    id: 8,
    label: 'Code review',
    detail: 'Review test coverage improvements',
    assignee: 'Charlie',
    priority: 'Low',
  },
];

export default function RowGroupingMultipleFields() {
  const apiRef = useGridApiRef();
  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['assignee', 'label'],
      },
    },
  });

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        initialState={initialState}
        defaultGroupingExpansionDepth={1}
      />
    </Box>
  );
}
