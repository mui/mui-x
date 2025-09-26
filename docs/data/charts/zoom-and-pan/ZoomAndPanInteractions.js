import * as React from 'react';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';

const knobs = {
  // Zoom interactions
  wheelZoom: {
    knob: 'switch',
    defaultValue: true,
  },
  pinchZoom: {
    knob: 'switch',
    defaultValue: true,
  },
  tapAndDragZoom: {
    knob: 'switch',
    defaultValue: false,
  },
  // Pan interactions
  dragPan: {
    knob: 'switch',
    defaultValue: true,
  },
};

export default function ZoomAndPanInteractions() {
  return (
    <ChartsUsageDemo
      componentName="Zoom and Pan Interactions demo"
      data={knobs}
      renderDemo={(props) => {
        // Build zoom interactions array
        const zoomInteractions = [];
        if (props.wheelZoom) {
          zoomInteractions.push('wheel');
        }
        if (props.pinchZoom) {
          zoomInteractions.push('pinch');
        }
        if (props.tapAndDragZoom) {
          zoomInteractions.push('tapAndDrag');
        }

        // Build pan interactions array
        const panInteractions = [];
        if (props.dragPan) {
          panInteractions.push('drag');
        }

        const zoomInteractionConfig = {
          zoom: zoomInteractions,
          pan: panInteractions,
        };

        return (
          <div style={{ width: '100%', margin: 4 }}>
            <ScatterChartPro
              height={300}
              xAxis={[
                {
                  data: data.map((v, i) => i),
                  zoom: true,
                },
              ]}
              yAxis={[
                {
                  zoom: true,
                },
              ]}
              series={series}
              zoomInteractionConfig={zoomInteractionConfig}
            />
          </div>
        );
      }}
      getCode={({ props }) => {
        // Build zoom interactions array for code generation
        const zoomInteractions = [];
        if (props.wheelZoom) {
          zoomInteractions.push('wheel');
        }
        if (props.pinchZoom) {
          zoomInteractions.push('pinch');
        }
        if (props.tapAndDragZoom) {
          zoomInteractions.push('tapAndDrag');
        }

        // Build pan interactions array
        const panInteractions = [];
        if (props.dragPan) {
          panInteractions.push('drag');
        }

        const zoomConfig =
          zoomInteractions.length > 0
            ? `["${zoomInteractions.join('", "')}"]`
            : '[]';
        const panConfig =
          panInteractions.length > 0 ? `["${panInteractions.join('", "')}"]` : '[]';

        return `import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';

<ScatterChartPro
  // ...
  zoomInteractionConfig={{
    zoom: ${zoomConfig},
    pan: ${panConfig},
  }}
/>`;
      }}
    />
  );
}

const data = [
  {
    x: 443,
    y: 153,
  },
  {
    x: 110,
    y: 217,
  },
  {
    x: 175,
    y: 286,
  },
  {
    x: 195,
    y: 325,
  },
  {
    x: 351,
    y: 144,
  },
  {
    x: 43,
    y: 146,
  },
  {
    x: 376,
    y: 309,
  },
  {
    x: 31,
    y: 236,
  },
  {
    x: 231,
    y: 440,
  },
  {
    x: 108,
    y: 20,
  },
];

const series = [
  {
    label: 'Series A',
    data,
  },
];
