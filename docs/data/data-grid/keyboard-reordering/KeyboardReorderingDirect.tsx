import * as React from 'react';
import KeyboardReorderPrototype from './KeyboardReorderPrototype';

export default function KeyboardReorderingDirect() {
  return (
    <KeyboardReorderPrototype
      highlightTrigger="none"
      moveFromAnyCell
      moveSelectedRows
    />
  );
}
