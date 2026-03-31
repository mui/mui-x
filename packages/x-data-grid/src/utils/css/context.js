'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridConfiguration } from '../../hooks/utils/useGridConfiguration';
const CLASSNAME_PREFIX = 'MuiDataGridVariables';
const CSSVariablesContext = React.createContext({
    className: 'unset',
    tag: _jsx("style", { href: "/unset" }),
});
export function useCSSVariablesClass() {
    return React.useContext(CSSVariablesContext).className;
}
export function useCSSVariablesContext() {
    return React.useContext(CSSVariablesContext);
}
export function GridPortalWrapper({ children }) {
    const className = useCSSVariablesClass();
    return _jsx("div", { className: className, children: children });
}
export function GridCSSVariablesContext(props) {
    const config = useGridConfiguration();
    const rootProps = useGridRootProps();
    const description = config.hooks.useCSSVariables();
    const context = React.useMemo(() => {
        const className = `${CLASSNAME_PREFIX}-${description.id}`;
        const cssString = `.${className}{${variablesToString(description.variables)}}`;
        const tag = (_jsx("style", { href: `/${className}`, nonce: rootProps.nonce, children: cssString }));
        return { className, tag };
    }, [rootProps.nonce, description]);
    return (_jsx(CSSVariablesContext.Provider, { value: context, children: props.children }));
}
function variablesToString(variables) {
    let output = '';
    for (const key in variables) {
        if (Object.hasOwn(variables, key) && variables[key] !== undefined) {
            output += `${key}:${variables[key]};`;
        }
    }
    return output;
}
