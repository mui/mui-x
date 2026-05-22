import { createRenderer, fireEvent } from '@mui/internal-test-utils';
import { SankeyPlot, sankeyClasses, SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import { spy } from 'sinon';

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

  it('should not call onHighlightChange when re-entering the controlled sankey node with extra payload fields', () => {
    const handleHighlight = spy();
    const { container } = render(
      <SankeyChart
        height={400}
        width={400}
        series={{
          id: 'S',
          data: {
            nodes: [{ id: 'X' }, { id: 'Y' }],
            links: [{ source: 'X', target: 'Y', value: 1 }],
          },
        }}
        highlightedItem={
          { type: 'sankey', seriesId: 'S', subType: 'node', nodeId: 'X', extra: 'payload' } as any
        }
        onHighlightChange={handleHighlight}
      />,
    );
    const nodeX = container.querySelector('[data-node="X"]') as Element;
    fireEvent.pointerEnter(nodeX);
    expect(handleHighlight.callCount).to.equal(0);
  });
});
