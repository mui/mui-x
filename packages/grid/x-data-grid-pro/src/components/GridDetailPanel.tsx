import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { GridRowId } from '@mui/x-data-grid';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { DataGridProProcessedProps } from '../models/dataGridProProps';

type OwnerState = DataGridProProcessedProps;

const DetailPanel = styled(Box, {
  name: 'MuiDataGrid',
  slot: 'DetailPanel',
  overridesResolver: (props, styles) => styles.detailPanel,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  width: 'calc(var(--DataGrid-rowWidth))',
  backgroundColor: (theme.vars || theme).palette.background.default,
  overflow: 'auto',
}));

interface GridDetailPanelProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, 'className' | 'children'> {
  /**
   * The row ID that this panel belongs to.
   */
  rowId: GridRowId;
  /**
   * The panel height.
   */
  height: number | 'auto';
}

function GridDetailPanel(props: GridDetailPanelProps) {
  const { rowId, height, className, children } = props;
  const apiRef = useGridPrivateApiContext();
  const ref = React.useRef<HTMLDivElement>();
  const rootProps = useGridRootProps();
  const ownerState = rootProps;

  React.useLayoutEffect(() => {
    if (height === 'auto' && typeof ResizeObserver === 'undefined') {
      // Fallback for IE
      apiRef.current.storeDetailPanelHeight(rowId, ref.current!.clientHeight);
    }
  }, [apiRef, height, rowId]);

  React.useLayoutEffect(() => {
    const hasFixedHeight = height !== 'auto';
    if (hasFixedHeight || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const [entry] = entries;
      const observedHeight =
        entry.borderBoxSize && entry.borderBoxSize.length > 0
          ? entry.borderBoxSize[0].blockSize
          : entry.contentRect.height;

      apiRef.current.storeDetailPanelHeight(rowId, observedHeight);
    });

    resizeObserver.observe(ref.current!);

    return () => resizeObserver.disconnect();
  }, [apiRef, height, rowId]);

  return (
    <DetailPanel
      ref={ref}
      ownerState={ownerState}
      role="presentation"
      style={{ height }}
      className={className}
    >
      {children}
    </DetailPanel>
  );
}

export { GridDetailPanel };
