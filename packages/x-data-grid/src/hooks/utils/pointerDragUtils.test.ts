import { describe, it, expect, afterEach } from 'vitest';
import { createDragPreview, getEdgeScrollDelta } from './pointerDragUtils';

describe('getEdgeScrollDelta', () => {
  it('should not scroll away from the edges', () => {
    expect(getEdgeScrollDelta(150, 100, 300)).to.equal(0);
  });

  it('should scroll toward the start near the start edge, faster closer to it', () => {
    const slow = getEdgeScrollDelta(120, 100, 300);
    const fast = getEdgeScrollDelta(101, 100, 300);
    expect(slow).to.be.lessThan(0);
    expect(fast).to.be.lessThan(slow);
  });

  it('should scroll toward the end near the end edge, and cap the speed past it', () => {
    expect(getEdgeScrollDelta(290, 100, 300)).to.be.greaterThan(0);
    expect(getEdgeScrollDelta(400, 100, 300)).to.equal(getEdgeScrollDelta(300, 100, 300));
  });
});

describe('createDragPreview', () => {
  let container: HTMLElement;

  afterEach(() => {
    container?.remove();
  });

  const createSource = () => {
    container = document.createElement('div');
    container.innerHTML = `
      <div id="source" role="gridcell" tabindex="0" aria-colindex="1" data-field="name" class="cell">
        <button id="child" tabindex="0" aria-label="Drag" data-testid="child">x</button>
      </div>`;
    document.body.appendChild(container);
    return container.querySelector<HTMLElement>('#source')!;
  };

  it('should copy the look of the source, not its identity', () => {
    const source = createSource();
    const preview = createDragPreview(source, {
      container,
      clientX: 0,
      clientY: 0,
      className: 'dragging custom',
    });

    expect(preview.element.parentElement).to.equal(container);
    expect(preview.element.className).to.equal('cell dragging custom');
    expect(preview.element.getAttribute('aria-hidden')).to.equal('true');
    expect(preview.element.hasAttribute('inert')).to.equal(true);
    expect(preview.element.style.pointerEvents).to.equal('none');
    ['id', 'role', 'tabindex', 'aria-colindex', 'data-field'].forEach((name) => {
      expect(preview.element.hasAttribute(name)).to.equal(false);
    });
    const child = preview.element.querySelector('button')!;
    ['id', 'tabindex', 'aria-label', 'data-testid'].forEach((name) => {
      expect(child.hasAttribute(name)).to.equal(false);
    });
    // The source is unchanged
    expect(source.getAttribute('data-field')).to.equal('name');
    expect(document.querySelectorAll('[data-field="name"]')).to.have.length(1);
  });

  it('should be removed with `remove`', () => {
    const source = createSource();
    const preview = createDragPreview(source, { container, clientX: 0, clientY: 0 });
    preview.remove();
    expect(preview.element.isConnected).to.equal(false);
  });
});
