import Box from '@mui/material/Box';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsSvgLayer } from '@mui/x-charts/ChartsSvgLayer';
import { Unstable_ChartsRadialGrid } from '@mui/x-charts/ChartsRadialGrid';
import { Unstable_ChartsRadiusAxis as ChartsRadiusAxis } from '@mui/x-charts/ChartsRadiusAxis';
import { Unstable_ChartsRadialDataProviderPro } from '@mui/x-charts-pro/ChartsRadialDataProviderPro';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {
  ChartsToolbarPrintExportTrigger,
  ChartsToolbarImageExportTrigger,
} from '@mui/x-charts-pro/ChartsToolbarPro';
import PrintIcon from '@mui/icons-material/Print';
import PhotoIcon from '@mui/icons-material/Photo';
import { Toolbar, ToolbarButton } from '@mui/x-charts/Toolbar';
import { useChartRootRef } from '@mui/x-charts-pro/hooks';

function Wrapper({ children }) {
  const chartRootRef = useChartRootRef();
  return <div ref={chartRootRef}>{children}</div>;
}

export default function RadiusAxisPlayground() {
  return (
    <ChartsUsageDemo
      componentName="RadiusAxis"
      data={{
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
        angle: {
          knob: 'number',
          defaultValue: -90,
          min: -180,
          max: 180,
          step: 10,
        },
        radiusTickNumber: { knob: 'number', defaultValue: 5, min: 0, max: 20 },
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
        maxRadius: { knob: 'number', defaultValue: 150, min: 50, step: 10 },
      }}
      renderDemo={(props) => (
        <Box
          sx={{
            width: '100%',
            height: 400,
          }}
        >
          <Unstable_ChartsRadialDataProviderPro
            width={400}
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
            <Toolbar>
              <Tooltip title="Print">
                <ChartsToolbarPrintExportTrigger
                  render={<ToolbarButton render={<IconButton size="small" />} />}
                  options={{ fileName: 'ChartWithCustomToolbar' }}
                >
                  <PrintIcon />
                </ChartsToolbarPrintExportTrigger>
              </Tooltip>
              <Tooltip title="Export as PNG">
                <ChartsToolbarImageExportTrigger
                  render={<ToolbarButton render={<IconButton size="small" />} />}
                  options={{ type: 'image/png', fileName: 'ChartWithCustomToolbar' }}
                >
                  <PhotoIcon />
                </ChartsToolbarImageExportTrigger>
              </Tooltip>
            </Toolbar>
            <Wrapper>
              <ChartsLayerContainer>
                <ChartsSvgLayer>
                  <Unstable_ChartsRadialGrid rotation radius />
                  <ChartsRadiusAxis
                    angle={props.angle}
                    disableLine={props.disableLine}
                    disableTicks={props.disableTicks}
                    tickSize={props.tickSize}
                    tickLabelPosition={props.tickLabelPosition}
                    tickPosition={props.tickPosition}
                  />
                </ChartsSvgLayer>
              </ChartsLayerContainer>
            </Wrapper>
          </Unstable_ChartsRadialDataProviderPro>
        </Box>
      )}
      getCode={({ props }) => `<Unstable_ChartsRadialDataProviderPro
  rotationAxis={[{
    startAngle: ${props.startAngle},
    endAngle: ${props.endAngle},
  }]}
  radiusAxis={[{
    minRadius: ${props.minRadius},
    maxRadius: ${props.maxRadius},
    tickNumber: ${props.radiusTickNumber},
  }]}
>
  <Unstable_ChartsRadialGrid rotation radius />
  <ChartsRadiusAxis
${[
  `angle={${props.angle}}`,
  `tickSize={${props.tickSize}}`,
  props.disableLine && 'disableLine',
  props.disableTicks && 'disableTicks',
  props.tickPosition && `tickPosition="${props.tickPosition}"`,
  props.tickLabelPosition && `tickLabelPosition="${props.tickLabelPosition}"`,
]
  .filter(Boolean)
  .map((line) => `    ${line}`)
  .join('\n')}
  />
</Unstable_ChartsRadialDataProviderPro>`}
    />
  );
}
