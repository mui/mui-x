'use client';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { ComposerDemoShell } from './ComposerDemoShell';

export default function ComposerControlledStandalone() {
  const [value, setValue] = React.useState('');

  return (
    <ComposerDemoShell
      beforeComposer={
        <Typography variant="body2" color="text.secondary">
          Composer value: {value ? `"${value}"` : '(empty)'}
        </Typography>
      }
      composerValue={value}
      onComposerValueChange={setValue}
      helperText="The current draft value is controlled outside the composer."
    />
  );
}
