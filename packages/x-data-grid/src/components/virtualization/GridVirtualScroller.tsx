import * as React from 'react';
import { styled } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import { GridScrollArea } from '../GridScrollArea';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridDimensions, gridDimensionsSelector } from '../../hooks/features/dimensions';
import { useGridVirtualScroller } from '../../hooks/features/virtualization/useGridVirtualScroller';
import { useGridOverlays } from '../../hooks/features/overlays/useGridOverlays';
import { GridOverlays as Overlays } from '../base/GridOverlays';
import { GridHeaders } from '../GridHeaders';
import { GridMainContainer as Container } from './GridMainContainer';
import { GridTopContainer as TopContainer } from './GridTopContainer';
import { GridBottomContainer as BottomContainer } from './GridBottomContainer';
import { GridVirtualScrollerContent as Content } from './GridVirtualScrollerContent';
import { GridVirtualScrollerFiller as SpaceFiller } from './GridVirtualScrollerFiller';
import { GridVirtualScrollerRenderZone as RenderZone } from './GridVirtualScrollerRenderZone';
import { GridVirtualScrollbar as Scrollbar } from './GridVirtualScrollbar';
import { GridLoadingOverlayVariant } from '../GridLoadingOverlay';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (
  ownerState: OwnerState,
  dimensions: GridDimensions,
  loadingOverlayVariant: GridLoadingOverlayVariant | null,
) => {
  const { classes } = ownerState;

  const slots = {
    root: [
      'main',
      dimensions.rightPinnedWidth > 0 && 'main--hasPinnedRight',
      loadingOverlayVariant === 'skeleton' && 'main--hasSkeletonLoadingOverlay',
    ],
    scroller: ['virtualScroller'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const Scroller = styled('div', {
  name: 'MuiDataGrid',
  slot: 'VirtualScroller',
  overridesResolver: (props, styles) => styles.virtualScroller,
})<{ ownerState: OwnerState }>({
  position: 'relative',
  height: '100%',
  overflow: 'scroll',
  scrollbarWidth: 'none' /* Firefox */,
  '&::-webkit-scrollbar': {
    display: 'none' /* Safari and Chrome */,
  },

  '@media print': {
    overflow: 'hidden',
  },

  // See https://github.com/mui/mui-x/issues/10547
  zIndex: 0,
});

export interface GridVirtualScrollerProps {
  children?: React.ReactNode;
}

function GridVirtualScroller(props: GridVirtualScrollerProps) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);
  const overlaysProps = useGridOverlays();
  const classes = useUtilityClasses(rootProps, dimensions, overlaysProps.loadingOverlayVariant);

  const virtualScroller = useGridVirtualScroller();
  const {
    getContainerProps,
    getScrollerProps,
    getContentProps,
    getRenderZoneProps,
    getScrollbarVerticalProps,
    getScrollbarHorizontalProps,
    getRows,
  } = virtualScroller;

  const rows = getRows();

  return (
    <Container className={classes.root} {...getContainerProps()}>
      <GridScrollArea scrollDirection="left" />
      <GridScrollArea scrollDirection="right" />
      <Scroller className={classes.scroller} {...getScrollerProps()} ownerState={rootProps}>
        <TopContainer>
          <GridHeaders />
          <rootProps.slots.pinnedRows position="top" virtualScroller={virtualScroller} />
        </TopContainer>

        <Overlays {...overlaysProps} />

        <Content {...getContentProps()}>
          <RenderZone {...getRenderZoneProps()}>
            {rows}
            {<rootProps.slots.detailPanels virtualScroller={virtualScroller} />}
          </RenderZone>
        </Content>

        <SpaceFiller rowsLength={rows.length} />

        <BottomContainer>
          <rootProps.slots.pinnedRows position="bottom" virtualScroller={virtualScroller} />
        </BottomContainer>
      </Scroller>
      {dimensions.hasScrollY && <Scrollbar position="vertical" {...getScrollbarVerticalProps()} />}
      {dimensions.hasScrollX && (
        <Scrollbar position="horizontal" {...getScrollbarHorizontalProps()} />
      )}
      {props.children}
    </Container>
  );
}

export { GridVirtualScroller };
