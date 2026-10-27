import { createRenderer } from '@mui/internal-test-utils';
import { describe, it, expect, vi } from 'vitest';
import { useGridPipeProcessing } from './useGridPipeProcessing';

describe('useGridPipeProcessing', () => {
  const { render } = createRenderer();

  it('should keep applying the pipes after an applier throws', () => {
    const apiRef = { current: {} as any };
    apiRef.current.register = (_: string, methods: object) =>
      Object.assign(apiRef.current, methods);
    function Test() {
      useGridPipeProcessing(apiRef);
      return null;
    }
    render(<Test />);

    const applier = vi.fn();
    applier.mockImplementationOnce(() => {
      throw new Error('applier error');
    });
    apiRef.current.registerPipeApplier('hydrateColumns', 'test', applier);

    expect(() => apiRef.current.requestPipeProcessorsApplication('hydrateColumns')).toThrow(
      'applier error',
    );
    apiRef.current.requestPipeProcessorsApplication('hydrateColumns');
    expect(applier).toHaveBeenCalledTimes(2);
  });
});
