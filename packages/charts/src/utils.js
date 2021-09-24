import * as d3 from 'd3';

// Returns the extend (min and max values) of a data set.
// If more than one set of data (nested arrays, or objects with an accessor),
// merge them to find extent across all sets.
// const mydata=[{data: [1,2,3]},{data: [4,5,6]}];
// getExtent(mydata, d => d.data.length);
// => [1, 6]
// getExtent(mydata, d => d.data.length, [3, 4]);
// => [3, 4]
// getExtent(mydata, d => d.data.length, [0]);
// => [0, 6]
// If a yDomain with two values is passed in, return it.
// If a yDomain with one value is passed in, use the value as the start of the extent.
// This is useful to allow the scale to start at zero (or some arbitrary value)
export function getExtent(data, accessor = (d) => d, yDomain) {
  if (yDomain && yDomain.length === 2) {
    return yDomain;
  }
  // eslint-disable-next-line prefer-spread
  const extent = d3.extent([].concat.apply([], data), accessor);
  if (yDomain && yDomain.length === 1) {
    extent[0] = yDomain[0];
    return extent;
  }
  return extent;
}

// Given an array of arrays, return an array with the min value for each element in the array.
// [ [1,6,8], [2,4,9], [3,5,7] ] => [1,4,7]
export function minFromArray(array) {
  return array[0].map((_, index) => d3.min(array.map((row) => row[index])));
}

// Given an array of arrays, return an array with the max value for each element in the array.
// [ [1,6,8], [2,4,9], [3,5,7] ] => [3,6,9]
export function maxFromArray(array) {
  return array[0].map((_, index) => d3.max(array.map((row) => row[index])));
}

export function getMaxDataSetLength(data) {
  if (Array.isArray(data[0])) {
    return d3.max(data, (dataSet) => dataSet.length);
  }
  return data.length;
}

// A function that finds objects in an array or nested arrays
// that match the given key/value
export function findObjects(array, key, value) {
  if (Array.isArray(array[0])) {
    // eslint-disable-next-line prefer-spread
    array = [].concat.apply([], array);
  }
  return array.filter((obj) => obj[key].toString() === value.toString());
}

// Returns true if `num` is +/- `range` of `target`
export function isInRange(num, target, range) {
  const result = num >= Math.max(0, target - range) && num <= target + range;
  return result;
}

// Returns a either a defined shape, or based on the series if 'auto'
export function getSymbol(shape, series = 0) {
  const symbolNames = 'circle cross diamond square star triangle wye'.split(/ /);
  if (shape === 'auto') {
    return series % symbolNames.length;
  }
  return symbolNames.indexOf(shape) || 0;
}
