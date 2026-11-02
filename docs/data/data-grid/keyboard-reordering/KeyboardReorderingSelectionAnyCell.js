import * as React from 'react';
import KeyboardReorderPrototype from './KeyboardReorderPrototype';

export default function KeyboardReorderingSelectionAnyCell() {
  return (
    <KeyboardReorderPrototype
      highlightTrigger="escape"
      selectionIsHighlight
      moveFromAnyCell
    />
  );
}
