'use client';
import * as React from 'react';
import { useGridEvent as addEventHandler, useGridApiMethod, } from '@mui/x-data-grid';
import { useGridRegisterStrategyProcessor, } from '@mui/x-data-grid/internals';
import { INITIAL_STATE, useGridDataSourceBasePro } from './useGridDataSourceBasePro';
function getKeyPro(params) {
    return JSON.stringify([
        params.filterModel,
        params.sortModel,
        params.groupKeys,
        params.start,
        params.end,
    ]);
}
export const dataSourceStateInitializer = (state) => {
    return {
        ...state,
        dataSource: INITIAL_STATE,
    };
};
const options = {
    cacheOptions: {
        getKey: getKeyPro,
    },
};
export const useGridDataSourcePro = (apiRef, props) => {
    const { api, flatTreeStrategyProcessor, groupedDataStrategyProcessor, events, setStrategyAvailability, } = useGridDataSourceBasePro(apiRef, props, options);
    useGridApiMethod(apiRef, api.public, 'public');
    useGridApiMethod(apiRef, api.private, 'private');
    useGridRegisterStrategyProcessor(apiRef, flatTreeStrategyProcessor.strategyName, flatTreeStrategyProcessor.group, flatTreeStrategyProcessor.processor);
    useGridRegisterStrategyProcessor(apiRef, groupedDataStrategyProcessor.strategyName, groupedDataStrategyProcessor.group, groupedDataStrategyProcessor.processor);
    Object.entries(events).forEach(([event, handler]) => {
        addEventHandler(apiRef, event, handler);
    });
    React.useEffect(() => {
        setStrategyAvailability();
    }, [setStrategyAvailability]);
};
