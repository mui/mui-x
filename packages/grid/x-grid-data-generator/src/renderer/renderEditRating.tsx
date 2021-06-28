import * as React from 'react';
import Rating from '@material-ui/lab/Rating';
import { GridCellParams } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    lineHeight: '24px',
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(1),
    '& .MuiRating-root': {
      marginRight: theme.spacing(1),
    },
  },
}));

function EditRating(props: GridCellParams) {
  const { id, value, api, field } = props;
  const classes = useStyles();

  const handleChange = (event) => {
    const editProps = {
      value: Number(event.target.value),
    };
    api.commitCellChange({ id, field, props: editProps });
    api.setCellMode(id, field, 'view');
  };

  return (
    <div className={classes.root}>
      <Rating value={Number(value)} onChange={handleChange} />
      {Math.round(Number(value) * 10) / 10}
    </div>
  );
}

export function renderEditRating(params) {
  return <EditRating {...params} />;
}
