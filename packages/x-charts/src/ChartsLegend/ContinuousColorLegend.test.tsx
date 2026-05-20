import { createRenderer, describeConformance, screen } from '@mui/internal-test-utils';
import { ContinuousColorLegend, continuousColorLegendClasses } from '@mui/x-charts/ChartsLegend';
import { ChartsDataProvider } from '@mui/x-charts/ChartsDataProvider';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { createTheme, ThemeProvider } from '@mui/material/styles';

describe('<ContinuousColorLegend />', () => {
  const { render } = createRenderer();

  describeConformance(<ContinuousColorLegend />, () => ({
    classes: continuousColorLegendClasses,
    inheritComponent: 'ul',
    render: (node) =>
      render(node, {
        wrapper: ({ children }) => (
          <ChartsDataProvider
            height={50}
            width={50}
            series={[
              {
                type: 'line',
                label: 'Line 1',
                data: [10, 20, 30, 40, 50],
              },
            ]}
            zAxis={[
              {
                colorMap: {
                  type: 'continuous',
                  min: -0.5,
                  max: 1.5,
                  color: (t) => `${t}`,
                },
              },
            ]}
          >
            {/* Has to be first as describeConformance picks the "first child" */}
            {/* https://github.com/mui/material-ui/blob/c0620e333641deda56f3cd68c7c3736098ee818c/packages-internal/test-utils/src/describeConformance.tsx#L257 */}
            {children}
            <ChartsSurface />
          </ChartsDataProvider>
        ),
      }),
    muiName: 'MuiContinuousColorLegend',
    testComponentPropWith: 'ul',
    refInstanceof: window.HTMLUListElement,
    ThemeProvider,
    createTheme,
    // SKIP
    skip: ['themeVariants', 'componentProp'],
  }));

  it('should apply gradient classes to nested label gradient slots', () => {
    render(
      <ChartsDataProvider
        height={50}
        width={50}
        series={[
          {
            type: 'line',
            label: 'Line 1',
            data: [10, 20, 30, 40, 50],
          },
        ]}
        zAxis={[
          {
            colorMap: {
              type: 'continuous',
              min: -0.5,
              max: 1.5,
              color: (t) => `${t}`,
            },
          },
        ]}
      >
        <ContinuousColorLegend
          classes={{
            horizontal: 'gradient-horizontal',
            gradientColored: 'gradient-colored',
          }}
        />
        <ChartsSurface />
      </ChartsDataProvider>,
    );

    const list = screen.getByRole('list');
    expect(list.className).contains('gradient-horizontal');
    expect(list.querySelector('.gradient-colored')).not.to.equal(null);
  });
});
