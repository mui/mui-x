import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { GridCellParams } from '@mui/x-data-grid-pro';
import Rating from '@mui/material/Rating';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        display: 'flex',
        alignItems: 'center',
        lineHeight: '24px',
        color: theme.palette.text.secondary,
        '& .MuiRating-root': {
          marginRight: theme.spacing(1),
        },
      },
    }),
  { defaultTheme },
);

interface RatingValueProps {
  name: string;
  value: number;
}

const RatingValue = React.memo(function RatingValue(props: RatingValueProps) {
  const { name, value } = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Rating name={name} value={value} readOnly /> {Math.round(Number(value) * 10) / 10}
    </div>
  );
});

export function renderRating(params: GridCellParams) {
  return <RatingValue value={Number(params.value)} name={params.row.id.toString()} />;
}
