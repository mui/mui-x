import * as React from 'react';
import { MarkdownElement } from '@mui/internal-core-docs/MarkdownElement';
import AppLayoutDocs from 'docs/src/modules/components/AppLayoutDocs';

const AllowedPropsContext = React.createContext<ReadonlySet<string> | null>(null);

export function useAllowedProps(): ReadonlySet<string> | null {
  return React.useContext(AllowedPropsContext);
}

interface TypesPageShellProps {
  name: string;
  allowedProps?: readonly string[];
  children: React.ReactNode;
}

export function TypesPageShell(props: TypesPageShellProps) {
  const { name, allowedProps, children } = props;
  const allowed = React.useMemo(
    () => (allowedProps ? new Set(allowedProps) : null),
    [allowedProps],
  );
  return (
    <AppLayoutDocs
      description={`API reference for the ${name} component.`}
      disableAd
      disableToc
      toc={[]}
      location=""
      title={`${name} API`}
    >
      <MarkdownElement>
        <h1>{name}</h1>
        <AllowedPropsContext.Provider value={allowed}>{children}</AllowedPropsContext.Provider>
      </MarkdownElement>
    </AppLayoutDocs>
  );
}
