import * as React from 'react';
import { DataGridPro, GridActionsCellItem } from '@mui/x-data-grid-pro';
import ArrowUpIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownIcon from '@mui/icons-material/ArrowDownward';
import Tooltip from '@mui/material/Tooltip';

const data = [
  {
    id: 1,
    firstName: 'Walter',
    lastName: 'White',
    occupation: 'Chemistry teacher',
    birthday: '09-07-1958',
  },
  {
    id: 2,
    firstName: 'Jesse',
    lastName: 'Pinkman',
    occupation: 'Dealer',
    birthday: '09-24-1984',
  },
  {
    id: 3,
    firstName: 'Skyler',
    lastName: 'White',
    occupation: 'Bookkeeper',
    birthday: '08-11-1970',
  },
  {
    id: 4,
    firstName: 'Saul',
    lastName: 'Goodman',
    occupation: 'Lawyer',
    birthday: '',
  },
  {
    id: 5,
    firstName: 'Hank',
    lastName: 'Schrader',
    occupation: 'DEA Agent',
    birthday: '',
  },
  {
    id: 6,
    firstName: 'Gus',
    lastName: 'Fring',
    occupation: 'Restaurant owner',
    birthday: '',
  },
  {
    id: 7,
    firstName: 'Mike',
    lastName: 'Ehrmantraut',
    occupation: 'Private Investigator',
    birthday: '',
  },
  {
    id: 8,
    firstName: 'Walter',
    lastName: 'White',
    occupation: 'Chemistry teacher',
    birthday: '09-07-1958',
  },
  {
    id: 9,
    firstName: 'Jesse',
    lastName: 'Pinkman',
    occupation: 'Dealer',
    birthday: '09-24-1984',
  },
  {
    id: 10,
    firstName: 'Skyler',
    lastName: 'White',
    occupation: 'Bookkeeper',
    birthday: '08-11-1970',
  },
  {
    id: 11,
    firstName: 'Saul',
    lastName: 'Goodman',
    occupation: 'Lawyer',
    birthday: '',
  },
  {
    id: 12,
    firstName: 'Hank',
    lastName: 'Schrader',
    occupation: 'DEA Agent',
    birthday: '',
  },
  {
    id: 13,
    firstName: 'Gus',
    lastName: 'Fring',
    occupation: 'Restaurant owner',
    birthday: '',
  },
  {
    id: 14,
    firstName: 'Mike',
    lastName: 'Ehrmantraut',
    occupation: 'Private Investigator',
    birthday: '',
  },
  {
    id: 15,
    firstName: 'Walter',
    lastName: 'White',
    occupation: 'Chemistry teacher',
    birthday: '09-07-1958',
  },
  {
    id: 16,
    firstName: 'Jesse',
    lastName: 'Pinkman',
    occupation: 'Dealer',
    birthday: '09-24-1984',
  },
  {
    id: 17,
    firstName: 'Skyler',
    lastName: 'White',
    occupation: 'Bookkeeper',
    birthday: '08-11-1970',
  },
  {
    id: 18,
    firstName: 'Saul',
    lastName: 'Goodman',
    occupation: 'Lawyer',
    birthday: '',
  },
  {
    id: 19,
    firstName: 'Hank',
    lastName: 'Schrader',
    occupation: 'DEA Agent',
    birthday: '',
  },
  {
    id: 20,
    firstName: 'Gus',
    lastName: 'Fring',
    occupation: 'Restaurant owner',
    birthday: '',
  },
  {
    id: 21,
    firstName: 'Mike',
    lastName: 'Ehrmantraut',
    occupation: 'Private Investigator',
    birthday: '',
  },
];

export default function RowPinningWithActions() {
  const [pinnedRowsIds, setPinnedRowsIds] = React.useState({
    top: [20],
    bottom: [3, 2],
  });

  const pinnedRowsTop = pinnedRowsIds.top;
  const pinnedRowsBottom = pinnedRowsIds.bottom;

  const rows = [];
  const pinnedRows = {
    top: [],
    bottom: [],
  };

  data.forEach((row) => {
    if (pinnedRowsTop.includes(row.id)) {
      pinnedRows.top.push(row);
    } else if (pinnedRowsBottom.includes(row.id)) {
      pinnedRows.bottom.push(row);
    } else {
      rows.push(row);
    }
  });

  const columns = React.useMemo(
    () => [
      { field: 'id', headerName: 'ID', flex: 1 },
      { field: 'firstName', headerName: 'First name', flex: 1 },
      { field: 'lastName', headerName: 'Last name', flex: 1 },
      { field: 'occupation', headerName: 'Occupation', flex: 1 },
      { field: 'birthday', headerName: 'Birthday', flex: 1, type: 'date' },
      {
        field: 'actions',
        type: 'actions',
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
    ],
    [pinnedRowsIds],
  );

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPro columns={columns} pinnedRows={pinnedRows} rows={rows} />
    </div>
  );
}
