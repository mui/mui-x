import * as React from 'react';
import { ApiRef } from '../../models/api/apiRef';
import { GridApi } from '../../models/api/gridApi';
import { useLogger } from '../utils/useLogger';

const EventEmitter = require('events').EventEmitter;

/**
 * Hook that instantiate an ApiRef to pass in component prop.
 */
export const useApiRef = (): ApiRef => {
  const logger = useLogger('useApiRef');
  logger.debug('Initialising grid api with EventEmitter.');

  return React.useRef<GridApi>(new EventEmitter());
};
