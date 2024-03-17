import * as React from 'react';
import {
  DataGrid,
  useGridApiContext,
  GridCellEditStopReasons,
} from '@mui/x-data-grid';
import InputBase from '@mui/material/InputBase';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import {
  randomInt,
  randomUserName,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

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

function isKeyboardEvent(event) {
  return !!event.key;
}

function EditTextarea(props) {
  const { id, field, value, colDef, hasFocus } = props;
  const [valueState, setValueState] = React.useState(value);
  const [anchorEl, setAnchorEl] = React.useState();
  const [inputRef, setInputRef] = React.useState(null);
  const apiRef = useGridApiContext();

  React.useLayoutEffect(() => {
    if (hasFocus && inputRef) {
      inputRef.focus();
    }
  }, [hasFocus, inputRef]);

  const handleRef = React.useCallback((el) => {
    setAnchorEl(el);
  }, []);

  const handleChange = React.useCallback(
    (event) => {
      const newValue = event.target.value;
      setValueState(newValue);
      apiRef.current.setEditCellValue(
        { id, field, value: newValue, debounceMs: 200 },
        event,
      );
    },
    [apiRef, field, id],
  );

  return (
    <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
      <div
        ref={handleRef}
        style={{
          height: 1,
          width: colDef.computedWidth,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      {anchorEl && (
        <Popper open anchorEl={anchorEl} placement="bottom-start">
          <Paper elevation={1} sx={{ p: 1, minWidth: colDef.computedWidth }}>
            <InputBase
              multiline
              rows={4}
              value={valueState}
              sx={{ textarea: { resize: 'both' }, width: '100%' }}
              onChange={handleChange}
              inputRef={(ref) => setInputRef(ref)}
            />
          </Paper>
        </Popper>
      )}
    </div>
  );
}

const multilineColumn = {
  type: 'string',
  renderEditCell: (params) => <EditTextarea {...params} />,
};

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'username', headerName: 'Name', width: 150 },
  { field: 'age', headerName: 'Age', width: 80, type: 'number' },
  {
    field: 'bio',
    headerName: 'Bio',
    width: 400,
    editable: true,
    ...multilineColumn,
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
    username: randomUserName(),
    age: randomInt(10, 80),
    bio: bio.join(' '),
  });
}

export default function MultilineEditing() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        onCellEditStop={(params, event) => {
          if (params.reason !== GridCellEditStopReasons.enterKeyDown) {
            return;
          }
          if (isKeyboardEvent(event) && !event.ctrlKey && !event.metaKey) {
            event.defaultMuiPrevented = true;
          }
        }}
      />
    </div>
  );
}
