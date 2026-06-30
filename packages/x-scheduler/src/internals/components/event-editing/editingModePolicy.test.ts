import { getInitialEditingMode } from './editingModePolicy';

describe('getInitialEditingMode', () => {
  const originalMatchMedia = window.matchMedia;

  const setCoarsePointer = (coarse: boolean) => {
    window.matchMedia = ((query: string) => ({
      matches: coarse,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as any;
  };

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('opens the form directly when creating, regardless of surface or pointer', () => {
    setCoarsePointer(true);
    expect(getInitialEditingMode('dialog', { isCreating: true })).to.equal('edit');
    expect(getInitialEditingMode('drawer', { isCreating: true })).to.equal('edit');
  });

  it('opens the surface directly for read-only events (nothing to arm)', () => {
    setCoarsePointer(true);
    expect(getInitialEditingMode('dialog', { isReadOnly: true })).to.equal('edit');
    expect(getInitialEditingMode('drawer', { isReadOnly: true })).to.equal('edit');
  });

  it('always arms on the compact drawer', () => {
    setCoarsePointer(false);
    expect(getInitialEditingMode('drawer')).to.equal('armed');
    setCoarsePointer(true);
    expect(getInitialEditingMode('drawer')).to.equal('armed');
  });

  it('arms the dialog only on a coarse pointer', () => {
    setCoarsePointer(true);
    expect(getInitialEditingMode('dialog')).to.equal('armed');
    setCoarsePointer(false);
    expect(getInitialEditingMode('dialog')).to.equal('edit');
  });
});
