import * as React from 'react';
import { ApiRef } from '@mui/x-internals/apiRef';
import { Logger } from '../../models/logger';
import { GridPrivateApiCommon } from '../../models/api/gridApiCommon';

export function useGridLogger<PrivateApi extends GridPrivateApiCommon>(
  privateApiRef: ApiRef<PrivateApi>,
  name: string,
): Logger {
  const logger = React.useRef<Logger | null>(null);

  if (logger.current) {
    return logger.current;
  }

  const newLogger = privateApiRef.current.getLogger(name);
  logger.current = newLogger;

  return newLogger;
}
