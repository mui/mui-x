'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useChartId } from '../../../hooks/useChartId';
import { useChartsContext } from '../../../context/ChartsProvider';
import { useDescription } from './useDescription';
import { useZoomDescription } from './useZoomDescription';

/**
 * Make the proxy looks like a layer.
 * Having a non-zero size is important for some screen readers to announce the content.
 */
const fullSizeLayerStyle: React.CSSProperties = {
  borderWidth: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  position: 'absolute',
  inset: 0,
  padding: 0,
  outline: 'none',
  pointerEvents: 'none',
};

/**
 * Keeps the live region out of sight without removing it from the accessibility tree.
 */
const liveRegionStyle: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
};

// The proxy is implemented by having two divs with the same content, and toggling the visibility of each one when the content changes.
// The idea is to imitate the behavior of the focus moving from a list element to another, but with the minimal number of DOM elements.

/**
 * This component provides an accessibility proxy for charts.
 * It uses two divs to let screen readers announce the focused content when it changes.
 */
export function ChartsAccessibilityProxy() {
  const message = useDescription();
  const zoomMessage = useZoomDescription();
  const chartId = useChartId();

  const { instance } = useChartsContext();

  const currentFormatRef = React.useRef<string | null>(null);
  const currentIndexRef = React.useRef<number>(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(containerRef, instance.chartsAccessibilityProxyRef);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    // Initialize children if not present
    if (container.children.length === 0) {
      for (let i = 0; i < 2; i += 1) {
        const div = document.createElement('div');
        div.setAttribute('id', i === 0 ? `voiceover-${chartId}-1` : `voiceover-${chartId}-2`);
        div.style.display = 'none';
        container.appendChild(div);
      }

      // The divs with the message content
      for (let i = 0; i < 2; i += 1) {
        const div = document.createElement('div');
        if (i === (currentIndexRef.current + 1) % 2 && message) {
          div.setAttribute('tabindex', '0');
        }
        div.setAttribute('role', 'img');
        div.setAttribute('aria-hidden', 'true');
        div.setAttribute(
          'aria-labelledby',
          i === 0 ? `voiceover-${chartId}-1` : `voiceover-${chartId}-2`,
        );
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.outline = 'none';
        container.appendChild(div);
      }
    }

    if (message && message !== currentFormatRef.current) {
      currentFormatRef.current = message;

      const inactiveIndex = currentIndexRef.current;

      currentIndexRef.current = (currentIndexRef.current + 1) % 2;

      const activeIndex = currentIndexRef.current;

      const activeDiv = container.children[2 + activeIndex] as HTMLDivElement;
      const inactiveDiv = container.children[2 + inactiveIndex] as HTMLDivElement;

      const activeTextDiv = container.children[activeIndex] as HTMLDivElement;
      const inactiveTextDiv = container.children[inactiveIndex] as HTMLDivElement;

      // Both get text update
      activeTextDiv.textContent = message ?? '';
      inactiveTextDiv.textContent = message ?? '';

      activeDiv.setAttribute('aria-hidden', 'false');
      activeDiv.setAttribute(
        'aria-labelledby',
        activeIndex === 0 ? `voiceover-${chartId}-1` : `voiceover-${chartId}-2`,
      );
      if (message) {
        activeDiv.setAttribute('tabindex', '0');
      }

      inactiveDiv.setAttribute('aria-hidden', 'true');
      inactiveDiv.setAttribute(
        'aria-labelledby',
        activeIndex === 0 ? `voiceover-${chartId}-1` : `voiceover-${chartId}-2`,
      );
      inactiveDiv.removeAttribute('tabindex');

      activeDiv.focus();
    }
  }, [message, chartId]);

  return (
    <React.Fragment>
      <div
        role="none"
        // Stays focusable once an announcer child owns the tab stop, otherwise the browser would
        // blur the root mid hand-off and the chart would look like it lost the focus.
        tabIndex={message ? -1 : 0}
        ref={handleRef}
        style={fullSizeLayerStyle}
      />
      {/* The zoom range does not move the focus, so it is announced with a live region instead of the proxy. */}
      <div role="status" aria-live="polite" aria-atomic="true" style={liveRegionStyle}>
        {zoomMessage}
      </div>
    </React.Fragment>
  );
}
