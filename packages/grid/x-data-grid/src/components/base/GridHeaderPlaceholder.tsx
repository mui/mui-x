import * as React from 'react';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export function GridHeaderPlaceholder() {
  const rootProps = useGridRootProps();

  return (
    <div>
      <rootProps.components.Header {...rootProps.componentsProps?.header} />
    </div>
  );
}
