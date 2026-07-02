import { createRenderer } from '@mui/internal-test-utils';
import { hsl } from '@mui/x-charts-vendor/d3-color';
import { Treemap, treemapClasses } from '@mui/x-charts-pro/Treemap';

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

  it('does not render a tile for the root node', () => {
    const { container } = render(
      <Treemap width={200} height={200} margin={0} series={twoLeaves} />,
    );

    expect(container.querySelector('[data-node="root"]')).to.equal(null);
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

  it('shades levels so deeper tiles are lighter than shallower ones', () => {
    const { container } = render(
      <Treemap
        width={200}
        height={200}
        margin={0}
        series={{
          data: {
            id: 'root',
            children: [{ id: 'group', children: [{ id: 'leaf', value: 10 }] }],
          },
        }}
      />,
    );

    const lightnessOf = (selector: string) =>
      hsl(container.querySelector(selector)!.getAttribute('fill')!).l;

    // 'group' is shallower (painted behind) so it is darker than its deeper 'leaf'.
    expect(lightnessOf('[data-node="leaf"]')).to.be.greaterThan(lightnessOf('[data-node="group"]'));
  });

  it('always labels the root layer in multi-level treemaps', () => {
    const { container } = render(
      <Treemap
        width={300}
        height={200}
        margin={0}
        series={{
          data: { id: 'root', children: [{ id: 'group', children: [{ id: 'leaf', value: 10 }] }] },
        }}
      />,
    );

    expect(container.querySelector(`.${treemapClasses.label}[data-node="group"]`)).not.to.equal(
      null,
    );
  });

  it('uses a showLabels predicate to choose which tiles are labeled', () => {
    const { container } = render(
      <Treemap
        width={300}
        height={200}
        margin={0}
        series={{
          data: {
            id: 'root',
            children: [
              { id: 'A', value: 10 },
              { id: 'B', value: 8 },
            ],
          },
          nodeOptions: { showLabels: (node) => node.id === 'A' },
        }}
      />,
    );

    expect(container.querySelector(`.${treemapClasses.label}[data-node="A"]`)).not.to.equal(null);
    expect(container.querySelector(`.${treemapClasses.label}[data-node="B"]`)).to.equal(null);
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
});
