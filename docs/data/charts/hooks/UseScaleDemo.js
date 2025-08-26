import * as React from 'react';
import { useXScale, useYScale, getValueToPositionMapper } from '@mui/x-charts/hooks';
import { LineChart } from '@mui/x-charts/LineChart';

const data = [
  { x: 1, y: 2 },
  { x: 2, y: 5 },
  { x: 3, y: 3 },
  { x: 4, y: 8 },
  { x: 5, y: 1 },
];

function CustomDataPoints() {
  const xScale = useXScale();
  const yScale = useYScale();

  // Use the value-to-position mapper for more accurate positioning
  const xMapper = getValueToPositionMapper(xScale);
  const yMapper = getValueToPositionMapper(yScale);

  return (
    <g>
      {data.map((point, index) => {
        const x = xMapper(point.x);
        const y = yMapper(point.y);
        
        return (
          <g key={index}>
            {/* Custom data point */}
            <circle
              cx={x}
              cy={y}
              r={6}
              fill="red"
              stroke="white"
              strokeWidth={2}
            />
            {/* Value label */}
            <text
              x={x}
              y={y - 10}
              textAnchor="middle"
              fontSize="10"
              fill="red"
              fontWeight="bold"
            >
              ({point.x}, {point.y})
            </text>
          </g>
        );
      })}
    </g>
  );
}

function ScaleInfo() {
  const xScale = useXScale();
  const yScale = useYScale();

  // Get scale information
  const xDomain = xScale.domain();
  const xRange = xScale.range();
  const yDomain = yScale.domain();
  const yRange = yScale.range();

  // Example transformations
  const exampleX = 3;
  const exampleY = 6;
  const transformedX = xScale(exampleX);
  const transformedY = yScale(exampleY);

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      right: 10,
      background: 'rgba(255, 255, 255, 0.95)',
      padding: 12,
      borderRadius: 4,
      fontSize: '12px',
      border: '1px solid #e0e0e0',
      fontFamily: 'monospace',
      maxWidth: 250,
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontFamily: 'inherit' }}>
        Scale Information
      </h4>
      
      <div style={{ marginBottom: 8 }}>
        <strong>X Scale:</strong>
        <div>Domain: [{xDomain.join(', ')}]</div>
        <div>Range: [{xRange.join(', ')}]</div>
        <div>Example: {exampleX} → {transformedX?.toFixed(1)}px</div>
      </div>
      
      <div style={{ marginBottom: 8 }}>
        <strong>Y Scale:</strong>
        <div>Domain: [{yDomain.join(', ')}]</div>
        <div>Range: [{yRange.join(', ')}]</div>
        <div>Example: {exampleY} → {transformedY?.toFixed(1)}px</div>
      </div>

      <div style={{ fontSize: '10px', color: '#666', marginTop: 8 }}>
        Red dots show custom positioned elements using scale functions
      </div>
    </div>
  );
}

export default function UseScaleDemo() {
  return (
    <div style={{ width: '100%', height: 400, position: 'relative' }}>
      <LineChart
        data={data}
        xAxis={[{ dataKey: 'x', label: 'X Values' }]}
        yAxis={[{ dataKey: 'y', label: 'Y Values' }]}
        series={[{ dataKey: 'y', label: 'Sample Data', color: '#8884d8' }]}
        width={600}
        height={400}
        margin={{ left: 80, right: 280, top: 40, bottom: 80 }}
      >
        <CustomDataPoints />
      </LineChart>
      <ScaleInfo />
    </div>
  );
}
