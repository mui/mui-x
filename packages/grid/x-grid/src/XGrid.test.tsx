import * as React from 'react';
// @ts-expect-error need to migrate helpers to TypeScript
import { fireEvent, screen, createClientRenderStrictMode } from 'test/utils';
import { raf } from 'test/utils/helperFn';
import { expect } from 'chai';
import { XGrid, useApiRef } from '@material-ui/x-grid';

describe('<XGrid />', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
    rows: [
      {
        id: 0,
        brand: 'Nike',
      },
      {
        id: 1,
        brand: 'Adidas',
      },
      {
        id: 2,
        brand: 'Puma',
      },
    ],
    columns: [{ field: 'brand', width: 100 }],
  };

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  // Adapation of describeConformance()
  describe('Material-UI component API', () => {
    it(`attaches the ref`, () => {
      const ref = React.createRef<HTMLDivElement>();
      const { container } = render(
        <div style={{ width: 300, height: 300 }}>
          <XGrid {...baselineProps} ref={ref} />
        </div>,
      );
      expect(ref.current).to.be.instanceof(window.HTMLDivElement);
      expect(ref.current).to.equal(container.firstChild.firstChild.firstChild);
    });

    function randomStringValue() {
      return `r${Math.random().toString(36).slice(2)}`;
    }

    it('applies the className to the root component', () => {
      const className = randomStringValue();

      const { container } = render(
        <div style={{ width: 300, height: 300 }}>
          <XGrid {...baselineProps} className={className} />
        </div>,
      );

      expect(document.querySelector(`.${className}`)).to.equal(
        container.firstChild.firstChild.firstChild,
      );
    });
  });

  it('should resize the width of the columns', async () => {
    interface TestCaseProps {
      width?: number;
    }
    const TestCase = (props: TestCaseProps) => {
      const { width = 300 } = props;
      return (
        <div style={{ width, height: 300 }}>
          <XGrid {...baselineProps} />
        </div>
      );
    };

    const { container, setProps } = render(<TestCase width={300} />);
    let rect;
    rect = container.querySelector('[role="row"][data-rowindex="0"]').getBoundingClientRect();
    expect(rect.width).to.equal(300 - 2);

    setProps({ width: 400 });
    await raf(); // wait for the AutoSize's dimension detection logic
    rect = container.querySelector('[role="row"][data-rowindex="0"]').getBoundingClientRect();
    expect(rect.width).to.equal(400 - 2);
  });

  describe('prop: checkboxSelection', () => {
    it('should check and uncheck when double clicking the row', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <XGrid
            rows={[
              {
                id: 0,
                brand: 'Nike',
              },
            ]}
            columns={[{ field: 'brand', width: 100 }]}
            checkboxSelection
            hideFooter
          />
        </div>,
      );
      const row = document.querySelector('[role="row"][aria-rowindex="2"]');
      const checkbox = row!.querySelector('input');
      expect(row).to.not.have.class('Mui-selected');
      expect(checkbox).to.have.property('checked', false);

      fireEvent.click(screen.getByRole('cell', { name: 'Nike' }));
      expect(row!.classList.contains('Mui-selected')).to.equal(true, 'class mui-selected 1');
      expect(checkbox).to.have.property('checked', true);

      fireEvent.click(screen.getByRole('cell', { name: 'Nike' }));
      expect(row!.classList.contains('Mui-selected')).to.equal(false, 'class mui-selected 2');
      expect(checkbox).to.have.property('checked', false);
    });
  });

  describe('prop: apiRef', () => {
    it('should apply setPage correctly', () => {
      const rows = [
        {
          id: 0,
          brand: 'Nike',
        },
        {
          id: 1,
          brand: 'Addidas',
        },
        {
          id: 2,
          brand: 'Puma',
        },
      ];
      const GridTest = () => {
        const apiRef = useApiRef();
        React.useEffect(() => {
          apiRef.current.setPage(2);
        }, [apiRef]);
        return (
          <div style={{ width: 300, height: 300 }}>
            <XGrid
              rows={rows}
              apiRef={apiRef}
              columns={baselineProps.columns}
              pagination
              pageSize={1}
              hideFooter
            />
          </div>
        );
      };
      render(<GridTest />);
      const cell = document.querySelector('[role="cell"][aria-colindex="0"]')!;
      expect(cell).to.have.text('Addidas');
    });
  });
});
