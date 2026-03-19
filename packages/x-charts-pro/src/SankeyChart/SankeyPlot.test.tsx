import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { SankeyPlot, sankeyClasses, SankeyChart } from '@mui/x-charts-pro/SankeyChart';

describe('<SankeyPlot />', () => {
  const { render } = createRenderer();

  it('should apply className to root element', () => {
    const { container } = render(
      <SankeyChart
        series={{
          type: 'sankey',
          data: {
            nodes: [
              { id: 'A', label: 'A' },
              { id: 'B', label: 'B' },
            ],
            links: [{ source: 'A', target: 'B', value: 5 }],
          },
        }}
        width={200}
        height={200}
      >
        <SankeyPlot className="custom-sankey" />
      </SankeyChart>,
    );

    const root = container.querySelector(`.${sankeyClasses.root}.custom-sankey`);
    expect(root).not.to.equal(null);
  });
});
