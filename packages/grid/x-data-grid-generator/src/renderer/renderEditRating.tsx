import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { GridRenderEditCellParams } from '@mui/x-data-grid';

function EditRating(props: GridRenderEditCellParams) {
  const { id, value, api, field } = props;

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

export function renderEditRating(params: GridRenderEditCellParams) {
  return <EditRating {...params} />;
}
