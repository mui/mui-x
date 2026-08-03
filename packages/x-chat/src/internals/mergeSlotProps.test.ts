import { describe, expect, it, vi } from 'vitest';
import { mergeSlotProps } from './mergeSlotProps';

function makeEvent() {
  return {
    defaultPrevented: false,
    preventDefault(this: { defaultPrevented: boolean }) {
      this.defaultPrevented = true;
    },
  };
}

describe('mergeSlotProps', () => {
  it('returns the base when the consumer prop is undefined', () => {
    expect(mergeSlotProps({ className: 'base' }, undefined)).to.deep.equal({ className: 'base' });
  });

  it('merges an object-form consumer prop without dropping wrapper props', () => {
    const baseClick = vi.fn();
    const consumerClick = vi.fn();
    const result = mergeSlotProps(
      {
        className: 'base',
        sx: { p: 1 },
        style: { display: 'flex', color: 'red' },
        onClick: baseClick,
      },
      {
        className: 'custom',
        sx: { m: 1 },
        style: { color: 'blue' },
        onClick: consumerClick,
        'data-x': '1',
      } as any,
    ) as any;

    expect(result.className).to.equal('base custom');
    expect(result.sx).to.deep.equal([{ p: 1 }, { m: 1 }]);
    expect(result.style).to.deep.equal({ display: 'flex', color: 'blue' });
    expect(result['data-x']).to.equal('1');

    result.onClick({ defaultPrevented: false });
    expect(baseClick).toHaveBeenCalledTimes(1);
    expect(consumerClick).toHaveBeenCalledTimes(1);
  });

  it('preserves the callback form and merges resolved props', () => {
    const consumer = ((ownerState: { variant: string }) => ({
      className: `custom-${ownerState.variant}`,
      sx: { m: 1 },
      onClick: () => {},
    })) as any;

    const result = mergeSlotProps({ className: 'base', sx: { p: 1 } }, consumer);

    expect(typeof result).to.equal('function');
    const resolved = (result as (os: { variant: string }) => Record<string, unknown>)({
      variant: 'compact',
    });
    expect(resolved.className).to.equal('base custom-compact');
    expect(resolved.sx).to.deep.equal([{ p: 1 }, { m: 1 }]);
    expect(typeof resolved.onClick).to.equal('function');
  });

  it('composes refs instead of letting a consumer ref replace the wrapper ref', () => {
    const baseRef = { current: null as HTMLDivElement | null };
    const consumerRef = vi.fn();
    const result = mergeSlotProps({ ref: baseRef }, { ref: consumerRef } as any) as any;
    const node = {} as HTMLDivElement;

    result.ref(node);

    expect(baseRef.current).to.equal(node);
    expect(consumerRef).toHaveBeenCalledWith(node);
  });

  it('tolerates a callback that returns nullish', () => {
    const consumer = (() => undefined) as any;
    const resolved = (mergeSlotProps({ className: 'base' }, consumer) as (os: unknown) => object)(
      {},
    );
    expect(resolved).to.deep.equal({ className: 'base' });
  });

  it('runs chained handlers base-first and stops when one calls preventDefault', () => {
    const order: string[] = [];
    const baseClick = vi.fn(() => {
      order.push('base');
    });
    const consumerClick = vi.fn(() => {
      order.push('consumer');
    });

    // No preventDefault: both run, base before consumer.
    const both = mergeSlotProps({ onClick: baseClick }, { onClick: consumerClick } as any) as any;
    both.onClick(makeEvent());
    expect(order).to.deep.equal(['base', 'consumer']);

    // Base prevents default: consumer is skipped.
    const blockingBase = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    const consumerAfter = vi.fn();
    const blocked = mergeSlotProps({ onClick: blockingBase }, {
      onClick: consumerAfter,
    } as any) as any;
    blocked.onClick(makeEvent());
    expect(blockingBase).toHaveBeenCalledTimes(1);
    expect(consumerAfter).toHaveBeenCalledTimes(0);
  });

  it('layers array-form sx (base layers first, consumer last)', () => {
    const result = mergeSlotProps({ sx: [{ p: 1 }] }, { sx: [{ m: 1 }, { gap: 1 }] } as any) as any;
    expect(result.sx).to.deep.equal([{ p: 1 }, { m: 1 }, { gap: 1 }]);
  });

  it('keeps the wrapper ref when the consumer ref is null', () => {
    const baseRef = vi.fn();
    const result = mergeSlotProps({ ref: baseRef }, { ref: null } as any) as any;
    // The internal ref is preserved rather than clobbered by null.
    expect(result.ref).to.equal(baseRef);
  });

  it('keeps the base handler when the consumer passes a null handler', () => {
    const baseClick = vi.fn();
    const result = mergeSlotProps({ onClick: baseClick }, { onClick: null } as any) as any;
    result.onClick(makeEvent());
    expect(baseClick).toHaveBeenCalledTimes(1);
  });

  it('does not let a consumer clobber the internal ownerState', () => {
    const result = mergeSlotProps({ ownerState: { density: 'compact', internal: true } }, {
      ownerState: { density: 'comfortable', extra: 1 },
    } as any) as any;
    // Base wins on conflicts (`density`), consumer-only keys are kept (`extra`).
    expect(result.ownerState).to.deep.equal({ density: 'compact', internal: true, extra: 1 });
  });
});
