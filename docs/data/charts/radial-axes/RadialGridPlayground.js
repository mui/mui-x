import Box from '@mui/material/Box';
import ChartsUsageDemo from 'docs/src/modules/components/ChartsUsageDemo';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsSvgLayer } from '@mui/x-charts/ChartsSvgLayer';
import { ChartsRadialGrid } from '@mui/x-charts/ChartsRadialGrid';
import { ChartsRadialDataProvider } from '@mui/x-charts/ChartsRadialDataProvider';

export default function RadialGridPlayground() {
  return (
    <ChartsUsageDemo
      componentName="RadialGrid"
      data={{
        rotation: { knob: 'switch', defaultValue: true },
        radius: { knob: 'switch', defaultValue: true },
        rotationTickNumber: { knob: 'number', defaultValue: 10, min: 0, max: 20 },
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
      }}
      renderDemo={(props) => (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <ChartsRadialDataProvider
            height={300}
            rotationAxis={[
              {
                min: 0,
                max: 100,
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
                tickNumber: props.radiusTickNumber,
              },
            ]}
          >
            <ChartsLayerContainer>
              <ChartsSvgLayer>
                <ChartsRadialGrid rotation={props.rotation} radius={props.radius} />
              </ChartsSvgLayer>
            </ChartsLayerContainer>
          </ChartsRadialDataProvider>
        </Box>
      )}
      getCode={({ props }) => `<ChartsRadialDataProvider
  rotationAxis={[{
    startAngle: ${props.startAngle},
    endAngle: ${props.endAngle},
    tickNumber: ${props.rotationTickNumber},
  }]}
  radiusAxis={[{
    minRadius: ${props.minRadius},
    maxRadius: ${props.maxRadius},
    tickNumber: ${props.radiusTickNumber},
  }]}
>
  <ChartsRadialGrid ${[props.rotation && 'rotation', props.radius && 'radius'].filter(Boolean).join(' ')} />
</ChartsRadialDataProvider>`}
    />
  );
}
