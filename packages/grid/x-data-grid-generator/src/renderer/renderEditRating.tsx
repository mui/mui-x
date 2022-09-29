import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid-premium';

function EditRating(props: GridRenderEditCellParams<number>) {
  const { id, value, field } = props;

  const apiRef = useGridApiContext();

  const handleChange = (event: any) => {
    apiRef.current.setEditCellValue({ id, field, value: Number(event.target.value) }, event);
    // Check if the event is not from the keyboard
    // https://github.com/facebook/react/issues/7407
    if (event.nativeEvent.clientX !== 0 && event.nativeEvent.clientY !== 0) {
      apiRef.current.commitCellChange({ id, field });
      apiRef.current.setCellMode(id, field, 'view');
    }
  };

  const handleRef = (element: HTMLElement | undefined) => {
    if (element) {
      element.querySelector<HTMLElement>(`input[value="${value}"]`)!.focus();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        lineHeight: '24px',
        color: 'text.secondary',
        mr: 1,
      }}
    >
      <Rating
        ref={handleRef}
        name="rating"
        value={Number(value)}
        precision={1}
        onChange={handleChange}
        sx={{ mr: 1 }}
      />
      {Number(value)}
    </Box>
  );
}

export function renderEditRating(params: GridRenderEditCellParams<number>) {
  return <EditRating {...params} />;
}
