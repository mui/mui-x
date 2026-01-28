import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';

const knobs = {
  // Zoom interactions
  zoom: {
    knob: 'title',
    displayName: 'Zoom interactions',
  },
  wheel: {
    displayName: 'Wheel',
    knob: 'switch',
    defaultValue: true,
  },
  pinch: {
    displayName: 'Pinch',
    knob: 'switch',
    defaultValue: true,
  },
  tapAndDrag: {
    displayName: 'Tap and drag',
    knob: 'switch',
    defaultValue: false,
  },
  brush: {
    displayName: 'Brush',
    knob: 'switch',
    defaultValue: false,
  },
  doubleTapReset: {
    displayName: 'Double tap reset',
    knob: 'switch',
    defaultValue: false,
  },
  // Pan interactions
  pan: {
    knob: 'title',
    displayName: 'Pan interactions',
  },
  drag: {
    displayName: 'Drag',
    knob: 'switch',
    defaultValue: true,
  },
  pressAndDrag: {
    displayName: 'Press and drag',
    knob: 'switch',
    defaultValue: false,
  },
  wheelPan: {
    displayName: 'Pan on wheel',
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
        if (props.wheel) {
          zoomInteractions.push('wheel');
        }
        if (props.pinch) {
          zoomInteractions.push('pinch');
        }
        if (props.tapAndDrag) {
          zoomInteractions.push('tapAndDrag');
        }
        if (props.brush) {
          zoomInteractions.push('brush');
        }
        if (props.doubleTapReset) {
          zoomInteractions.push('doubleTapReset');
        }

        // Build pan interactions array
        const panInteractions = [];
        if (props.drag) {
          panInteractions.push('drag');
        }
        if (props.pressAndDrag) {
          panInteractions.push('pressAndDrag');
        }
        if (props.wheelPan) {
          panInteractions.push('wheel');
        }

        const zoomInteractionConfig = {
          zoom: zoomInteractions,
          pan: panInteractions,
        };

        return (
          <div style={{ width: '100%' }}>
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
                  width: 40,
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
        if (props.wheel) {
          zoomInteractions.push('wheel');
        }
        if (props.pinch) {
          zoomInteractions.push('pinch');
        }
        if (props.tapAndDrag) {
          zoomInteractions.push('tapAndDrag');
        }
        if (props.brush) {
          zoomInteractions.push('brush');
        }
        if (props.doubleTapReset) {
          zoomInteractions.push('doubleTapReset');
        }

        // Build pan interactions array
        const panInteractions = [];
        if (props.drag) {
          panInteractions.push('drag');
        }
        if (props.pressAndDrag) {
          panInteractions.push('pressAndDrag');
        }
        if (props.wheelPan) {
          panInteractions.push('wheel');
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
