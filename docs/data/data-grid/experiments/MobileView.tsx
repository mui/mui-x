import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  gridColumnLookupSelector,
  GridRenderCellParams,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useMediaQuery } from '@mui/system';

function CellCard(props: GridRenderCellParams) {
  const apiRef = useGridApiContext();
  const columnLookup = useGridSelector(apiRef, gridColumnLookupSelector);

  const avatarColumn = columnLookup.avatar;
  const ratingColumn = columnLookup.rating;
  const salaryColumn = columnLookup.salary;
  const countryColumn = columnLookup.country;

  return (
    <div style={{ height: '100%' }}>
      <CardHeader
        avatar={avatarColumn.renderCell?.({
          ...props,
          value: avatarColumn?.valueGetter?.(
            props.row.avatar as never,
            props.row,
            avatarColumn,
            apiRef,
          ),
        })}
        title={props.row.name}
        subheader={
          <React.Fragment>
            <div>
              {props.row.position} @ {props.row.company}
            </div>
            {countryColumn.renderCell?.({
              ...props,
              value: props.row.country,
            })}
          </React.Fragment>
        }
        sx={{ padding: 1 }}
      />
      <Typography variant="body2" color="text.secondary" component="div">
        <Stack direction="row" gap={0.5}>
          <Link href={props.row.website} target="_blank">
            Website
          </Link>
          <Link href={`mailto:${props.row.email}`}>Email</Link>
          <Link href={`tel:${props.row.mobile}`}>Phone</Link>
        </Stack>
        <div>
          Salary:{' '}
          {salaryColumn.valueFormatter?.(
            props.row.salary as never,
            props.row,
            salaryColumn,
            apiRef,
          )}
        </div>
      </Typography>
      {ratingColumn.renderCell?.({
        ...props,
        value: props.row.rating,
      })}
    </div>
  );
}

const mobileColDef: GridColDef = {
  field: 'mobile',
  renderCell: (params) => <CellCard {...params} />,
  editable: true,
  display: 'flex',
};

export default function MobileView() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    maxColumns: 20,
    rowLength: 100,
    editable: true,
  });

  const [preferMediaQuery, setPreferMediaQuery] = React.useState(false);
  const [mobileViewState, setMobileViewState] = React.useState(false);

  const mobileViewQuery = useMediaQuery('(max-width:700px)');

  const mobileView = preferMediaQuery ? mobileViewQuery : mobileViewState;

  return (
    <div style={{ width: '100%' }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={preferMediaQuery}
            onChange={(event, checked) => setPreferMediaQuery(checked)}
          />
        }
        label="Use media query"
      />
      <FormControlLabel
        disabled={preferMediaQuery}
        control={
          <Checkbox
            checked={mobileViewState}
            onChange={(event, checked) => setMobileViewState(checked)}
          />
        }
        label="Mobile view"
      />
      <div style={{ height: '600px' }}>
        <DataGridPremium
          {...data}
          slots={{ toolbar: GridToolbar }}
          mobileView={mobileView}
          mobileColDef={mobileColDef}
          rowHeight={mobileView ? 150 : 52}
          pagination
          initialState={{
            ...data.initialState,
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
        />
      </div>
    </div>
  );
}
