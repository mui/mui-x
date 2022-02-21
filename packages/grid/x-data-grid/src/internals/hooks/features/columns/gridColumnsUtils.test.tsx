import { expect } from 'chai';
import { computeFlexColumnsWidth } from './gridColumnsUtils';

describe('gridColumnsUtils', () => {
  describe('computeFlexColumnsWidth', () => {
    it('should set the first column to be twice as wide as the second and third', () => {
      const flexColumns = [
        { field: 'id', minWidth: 50, flex: 2 },
        { field: 'username', minWidth: 50, flex: 1 },
        { field: 'age', minWidth: 50, flex: 1 },
      ];
      const computedColumns = computeFlexColumnsWidth({
        flexColumns,
        initialFreeSpace: 480,
        totalFlexUnits: 4,
      });

      expect(computedColumns[flexColumns[1].field].computedWidth).to.equal(
        computedColumns[flexColumns[2].field].computedWidth,
      );
      expect(computedColumns[flexColumns[0].field].computedWidth).to.equal(
        2 * computedColumns[flexColumns[1].field].computedWidth,
      );
    });

    it('should use `minWidth` if calculated flex size is smaller', () => {
      const flexColumns = [
        { field: 'id', minWidth: 50, flex: 2 },
        { field: 'username', minWidth: 50, flex: 1 },
        { field: 'age', minWidth: 50, flex: 1 },
      ];

      const computedColumns = computeFlexColumnsWidth({
        flexColumns,
        initialFreeSpace: 100,
        totalFlexUnits: 4,
      });

      expect(computedColumns[flexColumns[0].field].computedWidth).to.equal(50);
      expect(computedColumns[flexColumns[1].field].computedWidth).to.equal(50);
      expect(computedColumns[flexColumns[2].field].computedWidth).to.equal(50);
    });

    it('should distribute remaining space between flex items', () => {
      const flexColumns = [
        { field: 'id', minWidth: 50, flex: 1000 },
        { field: 'username', minWidth: 50, flex: 1000 },
        { field: 'age', minWidth: 50, flex: 1 },
      ];

      const computedColumns = computeFlexColumnsWidth({
        flexColumns,
        initialFreeSpace: 200,
        totalFlexUnits: 2001,
      });

      expect(computedColumns[flexColumns[0].field].computedWidth).to.equal(75);
      expect(computedColumns[flexColumns[1].field].computedWidth).to.equal(75);
      expect(computedColumns[flexColumns[2].field].computedWidth).to.equal(50);
    });
  });
});
