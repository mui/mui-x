import * as React from 'react';
import { Logger } from '../../models/logger';

import { GridApiRef } from '../../models/api/gridApiRef';

export function useGridLogger(apiRef: GridApiRef, name: string): Logger {
  const logger = React.useRef<Logger | null>(null);

  if (logger.current) {
    return logger.current;
  }

  const newLogger = apiRef.current.getLogger(name);
  logger.current = newLogger;

  return newLogger;
}
