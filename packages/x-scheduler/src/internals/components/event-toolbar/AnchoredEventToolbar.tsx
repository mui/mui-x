'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { EventToolbar } from './EventToolbar';
import { calculatePosition } from '../../utils/dialog-utils';

const AnchoredEventToolbarRoot = styled('div', {
  name: 'MuiEventDialog',
  slot: 'AnchoredToolbar',
})(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: (theme.vars || theme).zIndex.modal,
}));

interface AnchoredEventToolbarProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  occurrence: SchedulerRenderableEventOccurrence;
}

/**
 * Desktop mount for the armed-event toolbar: a portaled, fixed-positioned wrapper anchored next to
 * the event. Unlike the editing dialog it has no backdrop, so the grid stays interactive — the armed
 * event keeps its resize handles and an outside tap still disarms it. The event is positioned via
 * inline CSS variables, so a `MutationObserver` on its `style` keeps the toolbar following resizes.
 */
export function AnchoredEventToolbar(props: AnchoredEventToolbarProps) {
  const { anchorRef, occurrence } = props;
  const nodeRef = React.useRef<HTMLDivElement>(null);

  const updatePosition = React.useCallback(() => {
    const anchor = anchorRef.current;
    const node = nodeRef.current;
    // Anchor may have been detached (e.g. occurrence replaced by an exception); skip stale nodes.
    if (anchor != null && !anchor.isConnected) {
      return;
    }
    const position = calculatePosition(anchor, node, 'left');
    if (position && node) {
      node.style.top = `${position.top}px`;
      node.style.left = `${position.left}px`;
    }
  }, [anchorRef]);

  // Position synchronously on mount, before paint, to avoid a flash at the wrong spot.
  useIsoLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  React.useEffect(() => {
    const node = nodeRef.current;
    const anchor = anchorRef.current;
    const reposition = () => updatePosition();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && node ? new ResizeObserver(reposition) : null;
    if (node) {
      resizeObserver?.observe(node);
    }

    const mutationObserver =
      typeof MutationObserver !== 'undefined' && anchor ? new MutationObserver(reposition) : null;
    if (anchor) {
      mutationObserver?.observe(anchor, { attributes: true, attributeFilter: ['style'] });
    }

    window.addEventListener('resize', reposition);

    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener('resize', reposition);
    };
  }, [anchorRef, updatePosition]);

  if (typeof document === 'undefined') {
    return null;
  }

  return ReactDOM.createPortal(
    <AnchoredEventToolbarRoot ref={nodeRef}>
      <EventToolbar occurrence={occurrence} />
    </AnchoredEventToolbarRoot>,
    document.body,
  );
}
