'use client';
import * as React from 'react';
import { ComposerDemoShell } from './ComposerDemoShell';

export default function ComposerDisabledStandalone() {
  return (
    <ComposerDemoShell
      composerProps={{ disabled: true }}
      helperText="Disabled state comes from ChatComposer and makes the entire draft surface inert."
    />
  );
}
