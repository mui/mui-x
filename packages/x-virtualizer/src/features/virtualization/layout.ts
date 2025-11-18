import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import * as platform from '@mui/x-internals/platform';
import { Store, useStore, createSelector } from '@mui/x-internals/store';
import { Dimensions } from '../../features/dimensions';
import type { BaseState, ParamsWithDefaults } from '../../useVirtualizer';
import type { VirtualizationLayoutParams } from './index';

type RequiredAPI = Dimensions.API;

type BaseElements = {
  scroller: React.RefObject<HTMLElement | null>;
  container: React.RefObject<HTMLElement | null>;
};
type AnyElements = BaseElements & Record<string, React.RefObject<HTMLElement | null>>;

export abstract class Layout<E extends AnyElements = AnyElements> {
  refs: E;

  constructor(refs: E) {
    this.refs = refs;
  }

  abstract use(
    store: Store<BaseState>,
    params: ParamsWithDefaults,
    api: RequiredAPI,
    layoutParams: VirtualizationLayoutParams,
  ): any;

  refSetter(name: keyof E) {
    return (node: HTMLDivElement | null) => {
      if (node && this.refs[name].current !== node) {
        this.refs[name].current = node;
      }
    };
  }
}

const selectors = (() => {
  const firstRowIndexSelector = createSelector(
    (state: BaseState) => state.virtualization.renderContext.firstRowIndex,
  );
  return {
    offsetTop: createSelector(
      Dimensions.selectors.rowPositions,
      firstRowIndexSelector,
      (rowPositions, firstRowIndex) => rowPositions[firstRowIndex] ?? 0,
    ),
  };
})();

type DataGridElements = BaseElements & {
  scrollbarVertical: React.RefObject<HTMLElement | null>;
  scrollbarHorizontal: React.RefObject<HTMLElement | null>;
};

export class LayoutDataGrid extends Layout<DataGridElements> {
  use(
    store: Store<BaseState>,
    params: ParamsWithDefaults,
    _api: RequiredAPI,
    layoutParams: VirtualizationLayoutParams,
  ) {
    const {
      minimalContentHeight,
      autoHeight,
      dimensions: { columnsTotalWidth = 0 },
    } = params;

    const { scrollerRef, containerRef, scrollPosition } = layoutParams;

    const offsetTop = useStore(store, selectors.offsetTop);
    const contentHeight = useStore(store, Dimensions.selectors.contentHeight);
    const needsHorizontalScrollbar = useStore(store, Dimensions.selectors.needsHorizontalScrollbar);

    const scrollerStyle = React.useMemo(
      () =>
        ({
          overflowX: !needsHorizontalScrollbar ? 'hidden' : undefined,
          overflowY: autoHeight ? 'hidden' : undefined,
        }) as React.CSSProperties,
      [needsHorizontalScrollbar, autoHeight, params.layout],
    );

    const contentStyle = React.useMemo(() => {
      const style: React.CSSProperties = {
        width: needsHorizontalScrollbar ? columnsTotalWidth : 'auto',
        flexBasis: contentHeight,
        flexShrink: 0,
      };

      if (style.flexBasis === 0) {
        style.flexBasis = minimalContentHeight; // Give room to show the overlay when there no rows.
      }

      return style;
    }, [
      columnsTotalWidth,
      contentHeight,
      needsHorizontalScrollbar,
      minimalContentHeight,
      params.layout,
    ]);

    const positionerStyle = React.useMemo(() => {
      return {
        transform: `translate3d(0, ${offsetTop}px, 0)`,
      };
    }, [offsetTop, params.layout]);

    const scrollbarVerticalRef = useEventCallback(this.refSetter('scrollbarVertical'));
    const scrollbarHorizontalRef = useEventCallback(this.refSetter('scrollbarHorizontal'));

    return {
      getContainerProps: () => ({
        ref: containerRef,
      }),
      getScrollerProps: () => ({
        ref: scrollerRef,
        style: scrollerStyle,
        role: 'presentation',
        // `tabIndex` shouldn't be used along role=presentation, but it fixes a Firefox bug
        // https://github.com/mui/mui-x/pull/13891#discussion_r1683416024
        tabIndex: platform.isFirefox ? -1 : undefined,
      }),
      getContentProps: () => ({
        style: contentStyle,
        role: 'presentation',
      }),
      getPositionerProps: () => ({
        style: positionerStyle,
      }),
      getScrollbarVerticalProps: () => ({
        ref: scrollbarVerticalRef,
        scrollPosition,
      }),
      getScrollbarHorizontalProps: () => ({
        ref: scrollbarHorizontalRef,
        scrollPosition,
      }),
      getScrollAreaProps: () => ({
        scrollPosition,
      }),
    };
  }
}

// export class LayoutList extends Layout<DataGridElements> {
//   use(store: Store<BaseState>, params: ParamsWithDefaults, api: RequiredAPI): void {
//     const { refs } = this;
//
//     const { minimalContentHeight, autoHeight } = params;
//
//     const offsetTop = useStore(store, selectors.offsetTop);
//     const needsHorizontalScrollbar = useStore(store, Dimensions.selectors.needsHorizontalScrollbar);
//
//     const scrollerStyle = React.useMemo(
//       () =>
//         ({
//           overflowX: !needsHorizontalScrollbar ? 'hidden' : undefined,
//           overflowY: autoHeight ? 'hidden' : undefined,
//           position: layout.constructor.name !== 'LayoutDataGrid' ? 'relative' : undefined,
//         }) as React.CSSProperties,
//       [needsHorizontalScrollbar, autoHeight, params.layout],
//     );
//
//     const contentStyle = React.useMemo(() => {
//       switch (layout.constructor.name) {
//         case 'LayoutDataGrid': {
//           const style: React.CSSProperties = {
//             width: needsHorizontalScrollbar ? columnsTotalWidth : 'auto',
//             flexBasis: contentHeight,
//             flexShrink: 0,
//           };
//
//           if (style.flexBasis === 0) {
//             style.flexBasis = minimalContentHeight; // Give room to show the overlay when there no rows.
//           }
//
//           return style;
//         }
//         case 'LayoutList': {
//           const style: React.CSSProperties = {
//             position: 'absolute',
//             display: 'inline-block',
//             width: '100%',
//             height: contentHeight,
//             top: 0,
//             left: 0,
//             zIndex: -1,
//           };
//           return style;
//         }
//         default:
//           throw new Error(`MUI: Unsupported layout: ${params.layout}`);
//       }
//     }, [
//       columnsTotalWidth,
//       contentHeight,
//       needsHorizontalScrollbar,
//       minimalContentHeight,
//       params.layout,
//     ]);
//
//     const positionerStyle = React.useMemo(() => {
//       switch (layout.constructor.name) {
//         case 'LayoutDataGrid': {
//           const style: React.CSSProperties = {
//             transform: `translate3d(0, ${offsetTop}px, 0)`,
//           };
//           return style;
//         }
//         case 'LayoutList': {
//           const style: React.CSSProperties = {
//             height: offsetTop,
//           };
//           return style;
//         }
//         default:
//           throw new Error(`MUI: Unsupported layout: ${params.layout}`);
//       }
//     }, [offsetTop, params.layout]);
//
//     return {
//       getContainerProps: () => ({
//         ref: containerRef,
//       }),
//       getScrollerProps: () => ({
//         ref: scrollerRef,
//         style: scrollerStyle,
//         role: 'presentation',
//         // `tabIndex` shouldn't be used along role=presentation, but it fixes a Firefox bug
//         // https://github.com/mui/mui-x/pull/13891#discussion_r1683416024
//         tabIndex: platform.isFirefox ? -1 : undefined,
//       }),
//       getContentProps: () => ({
//         style: contentStyle,
//         role: 'presentation',
//       }),
//       getPositionerProps: () => ({
//         style: positionerStyle,
//       }),
//       getScrollbarVerticalProps: () => ({
//         ref: scrollbarVerticalRef,
//         scrollPosition,
//       }),
//       getScrollbarHorizontalProps: () => ({
//         ref: scrollbarHorizontalRef,
//         scrollPosition,
//       }),
//       getScrollAreaProps: () => ({
//         scrollPosition,
//       }),
//     };
//
//     return {
//       getters,
//     };
//   }
// }
