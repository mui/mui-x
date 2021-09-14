import * as React from 'react';
import Rating from '@mui/material/Rating';
import { GridRenderEditCellParams } from '@mui/x-data-grid';
import { createStyles, makeStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
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
    }),
  { defaultTheme },
);

function EditRating(props: GridRenderEditCellParams) {
  const { id, value, api, field } = props;
  const classes = useStyles();

  const handleChange = (event: any) => {
    api.setEditCellValue({ id, field, value: Number(event.target.value) }, event);
    // Check if the event is not from the keyboard
    // https://github.com/facebook/react/issues/7407
    if (event.nativeEvent.clientX !== 0 && event.nativeEvent.clientY !== 0) {
      api.commitCellChange({ id, field });
      api.setCellMode(id, field, 'view');
    }
  };

  const handleRef = (element: HTMLElement | undefined) => {
    if (element) {
      element.querySelector<HTMLElement>(`input[value="${value}"]`)!.focus();
    }
  };

  return (
    <div className={classes.root}>
      <Rating
        ref={handleRef}
        name="rating"
        value={Number(value)}
        precision={1}
        onChange={handleChange}
      />
      {Number(value)}
    </div>
  );
}

export function renderEditRating(params: GridRenderEditCellParams) {
  return <EditRating {...params} />;
}
