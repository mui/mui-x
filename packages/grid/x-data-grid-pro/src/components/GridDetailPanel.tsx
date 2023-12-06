import * as React from 'react';
import Box from '@mui/material/Box';
import { styled, SxProps, Theme } from '@mui/material/styles';
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
  zIndex: 2,
  width: '100%',
  position: 'absolute',
  backgroundColor: (theme.vars || theme).palette.background.default,
  overflow: 'auto',
}));

interface GridDetailPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * The panel height.
   */
  height: number | 'auto';
  /**
   * The row ID that this panel belongs to.
   */
  rowId: GridRowId;
}

function GridDetailPanel(props: GridDetailPanelProps) {
  const { rowId, height, style: styleProp = {}, ...other } = props;
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

  const style = { ...styleProp, height };

  return <DetailPanel ref={ref} ownerState={ownerState} style={style} {...other} />;
}

export { GridDetailPanel };
