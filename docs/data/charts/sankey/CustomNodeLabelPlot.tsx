'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  SankeyLayoutNode,
  useSankeyLayout,
  useSankeyNodeHighlightState,
  useSankeySeries,
} from '@mui/x-charts-pro/SankeyChart';

export function CustomNodeLabelPlot() {
  const sankeySeries = useSankeySeries()[0];
  const layout = useSankeyLayout();

  if (!sankeySeries) {
    throw new Error(
      `MUI X Charts: Sankey series context is missing. Ensure the SankeyPlot is used inside a properly configured ChartsDataProviderPro.`,
    );
  }

  // Early return if no data or dimensions
  if (!layout || !layout.nodes) {
    return null;
  }

  const showNodeLabels = sankeySeries.nodeOptions?.showLabels ?? true;
  if (!showNodeLabels) {
    return null;
  }

  return (
    <g>
      {layout.nodes.map((node) => (
        <CustomNodeLabel key={`label-node-${node.id}`} node={node} />
      ))}
    </g>
  );
}

function CustomNodeLabel(props: { node: SankeyLayoutNode }) {
  const { node } = props;
  const theme = useTheme();

  const highlightState = useSankeyNodeHighlightState(node.id);

  const x0 = node.x0 ?? 0;
  const y0 = node.y0 ?? 0;
  const x1 = node.x1 ?? 0;
  const y1 = node.y1 ?? 0;
  const depth = node.depth ?? 0;

  const isRightSide = depth <= 3;

  // Determine label position
  const labelX = isRightSide
    ? x1 + 6 // Right side for first column
    : x0 - 6; // Left side for other columns

  const labelAnchor = isRightSide ? 'start' : 'end';

  const nextNodeX = isRightSide
    ? Math.min(...node.sourceLinks.map((link) => link.target.x0 ?? Infinity))
    : Math.max(...node.targetLinks.map((link) => link.source.x1 ?? -Infinity));

  const width = Math.abs(nextNodeX - labelX);

  if (!node.label) {
    return null;
  }

  return (
    <foreignObject
      x={labelX}
      y={(y0 + y1) / 2}
      width={1}
      height={1}
      overflow="visible"
      data-node={node.id}
      data-highlighted={highlightState === 'highlighted' || undefined}
      data-faded={highlightState === 'faded' || undefined}
    >
      <div style={{ position: 'relative', overflow: 'visible' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: isRightSide ? 'flex-start' : 'flex-end',
            position: 'fixed',
            textAlign: labelAnchor,
            fontSize: theme.typography.caption.fontSize,
            fontFamily: theme.typography.fontFamily,
            pointerEvents: 'none',
            transform: 'translateY(-50%)',
            ...(isRightSide ? { left: 0 } : { right: 0 }),
            width: 'max-content',
          }}
        >
          <div
            style={{
              position: 'absolute',
              opacity: 0.3,
              background: node.color,
              left: -3,
              right: -3,
              top: 0,
              bottom: 0,
              borderRadius: 4,
            }}
          />
          <span style={{ maxWidth: width }}>{node.label}</span>
        </div>
      </div>
    </foreignObject>
  );
}
