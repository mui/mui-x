import * as d3 from 'd3';

// If more than one set of data (nested arrays, or objects with an accessor),
// merge them to find extent across all sets.
// const mydata=[{data: [0,1,2]},{data: [3,4,5]}];
// console.log(getExtent(mydata, d => d.data.length));
// => [0,5]
export function getExtent(data, accessor = (d) => d) {
  // eslint-disable-next-line prefer-spread
  return d3.extent([].concat.apply([], data), accessor);
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
