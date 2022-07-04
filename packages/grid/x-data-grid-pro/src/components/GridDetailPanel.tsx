import * as React from 'react';
import Box from '@mui/material/Box';
import { styled, SxProps, Theme } from '@mui/material/styles';
import { GridRowId } from '@mui/x-data-grid';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';

const DetailPanel = styled(Box, {
  name: 'MuiDataGrid',
  slot: 'DetailPanel',
  overridesResolver: (props, styles) => styles.detailPanel,
})(({ theme }) => ({
  zIndex: 2,
  width: '100%',
  position: 'absolute',
  backgroundColor: theme.palette.background.default,
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

const GridDetailPanel = (props: GridDetailPanelProps) => {
  const { rowId, height, style: styleProp = {}, ...other } = props;
  const apiRef = useGridApiContext();
  const ref = React.useRef<HTMLDivElement>();

  React.useLayoutEffect(() => {
    if (height === 'auto' && ref.current && typeof ResizeObserver === 'undefined') {
      // Fallback for IE
      apiRef.current.unstable_storeDetailPanelHeight(rowId, ref.current.clientHeight);
    }
  }, [apiRef, height, rowId]);

  React.useLayoutEffect(() => {
    const hasFixedHeight = height !== 'auto';
    if (!ref.current || hasFixedHeight || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const [entry] = entries;
      const observedHeight =
        entry.borderBoxSize && entry.borderBoxSize.length > 0
          ? entry.borderBoxSize[0].blockSize
          : entry.contentRect.height;

      apiRef.current.unstable_storeDetailPanelHeight(rowId, observedHeight);
    });

    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, [apiRef, height, rowId]);

  const style = { ...styleProp, height };

  return <DetailPanel ref={ref} style={style} {...other} />;
};

export { GridDetailPanel };
