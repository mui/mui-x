import * as React from 'react';
import { screen, createClientRender, act, fireEvent } from 'test/utils';
import { expect } from 'chai';
import { XGrid } from '@material-ui/x-grid';
import { useData } from 'packages/storybook/src/hooks/useData';

function getActiveCell() {
  const activeElement = document.activeElement;

  if (!activeElement || !activeElement.parentElement) {
    return null;
  }

  return `${activeElement.parentElement.getAttribute('data-rowindex')}-${activeElement.getAttribute(
    'data-colindex',
  )}`;
}

async function sleep(duration: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

async function raf() {
  return new Promise((resolve) => {
    // Chrome and Safari have a bug where calling rAF once returns the current
    // frame instead of the next frame, so we need to call a double rAF here.
    // See crbug.com/675795 for more.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

describe('<XGrid />', () => {
  const render = createClientRender();

  const defaultProps = {
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
    columns: [
      { field: 'id', hide: true },
      { field: 'brand', width: 100 },
    ],
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
      const ref = React.createRef();
      const { container } = render(
        <div style={{ width: 300, height: 300 }}>
          <XGrid {...defaultProps} ref={ref} />
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
          <XGrid {...defaultProps} className={className} />
        </div>,
      );

      expect(document.querySelector(`.${className}`)).to.equal(
        container.firstChild.firstChild.firstChild,
      );
    });
  });

  describe('keyboard', () => {
    const KeyboardTest = () => {
      const data = useData(100, 20);
      const transformColSizes = (columns) => columns.map((column) => ({ ...column, width: 60 }));

      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid rows={data.rows} columns={transformColSizes(data.columns)} />
        </div>
      );
    };

    it('cell navigation with arrows ', async () => {
      render(<KeyboardTest />);
      await raf();
      // @ts-ignore
      document.querySelector('[data-rowindex="0"]').querySelector('[data-colindex="0"]').focus();
      expect(getActiveCell()).to.equal('0-0');

      fireEvent.keyDown(document.activeElement, { code: 'ArrowRight' });
      await raf();
      expect(getActiveCell()).to.equal('0-1');

      fireEvent.keyDown(document.activeElement, { code: 'ArrowDown' });
      await raf();
      expect(getActiveCell()).to.equal('1-1');

      fireEvent.keyDown(document.activeElement, { code: 'ArrowLeft' });
      await raf();
      expect(getActiveCell()).to.equal('1-0');

      fireEvent.keyDown(document.activeElement, { code: 'ArrowUp' });
      await raf();
      expect(getActiveCell()).to.equal('0-0');
    });

    it('Home / End navigation', async () => {
      render(<KeyboardTest />);
      await raf();
      // @ts-ignore
      document.querySelector('[data-rowindex="1"]').querySelector('[data-colindex="1"]').focus();
      expect(getActiveCell()).to.equal('1-1');

      fireEvent.keyDown(document.activeElement, { code: 'Home' });
      await raf();
      expect(getActiveCell()).to.equal('1-0');

      fireEvent.keyDown(document.activeElement, { code: 'End' });
      await raf();
      expect(getActiveCell()).to.equal('1-19');
    });
  });

  it('should resize the width of the columns', async function test() {
    function App(props) {
      const { width = 300 } = props;
      return (
        <div style={{ width, height: 300 }}>
          <XGrid {...defaultProps} />
        </div>
      );
    }

    const { container, setProps } = render(<App />);
    let rect;
    // @ts-ignore
    rect = container.querySelector('[role="row"][data-rowindex="0"]').getBoundingClientRect();
    expect(rect.width).to.equal(300 - 2);
    setProps({ width: 400 });
    act(() => {
      window.dispatchEvent(new window.Event('resize', {}));
    });
    await sleep(100); // resize debounce
    await sleep(100); // Not sure why
    // @ts-ignore
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
            columns={[
              { field: 'id', hide: true },
              { field: 'brand', width: 100 },
            ]}
            checkboxSelection
          />
        </div>,
      );

      const row = document.querySelector('[role="row"][aria-rowindex="2"]');
      const checkbox = row!.querySelector('input');
      expect(row).to.not.have.class('selected');
      expect(checkbox).to.have.property('checked', false);

      fireEvent.click(screen.getByRole('cell', { name: 'Nike' }));
      expect(row).to.have.class('selected');
      expect(checkbox).to.have.property('checked', true);

      fireEvent.click(screen.getByRole('cell', { name: 'Nike' }));
      expect(row).to.not.have.class('selected');
      expect(checkbox).to.have.property('checked', false);
    });
  });

  describe('sorting', () => {
    it('should sort when clicking the header cell', () => {
      function getColumnValues() {
        return Array.from(document.querySelectorAll('[aria-colindex="0"]')).map(
          (x) => x!.textContent,
        );
      }

      render(
        <div style={{ width: 300, height: 300 }}>
          <XGrid {...defaultProps} />
        </div>,
      );
      const header = screen.getByRole('columnheader', { name: 'brand' });
      expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      fireEvent.click(header);
      expect(getColumnValues()).to.deep.equal(['Adidas', 'Nike', 'Puma']);
      fireEvent.click(header);
      expect(getColumnValues()).to.deep.equal(['Puma', 'Nike', 'Adidas']);
    });
  });
});
