/**
 * Cubic equation solver. Only returns real root between 0 and 1, which is the only case we care about for curve evaluation.
 * From https://www.particleincell.com/2013/cubic-line-intersection/
 */
export function cubicRoots(P: [number, number, number, number]) {
  const a = P[0];
  const b = P[1];
  const c = P[2];
  const d = P[3];

  if (a === 0) {
    if (b === 0) {
      if (c === 0) {
        return []; // constant case
      }
      return [-d / c].filter((r) => r >= 0 && r <= 1); // linear case
    }

    // quadratic case
    const discriminant = c * c - 4 * b * d;
    if (discriminant < 0) {
      return [];
    }
    const sqrtDisc = Math.sqrt(discriminant);
    return [(-c + sqrtDisc) / (2 * b), (-c - sqrtDisc) / (2 * b)].filter((r) => r >= 0 && r <= 1);
  }

  // cubic case

  const A = b / a;
  const B = c / a;
  const C = d / a;

  const Q = (3 * B - Math.pow(A, 2)) / 9;
  const R = (9 * A * B - 27 * C - 2 * Math.pow(A, 3)) / 54;
  const D = Math.pow(Q, 3) + Math.pow(R, 2); // polynomial discriminant

  const result: number[] = [];

  if (D >= 0) // complex or duplicate roots
  {
    const S = Math.sign(R + Math.sqrt(D)) * Math.pow(Math.abs(R + Math.sqrt(D)), 1 / 3);
    const T = Math.sign(R - Math.sqrt(D)) * Math.pow(Math.abs(R - Math.sqrt(D)), 1 / 3);

    result.push(-A / 3 + (S + T)); // real root

    if (S - T !== 0) {
      return result.filter((r) => r >= 0 && r <= 1);
    }

    result.push(-A / 3 - (S + T) / 2); // real part of complex root
    result.push(-A / 3 - (S + T) / 2); // real part of complex root
    return result.filter((r) => r >= 0 && r <= 1);
  }

  const th = Math.acos(R / Math.sqrt(-Math.pow(Q, 3)));

  result.push(2 * Math.sqrt(-Q) * Math.cos(th / 3) - A / 3);
  result.push(2 * Math.sqrt(-Q) * Math.cos((th + 2 * Math.PI) / 3) - A / 3);
  result.push(2 * Math.sqrt(-Q) * Math.cos((th + 4 * Math.PI) / 3) - A / 3);

  return result.filter((r) => r >= 0 && r <= 1);
}
