import * as React from 'react';
import { DataGridPro, GridToolbarContainer } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MessageIcon from '@mui/icons-material/Message';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import GridViewIcon from '@mui/icons-material/ViewModule';
import ListViewIcon from '@mui/icons-material/ViewList';

function MessageAction(params) {
  const handleMessage = (event) => {
    event.stopPropagation();
    console.log(`send message to ${params.row.phone}`);
  };
  return (
    <IconButton aria-label="Message" onClick={handleMessage}>
      <MessageIcon />
    </IconButton>
  );
}

function ListViewCell(params) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        height: '100%',
        gap: 2,
      }}
    >
      <Avatar sx={{ width: 32, height: 32, backgroundColor: params.row.avatar }} />
      <Stack sx={{ flexGrow: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          {params.row.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {params.row.position}
        </Typography>
      </Stack>
      <MessageAction {...params} />
    </Stack>
  );
}

const listColDef = {
  field: 'listColumn',
  renderCell: ListViewCell,
};

const VISIBLE_FIELDS = ['avatar', 'name', 'position'];

function Toolbar({ view, onChangeView }) {
  return (
    <GridToolbarContainer
      sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 1 }}
    >
      <ToggleButtonGroup
        size="small"
        sx={{ ml: 'auto' }}
        value={view}
        exclusive
        onChange={(_, newView) => {
          if (newView) {
            onChangeView(newView);
          }
        }}
      >
        <ToggleButton
          size="small"
          color="primary"
          sx={{ gap: 0.5 }}
          value="grid"
          selected={view === 'grid'}
        >
          <GridViewIcon fontSize="small" /> Grid
        </ToggleButton>
        <ToggleButton
          size="small"
          color="primary"
          sx={{ gap: 0.5 }}
          value="list"
          selected={view === 'list'}
        >
          <ListViewIcon fontSize="small" /> List
        </ToggleButton>
      </ToggleButtonGroup>
    </GridToolbarContainer>
  );
}

export default function ListView() {
  const [view, setView] = React.useState('list');
  const isListView = view === 'list';

  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 20,
    visibleFields: VISIBLE_FIELDS,
  });

  const columns = React.useMemo(() => {
    return [
      ...data.columns,
      {
        type: 'actions',
        field: 'actions',
        width: 75,
        getActions: (params) => [<MessageAction {...params} />],
      },
    ];
  }, [data.columns]);

  const rowHeight = isListView ? 64 : 52;

  return (
    <div style={{ maxWidth: 360, height: 600 }}>
      <DataGridPro
        {...data}
        loading={loading}
        columns={columns}
        rowHeight={rowHeight}
        unstable_listView={isListView}
        unstable_listColumn={listColDef}
        slots={{
          toolbar: Toolbar,
        }}
        slotProps={{
          toolbar: {
            view,
            onChangeView: setView,
          },
        }}
        sx={{ backgroundColor: 'background.paper' }}
      />
    </div>
  );
}
