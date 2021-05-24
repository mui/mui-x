/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import Rating from '@material-ui/lab/Rating';
import { DataGrid, GridCellParams } from '@material-ui/data-grid';

function renderRating(params) {
  return <Rating readOnly value={params.value} />;
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: 16,
  },
});

function RatingEditInputCell(props: GridCellParams) {
  const { id, value, api, field } = props;
  const classes = useStyles();

  const handleChange = React.useCallback(
    (event) => {
      const editProps = {
        value: Number(event.target.value),
      };
      api.commitCellChange({ id, field, props: editProps });
      api.setCellMode(id, field, 'view');
    },
    [api, field, id],
  );

  return (
    <div className={classes.root}>
      <Rating value={Number(value)} onChange={handleChange} />
    </div>
  );
}

function renderRatingEditInputCell(params) {
  return <RatingEditInputCell {...params} />;
}

export default function RenderRatingEditCellGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}

const columns = [
  {
    field: 'places',
    headerName: 'Places',
    width: 120,
  },
  {
    field: 'rating',
    headerName: 'Rating',
    renderCell: renderRating,
    renderEditCell: renderRatingEditInputCell,
    editable: true,
    width: 180,
    type: 'number',
  },
];

const rows = [
  { id: 1, places: 'Barcelona', rating: 5 },
  { id: 2, places: 'Rio de Janeiro', rating: 4 },
  { id: 3, places: 'London', rating: 3 },
  { id: 4, places: 'New York', rating: 2 },
];
