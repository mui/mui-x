'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { GridChartsIntegrationContext } from '../components/chartsIntegration/GridChartsIntegrationContext';
import { EMPTY_CHART_INTEGRATION_CONTEXT_STATE } from '../hooks/features/chartsIntegration/useGridChartsIntegration';
export function GridChartsIntegrationContextProvider({ children, }) {
    const [chartStateLookup, setChartStateLookup] = React.useState({});
    const setChartState = React.useCallback((id, state) => {
        if (id === '') {
            return;
        }
        setChartStateLookup((prev) => ({
            ...prev,
            [id]: {
                ...(prev[id] || EMPTY_CHART_INTEGRATION_CONTEXT_STATE),
                ...state,
            },
        }));
    }, []);
    const value = React.useMemo(() => ({
        chartStateLookup,
        setChartState,
    }), [chartStateLookup, setChartState]);
    return (_jsx(GridChartsIntegrationContext.Provider, { value: value, children: children }));
}
