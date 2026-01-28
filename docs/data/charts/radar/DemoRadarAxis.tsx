import Box from '@mui/material/Box';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { RadarChart, RadarAxis } from '@mui/x-charts/RadarChart';

function getTextAnchor(textAnchor: 'default' | 'start' | 'end' | 'function') {
  switch (textAnchor) {
    case 'default':
      return undefined;
    case 'function':
      return (angle: number) => (angle < 180 ? 'start' : 'end');
    default:
      return textAnchor;
  }
}

function getTextAnchorCode(textAnchor: 'default' | 'start' | 'end' | 'function') {
  switch (textAnchor) {
    case 'default':
      return '';
    case 'function':
      return `textAnchor={(angle) => angle < 180 ? 'start' : 'end'}`;
    default:
      return `textAnchor="${textAnchor}"`;
  }
}

export default function DemoRadarAxis() {
  return (
    <ChartsUsageDemo
      componentName="RadarChart"
      data={{
        angle: {
          knob: 'number',
          defaultValue: 30,
          min: -360,
          max: 360,
          step: 10,
        },
        divisions: {
          knob: 'number',
          defaultValue: 4,
          min: 1,
          max: 5,
        },
        labelOrientation: {
          knob: 'radio',
          options: ['horizontal', 'rotated'] as const,
          defaultValue: 'horizontal',
        },
        textAnchor: {
          knob: 'select',
          options: ['default', 'start', 'end', 'function'] as const,
          defaultValue: 'default',
        },
      }}
      renderDemo={(props) => (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <RadarChart
            height={250}
            margin={{ top: 20 }}
            series={[{ data: [100, 98, 86, 99, 85, 55] }]}
            divisions={4}
            radar={{
              max: 100,
              metrics: [
                'Math',
                'Chinese',
                'English',
                'Geography',
                'Physics',
                'History',
              ],
            }}
          >
            <RadarAxis
              metric="Math"
              labelOrientation={props.labelOrientation}
              angle={props.angle}
              textAnchor={getTextAnchor(props.textAnchor)}
              divisions={props.divisions}
            />
          </RadarChart>
        </Box>
      )}
      getCode={({ props }) => {
        const textAnchorCode = getTextAnchorCode(props.textAnchor);
        return [
          `import { RadarChart, RadarAxis } from '@mui/x-charts/RadarChart';`,
          '',
          '<RadarChart>',
          `  <RadarAxis`,
          `    metric="Math"`,
          `    divisions={${props.divisions}}`,
          `    labelOrientation="${props.labelOrientation}"`,
          `    angle="${props.angle}"`,
          ...(textAnchorCode ? [`    ${textAnchorCode}`] : []),
          '  />',
          '</RadarChart>',
        ].join('\n');
      }}
    />
  );
}
