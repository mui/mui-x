'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useChartId } from '../../../hooks/useChartId';
import { useChartsContext } from '../../../context/ChartsProvider';
import { useDescription } from './useDescription';

/**
 * Moves the DOM focus to the chart tab stop.
 * The root is only tabbable while there is no description, otherwise one of the announcer
 * children holds the tab stop.
 * @returns `true` when an element was focused.
 */
export function focusAccessibilityProxy(root: HTMLDivElement | null): boolean {
  if (!root) {
    return false;
  }

  const target =
    root.querySelector<HTMLElement>('[tabindex="0"]') ?? (root.tabIndex >= 0 ? root : null);

  // The proxy covers the whole chart, focusing it would scroll long pages.
  target?.focus({ preventScroll: true });

  return target !== null;
}

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

// The proxy is implemented by having two divs with the same content, and toggling the visibility of each one when the content changes.
// The idea is to imitate the behavior of the focus moving from a list element to another, but with the minimal number of DOM elements.

/**
 * This component provides an accessibility proxy for charts.
 * It uses two divs to let screen readers announce the focused content when it changes.
 */
export function ChartsAccessibilityProxy() {
  const message = useDescription();
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
    <div
      role="none"
      tabIndex={message ? undefined : 0}
      ref={handleRef}
      style={fullSizeLayerStyle}
    />
  );
}
