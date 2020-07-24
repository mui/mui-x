import * as React from 'react';
import { GridOptions } from '../models';
import { Footer } from './styled-wrappers';
import { RowCount } from './row-count';
import { SelectedRowCount } from './selected-row-count';
import { ApiContext } from './api-context';

export interface DefaultFooterProps {
  options: GridOptions;
  paginationComponent: React.ReactNode;
  rowCount: number;
}

export const DefaultFooter = React.forwardRef<HTMLDivElement, DefaultFooterProps>(
  function DefaultFooter({ options, rowCount, paginationComponent }, ref) {
    const api = React.useContext(ApiContext);
    const [selectedRowCount, setSelectedCount] = React.useState(0);

    React.useEffect(() => {
      if (api && api.current) {
        return api.current!.onSelectionChange(({ rows }) => setSelectedCount(rows.length));
      }

      return undefined;
    }, [api, setSelectedCount]);

    if (options.hideFooter) {
      return null;
    }

    return (
      <Footer ref={ref}>
        {!options.hideFooterRowCount && <RowCount rowCount={rowCount} />}
        {!options.hideFooterSelectedRowCount && (
          <SelectedRowCount selectedRowCount={selectedRowCount} />
        )}
        {paginationComponent}
      </Footer>
    );
  },
);
