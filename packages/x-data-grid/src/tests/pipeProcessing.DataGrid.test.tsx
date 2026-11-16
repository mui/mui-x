import { createRenderer, act } from '@mui/internal-test-utils';
import { DataGrid } from '@mui/x-data-grid';
import { useGridPrivateApiContext } from '@mui/x-data-grid/internals';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

describe('<DataGrid /> - Pipe processing', () => {
  const { render } = createRenderer();

  it('should keep applying the pipe processors after an applier throws', async () => {
    let privateApi!: ReturnType<typeof useGridPrivateApiContext>;
    function Footer() {
      privateApi = useGridPrivateApiContext();
      return null;
    }
    await render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid
          autoHeight={isJSDOM}
          rows={[{ id: 0 }]}
          columns={[{ field: 'id' }]}
          slots={{ footer: Footer }}
        />
      </div>,
    );

    let shouldThrow = true;
    let calls = 0;
    privateApi.current.registerPipeProcessor('hydrateColumns', 'test', (columnsState) => {
      calls += 1;
      if (shouldThrow) {
        throw new Error('Processor failed');
      }
      return columnsState;
    });

    expect(() => {
      act(() => privateApi.current.requestPipeProcessorsApplication('hydrateColumns'));
    }).to.throw('Processor failed');
    expect(calls).to.equal(1);

    shouldThrow = false;
    act(() => privateApi.current.requestPipeProcessorsApplication('hydrateColumns'));
    expect(calls).to.equal(2);
  });
});
