import { isJSDOM } from 'test/utils/skipIf';
import { Size } from '../models';
import { measureScrollbarSize, observeRootNode } from './dimensions';

describe.skipIf(isJSDOM)('dimensions', () => {
  describe('measureScrollbarSize', () => {
    it('does not mistake a bordered, non-scrolling container border for a scrollbar', () => {
      const borderless = document.createElement('div');
      borderless.style.overflow = 'hidden';
      borderless.style.width = '100px';
      borderless.style.height = '100px';
      document.body.appendChild(borderless);

      const bordered = document.createElement('div');
      bordered.style.overflow = 'hidden';
      bordered.style.border = '13px solid';
      bordered.style.width = '100px';
      bordered.style.height = '100px';
      document.body.appendChild(bordered);

      try {
        const borderedSize = measureScrollbarSize(bordered);
        const borderlessSize = measureScrollbarSize(borderless);
        expect(borderedSize).to.equal(borderlessSize);
      } finally {
        borderless.remove();
        bordered.remove();
      }
    });

    it('measures a real overflowing scroll container directly', () => {
      const scroller = document.createElement('div');
      scroller.style.overflow = 'scroll';
      scroller.style.width = '100px';
      scroller.style.height = '100px';
      const inner = document.createElement('div');
      inner.style.width = '200px';
      inner.style.height = '200px';
      scroller.appendChild(inner);
      document.body.appendChild(scroller);

      try {
        // A scrolling element is measured directly as `offsetWidth - clientWidth`
        expect(measureScrollbarSize(scroller)).to.equal(
          scroller.offsetWidth - scroller.clientWidth,
        );
      } finally {
        scroller.remove();
      }
    });
  });

  describe('observeRootNode', () => {
    it('reports the correct content box size on the initial measurement', () => {
      const node = document.createElement('div');
      node.style.boxSizing = 'border-box';
      node.style.width = '200px';
      node.style.height = '150px';
      node.style.border = '10px solid';
      node.style.padding = '5px';
      document.body.appendChild(node);

      let reported: Size | undefined;
      const store = { state: { rootSize: Size.EMPTY } } as any;
      const cleanup = observeRootNode(node, store, (size) => {
        reported = size;
      });

      try {
        // border-box 200x150 minus 10px border + 5px padding on each side.
        expect(reported?.width).to.equal(200 - 2 * 10 - 2 * 5); // 170
        expect(reported?.height).to.equal(150 - 2 * 10 - 2 * 5); // 120
      } finally {
        cleanup?.();
        node.remove();
      }
    });
  });
});
