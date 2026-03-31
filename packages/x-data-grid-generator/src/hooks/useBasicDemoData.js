import * as React from 'react';
import { getBasicGridData } from '../services';
export const useBasicDemoData = (nbRows, nbCols) => {
    return React.useMemo(() => getBasicGridData(nbRows, nbCols), [nbRows, nbCols]);
};
