import { act, createRenderer, screen } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { Treemap, treemapClasses } from '@mui/x-charts-premium/Treemap';

describe('<Treemap />', () => {
  const { render } = createRenderer();

  const twoLeaves = {
    data: {
      id: 'root',
      children: [
        { id: 'A', value: 10 },
        { id: 'B', value: 30 },
      ],
    },
  } as const;

  it('renders a tile per leaf node', () => {
    const { container } = render(
      <Treemap width={200} height={200} margin={0} series={twoLeaves} />,
    );

    const cells = container.querySelectorAll(`.${treemapClasses.cell}`);
    expect(cells.length).to.equal(2);
  });

  it('sizes tiles proportionally to their value', () => {
    const { container } = render(
      <Treemap width={200} height={200} margin={0} series={twoLeaves} />,
    );

    const area = (selector: string) => {
      const el = container.querySelector(selector)!;
      return Number(el.getAttribute('width')) * Number(el.getAttribute('height'));
    };

    // B has 3x the value of A, so it should cover ~3x the area.
    expect(area('[data-node="B"]')).to.be.closeTo(
      area('[data-node="A"]') * 3,
      area('[data-node="A"]'),
    );
  });

  it('renders the "No data to display" overlay for an empty treemap', () => {
    render(<Treemap width={200} height={200} margin={0} series={{ data: [] }} />);

    expect(screen.getByText('No data to display')).toBeVisible();
  });

  it('does not render a tile for the root node', () => {
    const { container } = render(
      <Treemap width={200} height={200} margin={0} series={twoLeaves} />,
    );

    expect(container.querySelector('[data-node="root"]')).to.equal(null);
  });

  it('labels every rendered tile by default', () => {
    const { container } = render(
      <Treemap width={200} height={200} margin={0} series={twoLeaves} />,
    );

    expect(container.querySelector(`.${treemapClasses.label}[data-node="A"]`)).not.to.equal(null);
    expect(container.querySelector(`.${treemapClasses.label}[data-node="B"]`)).not.to.equal(null);
  });

  it('does not crash when a node uses a named CSS color', () => {
    expect(() =>
      render(
        <Treemap
          width={200}
          height={200}
          margin={0}
          series={{
            data: { id: 'root', children: [{ id: 'A', value: 10, color: 'rebeccapurple' }] },
          }}
        />,
      ),
    ).not.to.throw();
  });

  it('renders nested group and leaf tiles', () => {
    const { container } = render(
      <Treemap
        width={200}
        height={200}
        margin={0}
        series={{
          data: {
            id: 'root',
            children: [
              {
                id: 'group',
                children: [
                  { id: 'leaf1', value: 5 },
                  { id: 'leaf2', value: 5 },
                ],
              },
            ],
          },
        }}
      />,
    );

    expect(container.querySelector('[data-node="group"]')).not.to.equal(null);
    expect(container.querySelector('[data-node="leaf1"]')).not.to.equal(null);
    expect(container.querySelector('[data-node="leaf2"]')).not.to.equal(null);
  });

  // Central hit-testing needs real client coordinates, unavailable in JSDOM.
  describe('central pointer interaction', () => {
    const clickable = { id: 's', ...twoLeaves } as const;

    it.skipIf(isJSDOM)('fires onItemClick with the clicked tile', async () => {
      const { userEvent } = await import('vitest/browser');
      const onItemClick = vi.fn();
      const { container } = render(
        <Treemap
          width={200}
          height={200}
          margin={0}
          series={clickable}
          onItemClick={onItemClick}
        />,
      );

      const bTile = container.querySelector<HTMLElement>(`.${treemapClasses.cell}[data-node="B"]`)!;
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        await userEvent.click(bTile);
      });

      expect(onItemClick).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ type: 'treemap', seriesId: 's', nodeId: 'B' }),
      );
    });
  });
});
