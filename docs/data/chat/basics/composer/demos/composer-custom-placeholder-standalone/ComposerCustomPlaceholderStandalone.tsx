'use client';
import * as React from 'react';
import { ComposerDemoShell } from '../../ComposerDemoShell';

export default function ComposerCustomPlaceholderStandalone() {
  return (
    // @focus-start @padding 2
    <ComposerDemoShell
      inputProps={{ placeholder: 'Ask anything…' }}
      helperText="This standalone example customizes the textarea placeholder directly."
    />
    // @focus-end
  );
}
