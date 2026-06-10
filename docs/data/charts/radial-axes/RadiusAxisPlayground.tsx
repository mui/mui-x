import Box from '@mui/material/Box';
import ChartsUsageDemo from 'docs/src/modules/components/ChartsUsageDemo';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsSvgLayer } from '@mui/x-charts/ChartsSvgLayer';
import { ChartsRadialGrid } from '@mui/x-charts/ChartsRadialGrid';
import { ChartsRadiusAxis } from '@mui/x-charts/ChartsRadiusAxis';
import { ChartsRadialDataProvider } from '@mui/x-charts/ChartsRadialDataProvider';

export default function RadiusAxisPlayground() {
  return (
    <ChartsUsageDemo
      componentName="RadiusAxis"
      data={
        {
          disableLine: { knob: 'switch', defaultValue: true },
          disableTicks: { knob: 'switch', defaultValue: true },
          tickPosition: {
            knob: 'select',
            options: ['after', 'before'],
            defaultValue: 'after',
          },
          tickLabelPosition: {
            knob: 'select',
            options: ['center', 'after', 'before'],
            defaultValue: 'center',
          },
          tickSize: { knob: 'number', defaultValue: 6, min: -20, max: 20 },
          position: {
            knob: 'number',
            defaultValue: -90,
            min: -180,
            max: 180,
            step: 10,
          },
          radiusTickNumber: { knob: 'number', defaultValue: 3, min: 0, max: 20 },
          startAngle: {
            knob: 'number',
            defaultValue: -90,
            min: -360,
            max: 400,
            step: 10,
          },
          endAngle: {
            knob: 'number',
            defaultValue: 90,
            min: -360,
            max: 400,
            step: 10,
          },
          minRadius: { knob: 'number', defaultValue: 30, min: 0, step: 10 },
          maxRadius: { knob: 'number', defaultValue: 130, min: 50, step: 10 },
        } as const
      }
      renderDemo={(props) => (
        <Box
          sx={{
            width: '100%',
          }}
        >
          <ChartsRadialDataProvider
            height={400}
            rotationAxis={[
              {
                min: 0,
                max: 100,
                startAngle: props.startAngle,
                endAngle: props.endAngle,
              },
            ]}
            radiusAxis={[
              {
                min: 0,
                max: 100,
                minRadius: props.minRadius,
                maxRadius: props.maxRadius,
                tickNumber: props.radiusTickNumber,
              },
            ]}
          >
            <ChartsLayerContainer>
              <ChartsSvgLayer>
                <ChartsRadialGrid rotation radius />
                <ChartsRadiusAxis
                  position={props.position}
                  disableLine={props.disableLine}
                  disableTicks={props.disableTicks}
                  tickSize={props.tickSize}
                  tickLabelPosition={props.tickLabelPosition}
                  tickPosition={props.tickPosition}
                />
              </ChartsSvgLayer>
            </ChartsLayerContainer>
          </ChartsRadialDataProvider>
        </Box>
      )}
      getCode={({ props }) => `<ChartsRadialDataProvider
  rotationAxis={[{
    startAngle: ${props.startAngle},
    endAngle: ${props.endAngle},
  }]}
  radiusAxis={[{
    minRadius: ${props.minRadius},
    maxRadius: ${props.maxRadius},
    tickNumber: ${props.radiusTickNumber},
${[
  `position: ${props.position}`,
  `tickSize: ${props.tickSize}`,
  props.disableLine && 'disableLine: true,',
  props.disableTicks && 'disableTicks: true,',
  props.tickPosition && `tickPosition: "${props.tickPosition}",`,
  props.tickLabelPosition && `tickLabelPosition: "${props.tickLabelPosition}",`,
]
  .filter(Boolean)
  .map((line) => `    ${line}`)
  .join('\n')}
  }]}
>
  <ChartsRadialGrid rotation radius />
  <ChartsRadiusAxis />
</ChartsRadialDataProvider>`}
    />
  );
}
