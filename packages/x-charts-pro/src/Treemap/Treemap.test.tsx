import { act, createRenderer } from '@mui/internal-test-utils';
import { hsl } from '@mui/x-charts-vendor/d3-color';
import { isJSDOM } from 'test/utils/skipIf';
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

  describe('highlight scopes', () => {
    // root
    // ├─ A
    // │  ├─ A1 ─ (A1a, A1b)
    // │  └─ A2
    // └─ B
    const hierarchy = {
      id: 'root',
      children: [
        {
          id: 'A',
          children: [
            {
              id: 'A1',
              children: [
                { id: 'A1a', value: 5 },
                { id: 'A1b', value: 4 },
              ],
            },
            { id: 'A2', value: 8 },
          ],
        },
        { id: 'B', value: 12 },
      ],
    };

    const renderScope = (highlight: string, nodeId: string, fade?: string) =>
      render(
        <Treemap
          width={400}
          height={300}
          margin={0}
          series={{
            id: 's',
            data: hierarchy,
            nodeOptions: { highlight: highlight as any, fade: fade as any },
          }}
          highlightedItem={{ type: 'treemap', seriesId: 's', nodeId }}
        />,
      );

    const attr = (container: HTMLElement, id: string, name: string) =>
      container.querySelector(`.${treemapClasses.cell}[data-node="${id}"]`)?.getAttribute(name) ===
      'true';
    const highlighted = (container: HTMLElement, id: string) =>
      attr(container, id, 'data-highlighted');
    const faded = (container: HTMLElement, id: string) => attr(container, id, 'data-faded');

    it("'children' highlights the tile and all its descendants", () => {
      const { container } = renderScope('children', 'A');
      ['A', 'A1', 'A2', 'A1a', 'A1b'].forEach((id) =>
        expect(highlighted(container, id)).to.equal(true),
      );
      expect(highlighted(container, 'B')).to.equal(false);
    });

    it("'child' highlights the tile and its immediate children only", () => {
      const { container } = renderScope('child', 'A');
      ['A', 'A1', 'A2'].forEach((id) => expect(highlighted(container, id)).to.equal(true));
      ['A1a', 'A1b', 'B'].forEach((id) => expect(highlighted(container, id)).to.equal(false));
    });

    it("'parents' highlights the tile and all its ancestors", () => {
      const { container } = renderScope('parents', 'A1a');
      ['A1a', 'A1', 'A'].forEach((id) => expect(highlighted(container, id)).to.equal(true));
      ['A1b', 'A2', 'B'].forEach((id) => expect(highlighted(container, id)).to.equal(false));
    });

    it("'parent' highlights the tile and its immediate parent only", () => {
      const { container } = renderScope('parent', 'A1a');
      ['A1a', 'A1'].forEach((id) => expect(highlighted(container, id)).to.equal(true));
      ['A', 'A1b', 'A2', 'B'].forEach((id) => expect(highlighted(container, id)).to.equal(false));
    });

    it('fade accepts hierarchy scopes', () => {
      // Highlight only A, fade its descendants.
      const { container } = renderScope('node', 'A', 'children');
      expect(highlighted(container, 'A')).to.equal(true);
      ['A1', 'A2', 'A1a', 'A1b'].forEach((id) => expect(faded(container, id)).to.equal(true));
      expect(faded(container, 'B')).to.equal(false);
      expect(highlighted(container, 'B')).to.equal(false);
    });

    it("'global' fade dims everything that is not highlighted", () => {
      const { container } = renderScope('children', 'A', 'global');
      ['A', 'A1', 'A2', 'A1a', 'A1b'].forEach((id) => expect(faded(container, id)).to.equal(false));
      expect(faded(container, 'B')).to.equal(true);
    });
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
        <Treemap width={200} height={200} margin={0} series={clickable} onItemClick={onItemClick} />,
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

    it.skipIf(isJSDOM)('highlights the tile under the pointer', async () => {
      const { userEvent } = await import('vitest/browser');
      const { container } = render(
        <Treemap width={200} height={200} margin={0} series={clickable} />,
      );

      const bTile = container.querySelector<HTMLElement>(`.${treemapClasses.cell}[data-node="B"]`)!;
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        await userEvent.hover(bTile);
      });

      expect(bTile.getAttribute('data-highlighted')).to.equal('true');
    });
  });
});
