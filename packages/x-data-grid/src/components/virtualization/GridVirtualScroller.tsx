import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import {
  gridHasBottomFillerSelector,
  gridHasScrollXSelector,
  gridHasScrollYSelector,
} from '../../hooks/features/dimensions/gridDimensionsSelectors';
import { gridRowTreeSelector } from '../../hooks/features/rows';
import { GridScrollArea } from '../GridScrollArea';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridOverlays } from '../../hooks/features/overlays/useGridOverlays';
import { GridHeaders } from '../GridHeaders';
import { GridMainContainer as Container } from './GridMainContainer';
import { GridTopContainer as TopContainer } from './GridTopContainer';
import { GridVirtualScrollerContent as Content } from './GridVirtualScrollerContent';
import { GridVirtualScrollerFiller as SpaceFiller } from './GridVirtualScrollerFiller';
import { GridVirtualScrollerRenderZone as RenderZone } from './GridVirtualScrollerRenderZone';
import { GridVirtualScrollbar as Scrollbar, ScrollbarCorner } from './GridVirtualScrollbar';
import { GridScrollShadows as ScrollShadows } from '../GridScrollShadows';
import { GridOverlayWrapper } from '../base/GridOverlays';
import type {
  GridOverlayType,
  GridLoadingOverlayVariant,
} from '../../hooks/features/overlays/gridOverlaysInterfaces';
import type { GridApiCommunity } from '../../models/api/gridApiCommunity';
import { useGridVirtualizer } from '../../hooks/core/useGridVirtualizer';

type OwnerState = Pick<DataGridProcessedProps, 'classes'> & {
  hasScrollX: boolean;
  hasPinnedRight: boolean;
  loadingOverlayVariant: GridLoadingOverlayVariant | null;
  overlayType: GridOverlayType;
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes, hasScrollX, hasPinnedRight, loadingOverlayVariant, overlayType } = ownerState;
  const hideContent = loadingOverlayVariant === 'skeleton' || overlayType === 'noColumnsOverlay';
  const slots = {
    root: ['main', hasPinnedRight && 'main--hasPinnedRight', hideContent && 'main--hiddenContent'],
    scroller: ['virtualScroller', hasScrollX && 'virtualScroller--hasScrollX'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const Scroller = styled('div', {
  name: 'MuiDataGrid',
  slot: 'VirtualScroller',
  overridesResolver: (props, styles) => {
    const { ownerState } = props;
    return [styles.virtualScroller, ownerState.hasScrollX && styles['virtualScroller--hasScrollX']];
  },
})<{ ownerState: OwnerState }>({
  position: 'relative',
  height: '100%',
  flexGrow: 1,
  overflow: 'scroll',
  scrollbarWidth: 'none' /* Firefox */,
  display: 'flex',
  flexDirection: 'column',
  '&::-webkit-scrollbar': {
    display: 'none' /* Safari and Chrome */,
  },

  '@media print': {
    overflow: 'hidden',
  },

  // See https://github.com/mui/mui-x/issues/10547
  zIndex: 0,
});

const hasPinnedRightSelector = (apiRef: RefObject<GridApiCommunity>) =>
  apiRef.current.state.dimensions.rightPinnedWidth > 0;

export interface GridVirtualScrollerProps {
  children?: React.ReactNode;
}

function GridVirtualScroller(props: GridVirtualScrollerProps) {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const hasScrollY = useGridSelector(apiRef, gridHasScrollYSelector);
  const hasScrollX = useGridSelector(apiRef, gridHasScrollXSelector);
  const hasPinnedRight = useGridSelector(apiRef, hasPinnedRightSelector);
  const hasBottomFiller = useGridSelector(apiRef, gridHasBottomFillerSelector);
  const { overlayType, loadingOverlayVariant } = useGridOverlays(apiRef, rootProps);
  const Overlay = rootProps.slots?.[overlayType];
  const ownerState = {
    classes: rootProps.classes,
    hasScrollX,
    hasPinnedRight,
    overlayType,
    loadingOverlayVariant,
  };
  const classes = useUtilityClasses(ownerState);

  const virtualScroller = useGridVirtualizer().api.getters;

  const {
    getContainerProps,
    getScrollerProps,
    getContentProps,
    getPositionerProps,
    getScrollbarVerticalProps,
    getScrollbarHorizontalProps,
    getRows,
    getScrollAreaProps,
  } = virtualScroller;

  const rows = getRows(undefined, gridRowTreeSelector(apiRef));

  return (
    <Container className={classes.root} {...getContainerProps()} ownerState={ownerState}>
      <GridScrollArea scrollDirection="left" {...getScrollAreaProps()} />
      <GridScrollArea scrollDirection="right" {...getScrollAreaProps()} />
      <GridScrollArea scrollDirection="up" {...getScrollAreaProps()} />
      <GridScrollArea scrollDirection="down" {...getScrollAreaProps()} />
      <Scroller className={classes.scroller} {...getScrollerProps()} ownerState={ownerState}>
        <TopContainer>
          {!rootProps.listView && <GridHeaders />}
          <rootProps.slots.pinnedRows position="top" virtualScroller={virtualScroller} />
        </TopContainer>

        {overlayType && (
          <GridOverlayWrapper
            overlayType={overlayType}
            loadingOverlayVariant={loadingOverlayVariant}
          >
            <Overlay {...rootProps.slotProps?.[overlayType]} />
          </GridOverlayWrapper>
        )}

        <Content {...getContentProps()}>
          <RenderZone role="rowgroup" {...getPositionerProps()}>
            {rows}
            {<rootProps.slots.detailPanels virtualScroller={virtualScroller} />}
          </RenderZone>
        </Content>

        {hasBottomFiller && <SpaceFiller rowsLength={rows.length} />}
        <rootProps.slots.bottomContainer>
          <rootProps.slots.pinnedRows position="bottom" virtualScroller={virtualScroller} />
        </rootProps.slots.bottomContainer>
      </Scroller>
      {hasScrollX && (
        <React.Fragment>
          {rootProps.pinnedColumnsSectionSeparator?.endsWith('shadow') && (
            <ScrollShadows position="horizontal" />
          )}
          <Scrollbar position="horizontal" {...getScrollbarHorizontalProps()} />
        </React.Fragment>
      )}
      {hasScrollY && (
        <React.Fragment>
          {rootProps.pinnedRowsSectionSeparator?.endsWith('shadow') && (
            <ScrollShadows position="vertical" />
          )}
          <Scrollbar position="vertical" {...getScrollbarVerticalProps()} />
        </React.Fragment>
      )}
      {hasScrollX && hasScrollY && <ScrollbarCorner aria-hidden="true" />}
      {props.children}
    </Container>
  );
}

export { GridVirtualScroller };
