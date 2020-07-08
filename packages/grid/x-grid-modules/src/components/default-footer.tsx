import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
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
    const api = useContext(ApiContext);
    const [selectedRowCount, setSelectedCount] = useState(0);

    // eslint-disable-next-line consistent-return
    useEffect(() => {
      if (api && api.current) {
        return api.current!.onSelectionChanged(({ rows }) => setSelectedCount(rows.length));
      }
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
