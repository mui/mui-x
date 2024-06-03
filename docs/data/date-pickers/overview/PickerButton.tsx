import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';

export default function PickerButton() {
  return (
    <Card variant="outlined" sx={{ padding: 0.8 }}>
      <Button variant="contained" fullWidth>
        Submit
      </Button>
    </Card>
  );
}
