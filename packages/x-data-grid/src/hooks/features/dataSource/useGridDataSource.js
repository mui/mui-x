'use client';
import * as React from 'react';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridRegisterStrategyProcessor } from '../../core/strategyProcessing/useGridRegisterStrategyProcessor';
import { useGridEvent as addEventHandler } from '../../utils/useGridEvent';
import { useGridDataSourceBase } from './useGridDataSourceBase';
/**
 * Community version of the data source hook. Contains implementation of the `useGridDataSourceBase` hook.
 */
export const useGridDataSource = (apiRef, props) => {
    const { api, strategyProcessor, events, setStrategyAvailability } = useGridDataSourceBase(apiRef, props);
    useGridApiMethod(apiRef, api.public, 'public');
    useGridRegisterStrategyProcessor(apiRef, strategyProcessor.strategyName, strategyProcessor.group, strategyProcessor.processor);
    Object.entries(events).forEach(([event, handler]) => {
        addEventHandler(apiRef, event, handler);
    });
    React.useEffect(() => {
        setStrategyAvailability();
    }, [setStrategyAvailability]);
};
