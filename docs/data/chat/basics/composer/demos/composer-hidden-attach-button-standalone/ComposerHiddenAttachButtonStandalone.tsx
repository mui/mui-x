'use client';
import * as React from 'react';
import { ComposerDemoShell } from '../../ComposerDemoShell';

export default function ComposerHiddenAttachButtonStandalone() {
  return (
    // @focus-start @padding 2
    <ComposerDemoShell
      hideAttachButton
      helperText="This toolbar omits ChatComposerAttachButton, leaving only the send action."
    />
    // @focus-end
  );
}
