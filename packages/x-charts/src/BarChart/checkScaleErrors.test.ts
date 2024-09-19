import { expect } from 'chai';
import { checkScaleErrors } from './checkScaleErrors';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';

describe('BarChart - checkScaleErrors', () => {
  describe('verticalLayout: true', () => {
    it('should throw an error when the x-axis is not a band scale', () => {
      expect(() => {
        const xKey = DEFAULT_X_AXIS_KEY;
        const yKey = DEFAULT_Y_AXIS_KEY;
        checkScaleErrors(
          true,
          'seriesId',
          xKey,
          {
            // @ts-expect-error
            [xKey]: { id: xKey, scaleType: 'linear' },
          },
          yKey,
          {
            [yKey]: { id: yKey, scaleType: 'linear' },
          },
        );
      }).throws(
        'MUI X: The first `xAxis` should be of type "band" to display the bar series of id "seriesId".',
      );
    });

    it('should throw an error when the x-axis has no data property', () => {
      expect(() => {
        const xKey = DEFAULT_X_AXIS_KEY;
        const yKey = DEFAULT_Y_AXIS_KEY;
        checkScaleErrors(
          true,
          'seriesId',
          xKey,
          {
            // @ts-expect-error
            [xKey]: { id: xKey, scaleType: 'band' },
          },
          yKey,
          {
            [yKey]: { id: yKey, scaleType: 'linear' },
          },
        );
      }).throws('MUI X: The first `xAxis` should have data property.');
    });

    it('should throw an error when the y-axis is not a continuous scale', () => {
      expect(() => {
        const xKey = DEFAULT_X_AXIS_KEY;
        const yKey = DEFAULT_Y_AXIS_KEY;
        checkScaleErrors(
          true,
          'seriesId',
          xKey,
          {
            // @ts-expect-error
            [xKey]: { id: xKey, scaleType: 'band', data: [] },
          },
          yKey,
          {
            [yKey]: { id: yKey, scaleType: 'band' },
          },
        );
      }).throws(
        'MUI X: The first `yAxis` should be a continuous type to display the bar series of id "seriesId".',
      );
    });

    it('should not throw an error when the scales are correct', () => {
      expect(() => {
        const xKey = DEFAULT_X_AXIS_KEY;
        const yKey = DEFAULT_Y_AXIS_KEY;
        checkScaleErrors(
          true,
          'seriesId',
          xKey,
          {
            // @ts-expect-error
            [xKey]: { id: xKey, scaleType: 'band', data: [] },
          },
          yKey,
          {
            [yKey]: { id: yKey, scaleType: 'linear' },
          },
        );
      }).not.to.throw();
    });
  });

  describe('verticalLayout: false', () => {
    it('should throw an error when the y-axis is not a band scale', () => {
      expect(() => {
        const xKey = DEFAULT_X_AXIS_KEY;
        const yKey = DEFAULT_Y_AXIS_KEY;
        checkScaleErrors(
          false,
          'seriesId',
          xKey,
          {
            // @ts-expect-error
            [xKey]: { id: xKey, scaleType: 'linear' },
          },
          yKey,
          {
            [yKey]: { id: yKey, scaleType: 'linear' },
          },
        );
      }).throws(
        'MUI X: The first `yAxis` should be of type "band" to display the bar series of id "seriesId".',
      );
    });

    it('should throw an error when the y-axis has no data property', () => {
      expect(() => {
        const xKey = DEFAULT_X_AXIS_KEY;
        const yKey = DEFAULT_Y_AXIS_KEY;
        checkScaleErrors(
          false,
          'seriesId',
          xKey,
          {
            // @ts-expect-error
            [xKey]: { id: xKey, scaleType: 'linear' },
          },
          yKey,
          {
            [yKey]: { id: yKey, scaleType: 'band' },
          },
        );
      }).throws('MUI X: The first `yAxis` should have data property.');
    });

    it('should throw an error when the x-axis is not a continuous scale', () => {
      expect(() => {
        const xKey = DEFAULT_X_AXIS_KEY;
        const yKey = DEFAULT_Y_AXIS_KEY;
        checkScaleErrors(
          false,
          'seriesId',
          xKey,
          {
            // @ts-expect-error
            [xKey]: { id: xKey, scaleType: 'band' },
          },
          yKey,
          {
            [yKey]: { id: yKey, scaleType: 'band', data: [] },
          },
        );
      }).throws(
        'MUI X: The first `xAxis` should be a continuous type to display the bar series of id "seriesId".',
      );
    });

    it('should not throw an error when the scales are correct', () => {
      expect(() => {
        const xKey = DEFAULT_X_AXIS_KEY;
        const yKey = DEFAULT_Y_AXIS_KEY;
        checkScaleErrors(
          false,
          'seriesId',
          xKey,
          {
            // @ts-expect-error
            [xKey]: { id: xKey, scaleType: 'linear' },
          },
          yKey,
          {
            [yKey]: { id: yKey, scaleType: 'band', data: [] },
          },
        );
      }).not.to.throw();
    });
  });

  it('should throw an error specifying the x-axis id when it is not the default one', () => {
    expect(() => {
      const xKey = 'x-test';
      const yKey = 'y-test';
      checkScaleErrors(
        true,
        'seriesId',
        xKey,
        {
          // @ts-expect-error
          [xKey]: { id: xKey, scaleType: 'linear' },
        },
        yKey,
        {
          [yKey]: { id: yKey, scaleType: 'band' },
        },
      );
    }).throws(
      'MUI X: The x-axis with id "x-test" should be of type "band" to display the bar series of id "seriesId".',
    );
  });

  it('should throw an error specifying the y-axis id when it is not the default one', () => {
    expect(() => {
      const xKey = 'x-test';
      const yKey = 'y-test';
      checkScaleErrors(
        false,
        'seriesId',
        xKey,
        {
          // @ts-expect-error
          [xKey]: { id: xKey, scaleType: 'band' },
        },
        yKey,
        {
          [yKey]: { id: yKey, scaleType: 'linear' },
        },
      );
    }).throws(
      'MUI X: The y-axis with id "y-test" should be of type "band" to display the bar series of id "seriesId".',
    );
  });
});
