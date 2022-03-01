import * as React from 'react';
import { Logger } from '../../models/logger';
import { GridApiCommon } from '../../models/api/gridApiCommon';

export function useGridLogger<Api extends GridApiCommon>(
  apiRef: React.MutableRefObject<Api>,
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
