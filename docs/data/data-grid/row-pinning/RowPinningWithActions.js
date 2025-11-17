import * as React from 'react';
import {
  DataGridPro,
  GridActionsCellItem,
  GridActionsCell,
} from '@mui/x-data-grid-pro';
import ArrowUpIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownIcon from '@mui/icons-material/ArrowDownward';
import Tooltip from '@mui/material/Tooltip';
import {
  randomId,
  randomTraderName,
  randomCity,
  randomUserName,
  randomEmail,
} from '@mui/x-data-grid-generator';

const data = [];

function getRow() {
  return {
    id: randomId(),
    name: randomTraderName(),
    city: randomCity(),
    username: randomUserName(),
    email: randomEmail(),
  };
}

for (let i = 0; i < 20; i += 1) {
  data.push(getRow());
}

const PinningContext = React.createContext({
  pinnedRowsIds: { top: [], bottom: [] },
  pinToBottom: () => {},
  pinToTop: () => {},
  unpin: () => {},
});

function ActionsCell(props) {
  const { pinnedRowsIds, pinToBottom, pinToTop, unpin } =
    React.useContext(PinningContext);
  const isPinnedTop = pinnedRowsIds.top.includes(props.id);
  const isPinnedBottom = pinnedRowsIds.bottom.includes(props.id);

  if (isPinnedTop || isPinnedBottom) {
    return (
      <GridActionsCell {...props}>
        <GridActionsCellItem
          label="Unpin"
          icon={
            <Tooltip title="Unpin">
              {isPinnedTop ? <ArrowDownIcon /> : <ArrowUpIcon />}
            </Tooltip>
          }
          onClick={() => unpin(props.id)}
        />
      </GridActionsCell>
    );
  }

  return (
    <GridActionsCell {...props}>
      <GridActionsCellItem
        icon={
          <Tooltip title="Pin at the top">
            <ArrowUpIcon />
          </Tooltip>
        }
        label="Pin at the top"
        onClick={() => pinToTop(props.id)}
      />
      <GridActionsCellItem
        icon={
          <Tooltip title="Pin at the bottom">
            <ArrowDownIcon />
          </Tooltip>
        }
        label="Pin at the bottom"
        onClick={() => pinToBottom(props.id)}
      />
    </GridActionsCell>
  );
}

const columns = [
  {
    field: 'actions',
    type: 'actions',
    width: 100,
    renderCell: (params) => <ActionsCell {...params} />,
  },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'city', headerName: 'City', width: 150 },
  { field: 'username', headerName: 'Username' },
  { field: 'email', headerName: 'Email', width: 200 },
];

export default function RowPinningWithActions() {
  const [pinnedRowsIds, setPinnedRowsIds] = React.useState({
    top: [],
    bottom: [],
  });

  const { rows, pinnedRows } = React.useMemo(() => {
    const rowsData = [];
    const pinnedRowsData = {
      top: [],
      bottom: [],
    };

    data.forEach((row) => {
      if (pinnedRowsIds.top.includes(row.id)) {
        pinnedRowsData.top.push(row);
      } else if (pinnedRowsIds.bottom.includes(row.id)) {
        pinnedRowsData.bottom.push(row);
      } else {
        rowsData.push(row);
      }
    });

    return {
      rows: rowsData,
      pinnedRows: pinnedRowsData,
    };
  }, [pinnedRowsIds]);

  const pinToTop = React.useCallback((id) => {
    setPinnedRowsIds((prevPinnedRowsIds) => ({
      ...prevPinnedRowsIds,
      top: [...prevPinnedRowsIds.top, id],
    }));
  }, []);

  const pinToBottom = React.useCallback((id) => {
    setPinnedRowsIds((prevPinnedRowsIds) => ({
      ...prevPinnedRowsIds,
      bottom: [...prevPinnedRowsIds.bottom, id],
    }));
  }, []);

  const unpin = React.useCallback((id) => {
    setPinnedRowsIds((prevPinnedRowsIds) => ({
      top: prevPinnedRowsIds.top.filter((rowId) => rowId !== id),
      bottom: prevPinnedRowsIds.bottom.filter((rowId) => rowId !== id),
    }));
  }, []);

  const pinningContextValue = React.useMemo(
    () => ({
      pinnedRowsIds,
      pinToTop,
      pinToBottom,
      unpin,
    }),
    [pinnedRowsIds, pinToTop, pinToBottom, unpin],
  );

  return (
    <div style={{ height: 500, width: '100%' }}>
      <PinningContext.Provider value={pinningContextValue}>
        <DataGridPro columns={columns} pinnedRows={pinnedRows} rows={rows} />
      </PinningContext.Provider>
    </div>
  );
}
