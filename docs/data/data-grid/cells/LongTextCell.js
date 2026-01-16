import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';
import { randomInt, randomArrayItem } from '@mui/x-data-grid-generator';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import ClickAwayListener from '@mui/material/ClickAwayListener';

function ExpandableCell(params) {
  const { id, field, value = '', colDef } = params;
  const [hovered, setHovered] = React.useState(false);
  const [popupOpen, setPopupOpen] = React.useState(false);
  const cellRef = React.useRef(null);
  const apiRef = useGridApiContext();

  React.useEffect(() => {
    return apiRef.current.subscribeEvent('renderedRowsIntervalChange', (context) => {
      const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(id);
      if (rowIndex < context.firstRowIndex || rowIndex >= context.lastRowIndex) {
        setPopupOpen(false);
        setHovered(false);
      }
    });
  }, [apiRef, id]);

  const handleIconClick = () => {
    setPopupOpen(true);
  };

  const handleClose = () => {
    setPopupOpen(false);
    setHovered(false);
  };

  const handleDoubleClick = () => {
    setPopupOpen(false);
    setHovered(false);
    apiRef.current.startCellEditMode({ id, field });
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </Box>
      <ClickAwayListener onClickAway={handleClose}>
        <Box
          ref={cellRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => !popupOpen && setHovered(false)}
          sx={{
            inset: 0,
            position: 'absolute',
            '.MuiDataGrid-cell:has(&)': {
              position: 'relative',
              overflow: 'unset',
            },
          }}
        >
          {hovered && !popupOpen && (
            <IconButton
              size="small"
              onClick={handleIconClick}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                p: '2px',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 0,
                '&:hover': {
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                },
              }}
            >
              <OpenInFullIcon sx={{ fontSize: '0.875rem' }} />
            </IconButton>
          )}
          <Popper
            open={popupOpen}
            anchorEl={cellRef.current}
            placement="bottom-start"
            sx={{ zIndex: 1300 }}
            modifiers={[
              {
                name: 'offset',
                options: { offset: [0, -(cellRef.current?.offsetHeight ?? 0)] },
              },
            ]}
          >
            <Paper
              elevation={4}
              onDoubleClick={handleDoubleClick}
              sx={{
                p: 1,
                boxSizing: 'border-box',
                width: colDef.computedWidth * 1.25,
                maxWidth: '100%',
                minHeight: cellRef.current?.offsetHeight,
                typography: 'body2',
              }}
            >
              {value}
            </Paper>
          </Popper>
        </Box>
      </ClickAwayListener>
    </React.Fragment>
  );
}

const lines = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Aliquam dapibus, lorem vel mattis aliquet, purus lorem tincidunt mauris, in blandit quam risus sed ipsum.',
  'Maecenas non felis venenatis, porta velit quis, consectetur elit.',
  'Vestibulum commodo et odio a laoreet.',
  'Nullam cursus tincidunt auctor.',
  'Sed feugiat venenatis nulla, sit amet dictum nulla convallis sit amet.',
  'Nulla venenatis justo non felis vulputate, eu mollis metus ornare.',
  'Nam ullamcorper ligula id consectetur auctor.',
  'Phasellus et ultrices dui.',
  'Fusce facilisis egestas massa, et eleifend magna imperdiet et.',
  'Pellentesque ac metus velit.',
  'Vestibulum in massa nibh.',
  'Vestibulum pulvinar aliquam turpis, ac faucibus risus varius a.',
];

const columns = [
  { field: 'id', headerName: 'ID' },
  {
    field: 'bio',
    headerName: 'Bio',
    width: 400,
    renderCell: (params) => <ExpandableCell {...params} />,
  },
];

const rows = [];

for (let i = 0; i < 50; i += 1) {
  const bio = [];

  for (let j = 0; j < randomInt(1, 7); j += 1) {
    bio.push(randomArrayItem(lines));
  }

  rows.push({
    id: i,
    bio: bio.join(' '),
  });
}

export default function LongTextCell() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </Box>
  );
}
