import * as React from 'react';
import { GridApiRef } from '../../models';

/**
 * Hook that instantiate a [[GridApiRef]].
 */
export const useGridApiRef = () => React.useRef({}) as GridApiRef;
