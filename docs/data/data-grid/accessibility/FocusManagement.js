import * as React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

const CorrectRenderLink = (props) => (
  <Box>
    <Link tabIndex={props.tabIndex} href="/#tab-sequence">
      more info
    </Link>
  </Box>
);

CorrectRenderLink.propTypes = {
  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
};

const WrongRenderLink = () => (
  <Box>
    <Link href="/#tab-sequence">more info</Link>
  </Box>
);

const correctColumns = [
  { field: 'link', renderCell: CorrectRenderLink, width: 200 },
];

const wrongColumns = [{ field: 'link', renderCell: WrongRenderLink, width: 200 }];

const rows = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

export default function FocusManagement() {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ flexGrow: 1, flexShrink: 0 }}>
        <p>Without focus management</p>
        <div style={{ height: 300, width: '100%' }}>
          <DataGrid rows={rows} columns={wrongColumns} hideFooterSelectedRowCount />
        </div>
      </div>
      <div style={{ flexGrow: 1, flexShrink: 0 }}>
        <p>Correct focus management</p>
        <div style={{ height: 300, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={correctColumns}
            hideFooterSelectedRowCount
          />
        </div>
      </div>
    </div>
  );
}
