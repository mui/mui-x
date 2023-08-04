import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { DataGrid, GridEditInputCell } from '@mui/x-data-grid';

const StyledBox = styled(Box)(({ theme }) => ({
  height: 400,
  width: '100%',
  '& .MuiDataGrid-cell--editable': {
    backgroundColor: theme.palette.mode === 'dark' ? '#376331' : 'rgb(217 243 190)',
    '& .MuiInputBase-root': {
      height: '100%',
    },
  },
  '& .Mui-error': {
    backgroundColor: `rgb(126,10,15, ${theme.palette.mode === 'dark' ? 0 : 0.1})`,
    color: theme.palette.mode === 'dark' ? '#ff4343' : '#750f0f',
  },
}));

let promiseTimeout;
function validateName(username) {
  const existingUsers = rows.map((row) => row.name.toLowerCase());

  return new Promise((resolve) => {
    promiseTimeout = setTimeout(() => {
      const exists = existingUsers.includes(username.toLowerCase());
      resolve(exists ? `${username} is already taken.` : null);
    }, Math.random() * 500 + 100); // simulate network latency
  });
}

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

function NameEditInputCell(props) {
  const { error } = props;

  return (
    <StyledTooltip open={!!error} title={error}>
      <GridEditInputCell {...props} />
    </StyledTooltip>
  );
}

function renderEditName(params) {
  return <NameEditInputCell {...params} />;
}

export default function ValidateServerNameGrid() {
  const preProcessEditCellProps = async (params) => {
    const errorMessage = await validateName(params.props.value.toString());
    return { ...params.props, error: errorMessage };
  };

  const columns = [
    {
      field: 'name',
      headerName: 'MUI Contributor',
      width: 180,
      editable: true,
      preProcessEditCellProps,
      renderEditCell: renderEditName,
    },
  ];

  React.useEffect(() => {
    return () => {
      clearTimeout(promiseTimeout);
    };
  }, []);

  return (
    <StyledBox>
      <DataGrid
        rows={rows}
        columns={columns}
        isCellEditable={(params) => params.row.id === 5}
      />
    </StyledBox>
  );
}

const rows = [
  {
    id: 1,
    name: 'Damien',
  },
  {
    id: 2,
    name: 'Olivier',
  },
  {
    id: 3,
    name: 'Danail',
  },
  {
    id: 4,
    name: 'Matheus',
  },
  {
    id: 5,
    name: 'You?',
  },
];
