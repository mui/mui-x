'use client';
import * as React from 'react';
import { useFocusedBarData, type UseFocusedBarDataReturn } from './useFocusedBarData';

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
        const div = document.createElement('rect');
        div.setAttribute('tabindex', '-1');
        div.style.display = 'none';
        container.appendChild(div);
      }
    }

    if (message && message !== currentFormatRef.current) {
      currentFormatRef.current = message;

      const inactiveIndex = currentIndexRef.current;

      currentIndexRef.current = (currentIndexRef.current + 1) % 2;

      const activeIndex = currentIndexRef.current;

      const activeDiv = container.children[activeIndex] as HTMLDivElement;
      const inactiveDiv = container.children[inactiveIndex] as HTMLDivElement;

      activeDiv.setAttribute('aria-label', message ?? '');
      activeDiv.style.display = 'block';
      inactiveDiv.style.display = 'none';

      activeDiv.focus();
    }
  }, [message]);

  return <g ref={containerRef} style={visuallyHiddenStyle} />;
}
