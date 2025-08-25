import { ZoomData } from '@mui/x-charts/internals';
import { initializeZoomData } from './useChartProZoom';

describe('initializeZoomData', () => {
  const defaultZoomOptions = {
    axisId: 'x',
    minStart: 0,
    maxEnd: 100,
  };

  it('should initialize zoom data for all axes based on provided options when no zoom data is given', () => {
    const options = {
      x: { ...defaultZoomOptions, axisId: 'x', minStart: 0, maxEnd: 100 },
      y: { ...defaultZoomOptions, axisDirection: 'y', axisId: 'y', minStart: 10, maxEnd: 50 },
    };

    const result = initializeZoomData(options);

    expect(result).to.deep.equal([
      { axisId: 'x', start: 0, end: 100 },
      { axisId: 'y', start: 10, end: 50 },
    ]);
  });

  it('should override options with provided zoom data when matching axisId exists', () => {
    const options = {
      x: { ...defaultZoomOptions, axisId: 'x', minStart: 0, maxEnd: 100 },
      y: { ...defaultZoomOptions, axisDirection: 'y', axisId: 'y', minStart: 10, maxEnd: 50 },
    };

    const zoomData: readonly ZoomData[] = [{ axisId: 'x', start: 20, end: 60 }];
    const result = initializeZoomData(options, zoomData);

    expect(result).to.deep.equal([
      { axisId: 'x', start: 20, end: 60 },
      { axisId: 'y', start: 10, end: 50 },
    ]);
  });

  it('should ignore zoom data if its axisId is not present in options', () => {
    const options = {
      x: { ...defaultZoomOptions, axisId: 'x', minStart: 0, maxEnd: 100 },
    };

    const zoomData: readonly ZoomData[] = [{ axisId: 'y', start: 10, end: 50 }];
    const result = initializeZoomData(options, zoomData);

    expect(result).to.deep.equal([{ axisId: 'x', start: 0, end: 100 }]);
  });

  it('should handle an empty options object without errors', () => {
    const result = initializeZoomData({});
    expect(result).to.deep.equal([]);
  });

  it('should handle undefined zoomData gracefully', () => {
    const options = {
      x: { ...defaultZoomOptions, axisId: 'x', minStart: 0, maxEnd: 100 },
    };

    const result = initializeZoomData(options, undefined);

    expect(result).to.deep.equal([{ axisId: 'x', start: 0, end: 100 }]);
  });
});
