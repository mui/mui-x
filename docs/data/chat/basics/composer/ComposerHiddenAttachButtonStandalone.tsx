'use client';
import * as React from 'react';
import { ComposerDemoShell } from './ComposerDemoShell';

export default function ComposerHiddenAttachButtonStandalone() {
  return (
    <ComposerDemoShell
      hideAttachButton
      helperText="This toolbar omits ChatComposerAttachButton, leaving only the send action."
    />
  );
}
