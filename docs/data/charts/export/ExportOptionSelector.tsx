import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function ExportOptionSelector(props: {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  formats: {
    print: boolean;
    'image/png': boolean;
    'image/jpeg': boolean;
    'image/webp': boolean;
  };
}) {
  const { handleChange, formats } = props;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <FormControl>
      <FormLabel>Export Options</FormLabel>
      <FormGroup row={!matches}>
        <FormControlLabel
          label="Print"
          control={
            <Checkbox name="print" checked={formats.print} onChange={handleChange} />
          }
        />
        <FormControlLabel
          label="image/png"
          control={
            <Checkbox
              name="image/png"
              checked={formats['image/png']}
              onChange={handleChange}
            />
          }
        />
        <FormControlLabel
          label="image/jpeg"
          control={
            <Checkbox
              name="image/jpeg"
              checked={formats['image/jpeg']}
              onChange={handleChange}
            />
          }
        />
        <FormControlLabel
          label="image/webp"
          control={
            <Checkbox
              name="image/webp"
              checked={formats['image/webp']}
              onChange={handleChange}
            />
          }
        />
      </FormGroup>
    </FormControl>
  );
}
