import * as d3 from 'd3';

function getScale(scaleType) {
  switch (scaleType) {
    case 'log':
      return d3.scaleLog();
    case 'point':
      return d3.scalePoint();
    case 'pow':
      return d3.scalePow();
    case 'sqrt':
      return d3.scaleSqrt();
    case 'time':
      return d3.scaleTime();
    case 'utc':
      return d3.scaleUtc();
    default:
      return d3.scaleLinear();
  }
}

function useScale(scaleType, domain, range) {
  return getScale(scaleType).domain(domain).range(range);
}

export default useScale;
