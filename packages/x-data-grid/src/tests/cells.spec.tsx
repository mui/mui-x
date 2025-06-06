import * as React from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';

import EditIcon from '@mui/icons-material/Edit';

function GridActionsCellItemLabelTyping() {
  return (
    <React.Fragment>
      <GridActionsCellItem label="test" icon={<EditIcon fontSize="small" />} />
      <GridActionsCellItem
        showInMenu
        label={<div>test</div>}
        icon={<EditIcon fontSize="small" />}
      />
      {/* @ts-expect-error */}
      <GridActionsCellItem label={<div>test</div>} icon={<EditIcon fontSize="small" />} />
    </React.Fragment>
  );
}
