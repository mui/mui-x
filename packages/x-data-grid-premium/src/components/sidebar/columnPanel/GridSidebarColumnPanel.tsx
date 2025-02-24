import * as React from 'react';
import { GridSidebarColumnPanelHeader as Header } from './GridSidebarColumnPanelHeader';
import { GridSidebarColumnPanelBody as Body } from './GridSidebarColumnPanelBody';

export function GridSidebarColumnPanel() {
  const [searchState, setSearchState] = React.useState<{
    value: string;
    enabled: boolean;
  }>({
    value: '',
    enabled: false,
  });

  return (
    <React.Fragment>
      <Header searchState={searchState} onSearchStateChange={setSearchState} />
      <Body searchState={searchState} />
    </React.Fragment>
  );
}
