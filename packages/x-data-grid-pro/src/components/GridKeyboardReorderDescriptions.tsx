'use client';
import * as React from 'react';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { getKeyboardReorderDescriptionId } from '../hooks/features/keyboardReorder/keyboardReorderUtils';
import type { KeyboardReorderDescriptionKind } from '../hooks/features/keyboardReorder/keyboardReorderUtils';
import {
  getKeyboardReorderDescriptionText,
  isKeyboardReorderDescriptionRendered,
} from '../hooks/features/keyboardReorder/useGridKeyboardReorderDescription';

/**
 * The texts that describe the keys that move a row or a column, for screen readers.
 * Rendered once per grid, and referenced with `aria-describedby` by the headers and a cell.
 * `hidden` keeps the virtual cursor from reading them as content.
 */
export function GridKeyboardReorderDescriptions() {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();

  const renderDescription = (kind: KeyboardReorderDescriptionKind) => {
    if (!isKeyboardReorderDescriptionRendered(apiRef, rootProps, kind)) {
      return null;
    }
    return (
      <div hidden id={getKeyboardReorderDescriptionId(apiRef, kind)}>
        {getKeyboardReorderDescriptionText(apiRef, kind)}
      </div>
    );
  };

  return (
    <React.Fragment>
      {renderDescription('row')}
      {renderDescription('column')}
    </React.Fragment>
  );
}
