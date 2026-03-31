'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { GridApiContext } from '../components/GridApiContext';
import { GridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { GridRootPropsContext } from './GridRootPropsContext';
import { GridConfigurationContext } from '../components/GridConfigurationContext';
import { GridPanelContextProvider } from '../components/panel/GridPanelContext';
import { GridCSSVariablesContext } from '../utils/css/context';
export function GridContextProvider({ privateApiRef, configuration, props, children, }) {
    const apiRef = React.useRef(privateApiRef.current.getPublicApi());
    return (_jsx(GridConfigurationContext.Provider, { value: configuration, children: _jsx(GridRootPropsContext.Provider, { value: props, children: _jsx(GridPrivateApiContext.Provider, { value: privateApiRef, children: _jsx(GridApiContext.Provider, { value: apiRef, children: _jsx(GridPanelContextProvider, { children: _jsx(GridCSSVariablesContext, { children: children }) }) }) }) }) }));
}
