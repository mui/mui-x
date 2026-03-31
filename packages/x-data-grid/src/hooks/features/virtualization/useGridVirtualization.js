'use client';
import * as React from 'react';
import { EMPTY_RENDER_CONTEXT, } from '@mui/x-virtualizer';
import { isJSDOM } from '../../../utils/isJSDOM';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridEventPriority } from '../../utils';
const HAS_LAYOUT = !isJSDOM;
// XXX: We want to use the virtualizer as the source of truth for its state, but this needs to
// stay because some parts of the grid require the `virtualization` state during initialization.
export const virtualizationStateInitializer = (state, props) => {
    const { disableVirtualization, autoHeight } = props;
    const virtualization = {
        enabled: !disableVirtualization && HAS_LAYOUT,
        enabledForColumns: !disableVirtualization && HAS_LAYOUT,
        enabledForRows: !disableVirtualization && !autoHeight && HAS_LAYOUT,
        renderContext: EMPTY_RENDER_CONTEXT,
    };
    return {
        ...state,
        virtualization,
    };
};
export function useGridVirtualization(apiRef, rootProps) {
    const { autoHeight, disableVirtualization } = rootProps;
    /*
     * API METHODS
     */
    const setVirtualization = (enabled) => {
        const { virtualizer } = apiRef.current;
        enabled &&= HAS_LAYOUT;
        const snapshot = virtualizer.store.getSnapshot();
        if (snapshot.virtualization.enabled === enabled &&
            snapshot.virtualization.enabledForRows === enabled &&
            snapshot.virtualization.enabledForColumns === enabled) {
            return;
        }
        virtualizer.store.set('virtualization', {
            ...virtualizer.store.state.virtualization,
            enabled,
            enabledForColumns: enabled,
            enabledForRows: enabled && !autoHeight,
        });
    };
    const setColumnVirtualization = (enabled) => {
        const { virtualizer } = apiRef.current;
        enabled &&= HAS_LAYOUT;
        const snapshot = virtualizer.store.getSnapshot();
        if (snapshot.virtualization.enabledForColumns === enabled) {
            return;
        }
        virtualizer.store.set('virtualization', {
            ...virtualizer.store.state.virtualization,
            enabledForColumns: enabled,
        });
    };
    const api = {
        unstable_setVirtualization: setVirtualization,
        unstable_setColumnVirtualization: setColumnVirtualization,
    };
    useGridApiMethod(apiRef, api, 'public');
    const forceUpdateRenderContext = () => {
        const { virtualizer } = apiRef.current;
        virtualizer?.api.scheduleUpdateRenderContext();
    };
    apiRef.current.register('private', {
        updateRenderContext: forceUpdateRenderContext,
    });
    /*
     * EFFECTS
     */
    useGridEventPriority(apiRef, 'sortedRowsSet', forceUpdateRenderContext);
    useGridEventPriority(apiRef, 'paginationModelChange', forceUpdateRenderContext);
    useGridEventPriority(apiRef, 'columnsChange', forceUpdateRenderContext);
    /* eslint-disable react-hooks/exhaustive-deps */
    React.useEffect(() => {
        if (!apiRef.current.virtualizer) {
            return;
        }
        setVirtualization(!rootProps.disableVirtualization);
    }, [apiRef, disableVirtualization, autoHeight]);
    /* eslint-enable react-hooks/exhaustive-deps */
}
