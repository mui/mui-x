import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid-premium';

function EditRating(props: GridRenderEditCellParams<any, number>) {
  const { id, value, field } = props;

  const apiRef = useGridApiContext();

  const changedThroughKeyboard = React.useRef(false);

  const handleChange = async (event: any) => {
    await apiRef.current.setEditCellValue({ id, field, value: Number(event.target.value) }, event);
    if (!changedThroughKeyboard.current) {
      apiRef.current.stopCellEditMode({ id, field });
    }
    changedThroughKeyboard.current = false;
  };

  const handleRef = (element: HTMLElement | undefined) => {
    if (element) {
      if (value !== 0) {
        element.querySelector<HTMLElement>(`input[value="${value}"]`)!.focus();
      } else {
        element.querySelector<HTMLElement>('input[value=""]')!.focus();
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key.startsWith('Arrow')) {
      changedThroughKeyboard.current = true;
    } else {
      changedThroughKeyboard.current = false;
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
        onKeyDown={handleKeyDown}
      />
      {Number(value)}
    </Box>
  );
}

export function renderEditRating(params: GridRenderEditCellParams<any, number>) {
  return <EditRating {...params} />;
}
