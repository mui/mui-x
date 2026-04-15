import Box from '@mui/material/Box';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsSvgLayer } from '@mui/x-charts/ChartsSvgLayer';
import { Unstable_ChartsRadialGrid } from '@mui/x-charts/ChartsRadialGrid';
import { ChartsRotationAxis } from '@mui/x-charts/ChartsRotationAxis';
import { Unstable_ChartsRadialDataProvider } from '@mui/x-charts/ChartsRadialDataProvider';

export default function RotationAxisPlayground() {
  return (
    <ChartsUsageDemo
      componentName="RotationAxis"
      data={
        {
          disableLine: { knob: 'switch', defaultValue: false },
          disableTicks: { knob: 'switch', defaultValue: false },
          tickSize: { knob: 'number', defaultValue: 6, min: 0, max: 20 },
          rotationTickNumber: { knob: 'number', defaultValue: 8, min: 0, max: 20 },
          startAngle: {
            knob: 'number',
            defaultValue: -90,
            min: -360,
            max: 400,
            step: 10,
          },
          endAngle: {
            knob: 'number',
            defaultValue: 180,
            min: -360,
            max: 400,
            step: 10,
          },
          minRadius: { knob: 'number', defaultValue: 30, min: 0, step: 10 },
          maxRadius: { knob: 'number', defaultValue: 150, min: 50, step: 10 },
        } as const
      }
      renderDemo={(props) => (
        <Box
          sx={{
            width: '100%',
            height: 400,
          }}
        >
          <Unstable_ChartsRadialDataProvider
            width={400}
            height={400}
            rotationAxis={[
              {
                min: 0,
                max: 360,
                startAngle: props.startAngle,
                endAngle: props.endAngle,
                tickNumber: props.rotationTickNumber,
              },
            ]}
            radiusAxis={[
              {
                min: 0,
                max: 100,
                minRadius: props.minRadius,
                maxRadius: props.maxRadius,
              },
            ]}
          >
            <ChartsLayerContainer>
              <ChartsSvgLayer>
                <Unstable_ChartsRadialGrid rotation radius />
                <ChartsRotationAxis
                  disableLine={props.disableLine}
                  disableTicks={props.disableTicks}
                  tickSize={props.tickSize}
                />
              </ChartsSvgLayer>
            </ChartsLayerContainer>
          </Unstable_ChartsRadialDataProvider>
        </Box>
      )}
      getCode={({ props }) => `<Unstable_ChartsRadialDataProvider
  rotationAxis={[{
    startAngle: ${props.startAngle},
    endAngle: ${props.endAngle},
    tickNumber: ${props.rotationTickNumber},
  }]}
  radiusAxis={[{
    minRadius: ${props.minRadius},
    maxRadius: ${props.maxRadius},
  }]}
>
  <Unstable_ChartsRadialGrid rotation radius />
  <ChartsRotationAxis
${[
  `tickSize={${props.tickSize}}`,
  props.disableLine && 'disableLine',
  props.disableTicks && 'disableTicks',
]
  .filter(Boolean)
  .map((line) => `    ${line}`)
  .join('\n')}
  />
</Unstable_ChartsRadialDataProvider>`}
    />
  );
}
