'use client';
import * as React from 'react';
import { ComposerDemoShell } from './ComposerDemoShell';

export default function ComposerCustomPlaceholderStandalone() {
  return (
    <ComposerDemoShell
      inputProps={{ placeholder: 'Ask me anything...' }}
      helperText="This standalone example customizes the textarea placeholder directly."
    />
  );
}
