import * as React from 'react';
import { GridApiCommon } from '../../models';

/**
 * Hook that instantiate a [[GridApiRef]].
 */
export const useGridApiRef = <Api extends GridApiCommon>() =>
  React.useRef({}) as React.MutableRefObject<Api>;
