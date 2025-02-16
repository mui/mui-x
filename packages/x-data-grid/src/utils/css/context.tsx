import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { hash } from '@mui/x-internals/hash';
import { transformMaterialUITheme } from './transformVariables';

const CLASSNAME_PREFIX = 'MuiDataGridVariables';

const CSSVariablesContext = React.createContext({
  className: 'unset',
  tag: <style href="/unset"></style>,
});

export function useCSSVariablesClass() {
  return React.useContext(CSSVariablesContext).className;
}

export function useCSSVariables() {
  return React.useContext(CSSVariablesContext);
}

export function GridPortalWrapper({ children }: { children: React.ReactNode }) {
  const className = useCSSVariablesClass();
  return <div className={className}>{children}</div>;
}

export function GridCSSVariablesContext(props: { children: any }) {
  const theme = useTheme();

  const context = React.useMemo(() => {
    const variables = transformMaterialUITheme(theme);
    const className = `${CLASSNAME_PREFIX}-${hash(JSON.stringify(theme))}`;
    const cssString = `.${className}{${variablesToString(variables)}}`;
    const tag = <style href={`/${className}`}>{cssString}</style>;
    return { className, tag };
  }, [theme]);

  return (
    <CSSVariablesContext.Provider value={context}>{props.children}</CSSVariablesContext.Provider>
  );
}

function variablesToString(variables: Record<string, any>) {
  let output = '';
  for (let key in variables) {
    output += `${key}:${variables[key]};`;
  }
  return output;
}
