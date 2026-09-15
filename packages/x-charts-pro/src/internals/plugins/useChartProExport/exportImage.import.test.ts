import { vi, describe, it, expect, onTestFinished } from 'vitest';
import { exportImage } from './exportImage';

vi.mock('rasterizehtml', () => ({
  get default() {
    throw new Error('Import failed');
  },
}));

describe('exportImage when `rasterizehtml` fails to import', () => {
  function createChart() {
    const element = document.createElement('div');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    element.appendChild(svg);
    document.body.appendChild(element);
    onTestFinished(() => element.remove());
    return { element, svg };
  }

  it('rejects with the import error', async () => {
    const { element, svg } = createChart();
    const iframeCount = document.querySelectorAll('iframe').length;

    await expect(exportImage(element, svg, { copyStyles: false })).rejects.toThrow(
      "MUI X Charts: Failed to import 'rasterizehtml' module.",
    );
    expect(document.querySelectorAll('iframe').length).to.equal(iframeCount);
  });

  it('rejects with the error of an earlier step, without an unhandled rejection from the import', async () => {
    const { element, svg } = createChart();
    const error = new Error('Export interrupted');

    await expect(
      exportImage(element, svg, {
        copyStyles: false,
        onBeforeExport: () => {
          throw error;
        },
      }),
    ).rejects.toBe(error);
  });
});
