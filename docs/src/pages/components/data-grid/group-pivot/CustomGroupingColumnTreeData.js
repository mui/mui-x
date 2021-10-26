import * as React from 'react';
import PropTypes from 'prop-types';
import { DataGridPro, useGridApiContext, GridEvents } from '@mui/x-data-grid-pro';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export const isNavigationKey = (key) =>
  key === 'Home' ||
  key === 'End' ||
  key.indexOf('Arrow') === 0 ||
  key.indexOf('Page') === 0 ||
  key === ' ';

const CustomGridTreeDataGroupingCell = (props) => {
  const { id, field, value } = props;
  const apiRef = useGridApiContext();

  const handleKeyDown = (event) => {
    if (event.key === ' ') {
      event.stopPropagation();
    }
    if (isNavigationKey(event.key) && !event.shiftKey) {
      apiRef.current.publishEvent(GridEvents.cellNavigationKeyDown, props, event);
    }
  };

  const handleClick = (event) => {
    apiRef.current.unstable_setRowExpansion(id, !value.expanded);
    apiRef.current.setCellFocus(id, field);
    event.stopPropagation();
  };

  return (
    <Box sx={{ ml: value.depth * 4 }}>
      <div>
        {value.filteredDescendantCount > 0 ? (
          <Button
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            size="small"
          >
            See {value.filteredDescendantCount} employees
          </Button>
        ) : (
          <span />
        )}
      </div>
    </Box>
  );
};

CustomGridTreeDataGroupingCell.propTypes = {
  /**
   * The column field of the cell that triggered the event
   */
  field: PropTypes.string.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * The cell value, but if the column has valueGetter, use getValue.
   */
  value: PropTypes.shape({
    depth: PropTypes.number.isRequired,
    expanded: PropTypes.bool.isRequired,
    filteredDescendantCount: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
};

const rows = [
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
  {
    field: 'name',
    headerName: 'Name',
    valueGetter: (params) => {
      const hierarchy = params.row.hierarchy;
      return hierarchy[hierarchy.length - 1];
    },
  },
  { field: 'jobTitle', headerName: 'Job Title', width: 200 },
  {
    field: 'recruitmentDate',
    headerName: 'Recruitment Date',
    type: 'date',
    width: 150,
  },
];

const getTreeDataPath = (row) => row.hierarchy;

const groupingColDef = {
  headerName: 'Hierarchy',
  renderCell: (params) => <CustomGridTreeDataGroupingCell {...params} />,
};

export default function CustomGroupingColumnTreeData() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        treeData
        rows={rows}
        columns={columns}
        getTreeDataPath={getTreeDataPath}
        groupingColDef={groupingColDef}
      />
    </div>
  );
}
