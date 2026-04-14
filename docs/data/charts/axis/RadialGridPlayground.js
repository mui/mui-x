import Box from '@mui/material/Box';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsSvgLayer } from '@mui/x-charts/ChartsSvgLayer';
import { Unstable_ChartsRadialGrid } from '@mui/x-charts/ChartsRadialGrid';
import { Unstable_ChartsRadialDataProvider } from '@mui/x-charts/ChartsRadialDataProvider';

export default function RadialGridPlayground() {
  return (
    <ChartsUsageDemo
      componentName="RadialGrid"
      data={{
        rotation: { knob: 'switch', defaultValue: true },
        radius: { knob: 'switch', defaultValue: true },
        rotationTickNumber: { knob: 'number', defaultValue: 10 },
        radiusTickNumber: { knob: 'number', defaultValue: 10 },
        startAngle: { knob: 'number', defaultValue: 0, min: -360, max: 360 },
        endAngle: { knob: 'number', defaultValue: 360, min: -360, max: 360 },
        minRadius: { knob: 'number', defaultValue: 0, min: 0 },
        maxRadius: { knob: 'number', defaultValue: 100, min: 50 },
      }}
      renderDemo={(props) => (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Unstable_ChartsRadialDataProvider
            width={400}
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
                <Unstable_ChartsRadialGrid
                  rotation={props.rotation}
                  radius={props.radius}
                />
              </ChartsSvgLayer>
            </ChartsLayerContainer>
          </Unstable_ChartsRadialDataProvider>
          ,
        </Box>
      )}
      getCode={({
        props,
      }) => `import { Unstable_ChartsRadialGrid } from '@mui/x-charts/ChartsRadialGrid';

      <Unstable_ChartsRadialGrid ${[props.rotation && 'rotation', props.radius && 'radius'].filter(Boolean).join(' ')} />`}
    />
  );
}
