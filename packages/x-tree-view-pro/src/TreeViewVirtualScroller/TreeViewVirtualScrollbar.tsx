import * as React from 'react';
import { styled } from '@mui/system';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import useOnMount from '@mui/utils/useOnMount';
import { useTreeViewContext } from '@mui/x-tree-view/internals';
import { UseTreeViewVirtualizationSignature } from '../internals/plugins/useTreeViewVirtualization';

const TreeViewVirtualScrollbarContainer = styled('div')({
  position: 'absolute',
  display: 'inline-block',
  zIndex: 6,
  // In macOS Safari and Gnome Web, scrollbars are overlaid and don't affect the layout. So we consider
  // their size to be 0px throughout all the calculations, but the floating scrollbar container does need
  // to appear and have a real size. We set it to 14px because it seems like an acceptable value and we
  // don't have a method to find the required size for scrollbars on those platforms.
  '--size': 'calc(max(var(--TreeView-scrollbarSize), 14px))',
  width: 'var(--size)',
  height: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  // Disable focus-visible style, it's a scrollbar.
  outline: 0,
  '& > div': {
    width: 'var(--size)',
    display: 'inline-block',
  },
  top: '0px',
  right: '0px',
});

const TreeViewVirtualScrollbarContent = styled('div')({
  display: 'inline-block',
});

/**
 * @ignore - do not document.
 */
export const TreeViewVirtualScrollbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function GridVirtualScrollbar(props, ref) {
  const {
    instance,
    virtualization: { virtualScrollerRef },
  } = useTreeViewContext<[UseTreeViewVirtualizationSignature]>();
  const isLocked = React.useRef(false);
  const lastPosition = React.useRef(0);
  const scrollbarRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const dimensions = instance.getDimensions();
  const scrollbarHeight = dimensions.viewportHeight;
  const scrollbarInnerSize = scrollbarHeight * (dimensions.contentSize / dimensions.viewportHeight);

  const onScrollerScroll = useEventCallback(() => {
    const scroller = virtualScrollerRef.current!;
    const scrollbar = scrollbarRef.current!;

    if (scroller.scrollTop === lastPosition.current) {
      return;
    }

    if (isLocked.current) {
      isLocked.current = false;
      return;
    }
    isLocked.current = true;

    const value = scroller.scrollTop / dimensions.contentSize;
    scrollbar.scrollTop = value * scrollbarInnerSize;

    lastPosition.current = scroller.scrollTop;
  });

  const onScrollbarScroll = useEventCallback(() => {
    const scroller = virtualScrollerRef.current!;
    const scrollbar = scrollbarRef.current!;

    if (isLocked.current) {
      isLocked.current = false;
      return;
    }
    isLocked.current = true;

    const value = scrollbar.scrollTop / scrollbarInnerSize;
    scroller.scrollTop = value * dimensions.contentSize;
  });

  useOnMount(() => {
    const scroller = virtualScrollerRef.current!;
    const scrollbar = scrollbarRef.current!;
    scroller.addEventListener('scroll', onScrollerScroll, { capture: true });
    scrollbar.addEventListener('scroll', onScrollbarScroll, { capture: true });
    return () => {
      scroller.removeEventListener('scroll', onScrollerScroll, { capture: true });
      scrollbar.removeEventListener('scroll', onScrollbarScroll, { capture: true });
    };
  });

  React.useEffect(() => {
    const content = contentRef.current!;
    content.style.setProperty('height', `${scrollbarInnerSize}px`);
  }, [scrollbarInnerSize]);

  return (
    <TreeViewVirtualScrollbarContainer ref={useForkRef(ref, scrollbarRef)} tabIndex={-1}>
      <TreeViewVirtualScrollbarContent ref={contentRef} />
    </TreeViewVirtualScrollbarContainer>
  );
});
