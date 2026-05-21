import { createRenderer, describeConformance, screen } from '@mui/internal-test-utils';
import { ChartsLegend, legendClasses } from '@mui/x-charts/ChartsLegend';
import { ChartsDataProvider } from '@mui/x-charts/ChartsDataProvider';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { createTheme, ThemeProvider } from '@mui/material/styles';

describe('<ChartsLegend />', () => {
  const { render } = createRenderer();

  describeConformance(<ChartsLegend />, () => ({
    classes: legendClasses,
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
          >
            {/* Has to be first as describeConformance picks the "first child" */}
            {/* https://github.com/mui/material-ui/blob/c0620e333641deda56f3cd68c7c3736098ee818c/packages-internal/test-utils/src/describeConformance.tsx#L257 */}
            {children}
            <ChartsSurface />
          </ChartsDataProvider>
        ),
      }),
    muiName: 'MuiChartsLegend',
    testComponentPropWith: 'ul',
    refInstanceof: window.HTMLUListElement,
    ThemeProvider,
    createTheme,
    // SKIP
    skip: ['themeVariants', 'componentProp'],
  }));

  it('should apply mark classes to nested label mark slots', () => {
    render(
      <ChartsDataProvider
        height={50}
        width={50}
        series={[
          { type: 'line', id: 'line', label: 'Line', data: [10], labelMarkType: 'line' },
          {
            type: 'line',
            id: 'line-mark',
            label: 'Line+Mark',
            data: [20],
            labelMarkType: 'line+mark',
          },
          { type: 'line', id: 'square', label: 'Square', data: [30], labelMarkType: 'square' },
          { type: 'line', id: 'circle', label: 'Circle', data: [40], labelMarkType: 'circle' },
        ]}
      >
        <ChartsLegend
          classes={{
            mark: 'mark-root',
            markLine: 'mark-line',
            markLineAndShape: 'mark-line-and-shape',
            markSquare: 'mark-square',
            markCircle: 'mark-circle',
            markColored: 'mark-colored',
          }}
        />
        <ChartsSurface />
      </ChartsDataProvider>,
    );

    const list = screen.getByRole('list');
    expect(list.querySelector('.mark-root')).not.to.equal(null);
    expect(list.querySelector('.mark-line')).not.to.equal(null);
    expect(list.querySelector('.mark-line-and-shape')).not.to.equal(null);
    expect(list.querySelector('.mark-square')).not.to.equal(null);
    expect(list.querySelector('.mark-circle')).not.to.equal(null);
    expect(list.querySelector('.mark-colored')).not.to.equal(null);
  });
});
