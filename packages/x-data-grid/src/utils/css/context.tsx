import * as React from 'react';
import { useGridConfiguration } from '../../hooks/utils/useGridConfiguration';

const CLASSNAME_PREFIX = 'MuiDataGridVariables';

const CSSVariablesContext = React.createContext({
  className: 'unset',
  tag: <style href="/unset" />,
});

export function useCSSVariablesClass() {
  return React.useContext(CSSVariablesContext).className;
}

export function useCSSVariablesContext() {
  return React.useContext(CSSVariablesContext);
}

export function GridPortalWrapper({ children }: { children: React.ReactNode }) {
  const className = useCSSVariablesClass();
  return <div className={className}>{children}</div>;
}

export function GridCSSVariablesContext(props: { children: any }) {
  const config = useGridConfiguration();
  const description = config.hooks.useCSSVariables();

  const context = React.useMemo(() => {
    const className = `${CLASSNAME_PREFIX}-${description.id}`;
    const cssString = `.${className}{${variablesToString(description.variables)}}`;
    const tag = <style href={`/${className}`}>{cssString}</style>;
    return { className, tag };
  }, [description]);

  return (
    <CSSVariablesContext.Provider value={context}>{props.children}</CSSVariablesContext.Provider>
  );
}

function variablesToString(variables: Record<string, any>) {
  let output = '';
  for (const key in variables) {
    if (Object.hasOwn(variables, key)) {
      output += `${key}:${variables[key]};`;
    }
  }
  return output;
}
