import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  applyResizeDeltaToPositions,
  captureFormulaLiveResizeSession,
} from './gridFormulaLiveGeometry';

// Committed layout: item=190, quantity=70, unitPrice=110.
const positions = [0, 190, 260];

const createApiRef = (widths: Record<string, number>) => {
  const fields = Object.keys(widths);
  return {
    current: {
      getColumnIndex: (field: string) => fields.indexOf(field),
      getColumn: (field: string) =>
        field in widths ? { field, computedWidth: widths[field] } : undefined,
    },
  } as unknown as RefObject<GridPrivateApiPremium>;
};

describe('gridFormulaLiveGeometry', () => {
  describe('applyResizeDeltaToPositions', () => {
    it('shifts only the columns after the resized one', () => {
      // quantity 70 → 150 = +80: item and quantity keep their left edges,
      // unitPrice moves 260 → 340 (where the grid's drag mutation puts the cell).
      expect(applyResizeDeltaToPositions(positions, 1, 80)).to.deep.equal([0, 190, 340]);
    });

    it('supports a negative delta (shrinking drag)', () => {
      expect(applyResizeDeltaToPositions(positions, 0, -40)).to.deep.equal([0, 150, 220]);
    });

    it('leaves every position untouched when the last column is resized', () => {
      expect(applyResizeDeltaToPositions(positions, 2, 80)).to.deep.equal(positions);
    });

    it('returns the input array unchanged for a zero delta', () => {
      expect(applyResizeDeltaToPositions(positions, 1, 0)).to.equal(positions);
    });
  });

  describe('captureFormulaLiveResizeSession', () => {
    it('captures the visible index and committed width of the resized column', () => {
      const apiRef = createApiRef({ item: 190, quantity: 70, unitPrice: 110 });
      expect(captureFormulaLiveResizeSession(apiRef, 'quantity')).to.deep.equal({
        field: 'quantity',
        columnIndex: 1,
        startWidth: 70,
      });
    });

    it('returns null for an unknown column', () => {
      const apiRef = createApiRef({ item: 190 });
      expect(captureFormulaLiveResizeSession(apiRef, 'missing')).to.equal(null);
    });
  });
});
