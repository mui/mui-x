import { useMemo } from 'react';

function sumArrays(...arrays) {
  const n = arrays.reduce((max, xs) => Math.max(max, xs.length), 0);
  const result = Array.from({ length: n });
  return result.map((_, i) => arrays.map((xs) => xs[i] || 0).reduce((sum, x) => sum + x), 0);
}

// Return an array of arrays, each of whose elements are the sum
// of the preceding array's corresponding elements
// [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
// => [[1, 2, 3], [5, 7, 9], [12, 15, 18]]
function useStackedArrays(arrays) {
  return useMemo(() => {
    if (Array.isArray(arrays[0])) {
      return arrays.reduce((acc, curr) => {
        if (acc.length > 0) {
          acc.push(sumArrays(acc[acc.length - 1], curr));
        } else {
          acc.push(curr);
        }
        return acc;
      }, []);
    }
    return arrays;
  }, [arrays]);
}

export default useStackedArrays;
