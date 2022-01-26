import * as React from 'react';
import { GridApiCommon, GridApiRef } from '../../models';

/**
 * Hook that instantiate a [[GridApiRef]].
 */
export const useGridApiRef = <GridApi extends GridApiCommon>() =>
  React.useRef({}) as GridApiRef<GridApi>;
