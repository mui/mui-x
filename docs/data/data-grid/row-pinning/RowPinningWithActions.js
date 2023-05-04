import * as React from 'react';
import { DataGridPro, GridActionsCellItem } from '@mui/x-data-grid-pro';
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

  const columns = React.useMemo(
    () => [
      {
        field: 'actions',
        type: 'actions',
        width: 100,
        getActions: (params) => {
          const isPinnedTop = pinnedRowsIds.top.includes(params.id);
          const isPinnedBottom = pinnedRowsIds.bottom.includes(params.id);
          if (isPinnedTop || isPinnedBottom) {
            return [
              <GridActionsCellItem
                label="Unpin"
                icon={
                  <Tooltip title="Unpin">
                    {isPinnedTop ? <ArrowDownIcon /> : <ArrowUpIcon />}
                  </Tooltip>
                }
                onClick={() =>
                  setPinnedRowsIds((prevPinnedRowsIds) => ({
                    top: prevPinnedRowsIds.top.filter(
                      (rowId) => rowId !== params.id,
                    ),
                    bottom: prevPinnedRowsIds.bottom.filter(
                      (rowId) => rowId !== params.id,
                    ),
                  }))
                }
              />,
            ];
          }
          return [
            <GridActionsCellItem
              icon={
                <Tooltip title="Pin at the top">
                  <ArrowUpIcon />
                </Tooltip>
              }
              label="Pin at the top"
              onClick={() =>
                setPinnedRowsIds((prevPinnedRowsIds) => ({
                  ...prevPinnedRowsIds,
                  top: [...prevPinnedRowsIds.top, params.id],
                }))
              }
            />,
            <GridActionsCellItem
              icon={
                <Tooltip title="Pin at the bottom">
                  <ArrowDownIcon />
                </Tooltip>
              }
              label="Pin at the bottom"
              onClick={() =>
                setPinnedRowsIds((prevPinnedRowsIds) => ({
                  ...prevPinnedRowsIds,
                  bottom: [...prevPinnedRowsIds.bottom, params.id],
                }))
              }
            />,
          ];
        },
      },
      { field: 'name', headerName: 'Name', width: 150 },
      { field: 'city', headerName: 'City', width: 150 },
      { field: 'username', headerName: 'Username' },
      { field: 'email', headerName: 'Email', width: 200 },
    ],
    [pinnedRowsIds],
  );

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPro columns={columns} pinnedRows={pinnedRows} rows={rows} />
    </div>
  );
}
