import * as React from 'react';
import { styled } from '@mui/system';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridVirtualScroller } from '../../hooks/features/virtualization/useGridVirtualScroller';
import { GridOverlays } from '../base/GridOverlays';
import { GridHeaders } from '../GridHeaders';
import { GridVirtualScrollerContainer as Container } from './GridVirtualScrollerContainer';
import { GridVirtualScrollerContent as Content } from './GridVirtualScrollerContent';
import { GridVirtualScrollerRenderZone as RenderZone } from './GridVirtualScrollerRenderZone';
import { GridVirtualScrollbar as Scrollbar } from './GridVirtualScrollbar';
import { GridTopContainer } from './GridTopContainer';
import { GridBottomContainer } from './GridBottomContainer';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    scroller: ['virtualScroller'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const Scroller = styled('div', {
  name: 'MuiDataGrid',
  slot: 'VirtualScroller',
  overridesResolver: (props, styles) => styles.virtualScroller,
})({
  height: '100%',

  overflow: 'scroll',
  scrollbarWidth: 'none' /* Firefox */,
  '&::-webkit-scrollbar': {
    display: 'none' /* Safari and Chrome */,
  },

  // See https://github.com/mui/mui-x/issues/4360
  position: 'relative',

  '@media print': {
    overflow: 'hidden',
  },
  zIndex: 0, // See https://github.com/mui/mui-x/issues/10547
});

export interface GridVirtualScrollerProps {
  children?: React.ReactNode;
}

function GridVirtualScroller(props: GridVirtualScrollerProps) {
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  const virtualScroller = useGridVirtualScroller();
  const {
    getContainerProps,
    getScrollerProps,
    getContentProps,
    getRenderZoneProps,
    getScrollbarVerticalProps,
    getScrollbarHorizontalProps,
  } = virtualScroller;

  return (
    <Container {...getContainerProps()}>
      <Scroller className={classes.scroller} {...getScrollerProps()}>
        <GridTopContainer>
          <GridHeaders />
          <GridOverlays />
          <rootProps.slots.pinnedRows virtualScroller={virtualScroller} position="top" />
        </GridTopContainer>

        <Content {...getContentProps()}>
          <RenderZone {...getRenderZoneProps()}>
            {virtualScroller.getRows()}
            {<rootProps.slots.detailPanels virtualScroller={virtualScroller} />}
          </RenderZone>
        </Content>

        <GridBottomContainer>
          <rootProps.slots.pinnedRows virtualScroller={virtualScroller} position="bottom" />
        </GridBottomContainer>
      </Scroller>
      <Scrollbar position="vertical" {...getScrollbarVerticalProps()} />
      <Scrollbar position="horizontal" {...getScrollbarHorizontalProps()} />
      {props.children}
    </Container>
  );
}

export { GridVirtualScroller };
