'use client';
import * as React from 'react';
import { ComposerDemoShell } from '../../ComposerDemoShell';

export default function ComposerHelperTextStandalone() {
  return (
    // @focus @padding 2
    <ComposerDemoShell helperText="Files are uploaded after you send." />
  );
}
