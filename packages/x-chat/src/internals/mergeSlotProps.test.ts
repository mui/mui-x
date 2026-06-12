import { describe, expect, it } from 'vitest';
import { mergeSlotProps } from './mergeSlotProps';

describe('mergeSlotProps', () => {
  it('returns the base when the consumer prop is undefined', () => {
    expect(mergeSlotProps({ className: 'base' }, undefined)).to.deep.equal({ className: 'base' });
  });

  it('merges an object-form consumer prop over the base', () => {
    const result = mergeSlotProps({ className: 'base', sx: { p: 1 } }, {
      className: 'custom',
      'data-x': '1',
    } as any);
    expect(result).to.deep.equal({ className: 'custom', sx: { p: 1 }, 'data-x': '1' });
  });

  it('preserves the callback form and layers the base underneath the resolved props', () => {
    const consumer = ((ownerState: { variant: string }) => ({
      className: `custom-${ownerState.variant}`,
      onClick: () => {},
    })) as any;

    const result = mergeSlotProps({ className: 'base', sx: { p: 1 } }, consumer);

    expect(typeof result).to.equal('function');
    const resolved = (result as (os: { variant: string }) => Record<string, unknown>)({
      variant: 'compact',
    });
    // base sx survives, the callback's resolved props win on conflict, handlers pass through.
    expect(resolved.className).to.equal('custom-compact');
    expect(resolved.sx).to.deep.equal({ p: 1 });
    expect(typeof resolved.onClick).to.equal('function');
  });

  it('tolerates a callback that returns nullish', () => {
    const consumer = (() => undefined) as any;
    const resolved = (mergeSlotProps({ className: 'base' }, consumer) as (os: unknown) => object)(
      {},
    );
    expect(resolved).to.deep.equal({ className: 'base' });
  });
});
