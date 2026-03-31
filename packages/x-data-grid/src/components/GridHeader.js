import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridPreferencesPanel } from './panel/GridPreferencesPanel';
export function GridHeader() {
    const rootProps = useGridRootProps();
    return (_jsxs(React.Fragment, { children: [_jsx(GridPreferencesPanel, {}), rootProps.showToolbar && (_jsx(rootProps.slots.toolbar
            // Fixes error augmentation issue https://github.com/mui/mui-x/pull/15255#issuecomment-2454721612
            , { ...rootProps.slotProps?.toolbar }))] }));
}
