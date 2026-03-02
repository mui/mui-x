'use client';
import * as React from 'react';
import { useFocusedBarData, type UseFocusedBarDataReturn } from './useFocusedBarData';
import { useChartId } from '../hooks';

function formatMessage(params: UseFocusedBarDataReturn): string {
  const { axis, series } = params;

  const parts: string[] = [];

  if (series.label) {
    parts.push(typeof series.label === 'function' ? series.label('tooltip') : series.label);
  }

  if (axis.label) {
    parts.push(`${axis.label}: ${axis.value.toString()}`);
  } else {
    parts.push(axis.value.toString());
  }

  if (series.value !== null) {
    parts.push(`Value: ${series.value}`);
  }

  return parts.join(', ');
}

const visuallyHiddenStyle: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
};

export interface BarVoiceOverProps {
  format?: (params: UseFocusedBarDataReturn) => string | null;
}

export function BarVoiceOver(props: BarVoiceOverProps) {
  const data = useFocusedBarData();
  const chartId = useChartId();

  const currentFormatRef = React.useRef<string | null>(null);
  const currentIndexRef = React.useRef<number>(0);
  const containerRef = React.useRef(null);
  const { format = formatMessage } = props;

  const message = data ? format(data) : null;

  React.useEffect(() => {
    const container = containerRef.current as HTMLDivElement | null;
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
        if (i === (currentIndexRef.current + 1) % 2) {
          div.setAttribute('tabindex', '0');
        }
        div.setAttribute('role', 'img');
        div.setAttribute(
          'aria-labelledby',
          i === 0 ? `voiceover-${chartId}-1` : `voiceover-${chartId}-2`,
        );
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
      activeTextDiv.setAttribute('aria-label', message ?? '');
      inactiveTextDiv.setAttribute('aria-label', message ?? '');

      activeDiv.setAttribute('aria-hidden', 'false');
      inactiveDiv.setAttribute('aria-hidden', 'true');
      activeDiv.setAttribute('tabindex', '0');
      inactiveDiv.removeAttribute('tabindex');

      activeDiv.focus();
    }
  }, [message, chartId]);

  return <div role="presentation" ref={containerRef} style={visuallyHiddenStyle} />;
}
