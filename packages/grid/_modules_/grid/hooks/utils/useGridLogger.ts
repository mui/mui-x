import * as React from 'react';
import { Logger } from '../../models/logger';
import { GridApiCommon } from '../../models/api/gridApi';
import { GridApiRef } from '../../models/api/gridApiRef';

export function useGridLogger<GridApi extends GridApiCommon>(
  apiRef: GridApiRef<GridApi>,
  name: string,
): Logger {
  const logger = React.useRef<Logger | null>(null);

  if (logger.current) {
    return logger.current;
  }

  const newLogger = apiRef.current.getLogger(name);
  logger.current = newLogger;

  return newLogger;
}
