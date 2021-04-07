import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import { DataGrid, GridCellParams } from '@material-ui/data-grid';
import { renderRating } from '@material-ui/x-grid-data-generator';

const useStyles = makeStyles({
  root: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingLeft: 20,
  },
});
export function GridRatingEditInputCell(props: GridCellParams) {
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
  return <GridRatingEditInputCell {...params} />;
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

export default function CustomRatingOperator() {
  return <DataGrid rows={rows} columns={columns} autoHeight hideFooter />;
}
