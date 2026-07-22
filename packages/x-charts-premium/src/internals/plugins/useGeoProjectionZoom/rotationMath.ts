const DEG = Math.PI / 180;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Rotate a `[longitude, latitude]` coordinate around the projection's center axis (the x-axis
 * pointing to `[0, 0]`) by `gamma` degrees.
 *
 * This is the roll component of a d3 rotation `[lambda, phi, gamma]`, isolated so it can be undone
 * on the target coordinate before solving the longitude/latitude rotation. A d3 rotation composes as
 * `rollGamma ∘ geoRotation([lambda, phi])`, so pre-applying `rollGamma(-gamma)` to the target keeps
 * the roll fixed while the yaw/pitch solver stays a two-angle problem.
 */
function rollCoordinate(coord: [number, number], gamma: number): [number, number] {
  if (!gamma) {
    return coord;
  }
  const g = gamma * DEG;
  const cosG = Math.cos(g);
  const sinG = Math.sin(g);
  const lon = coord[0] * DEG;
  const lat = coord[1] * DEG;
  const x = Math.cos(lon) * Math.cos(lat);
  const y = Math.sin(lon) * Math.cos(lat);
  const z = Math.sin(lat);
  // Rotation about the x-axis by `g`.
  const yRolled = y * cosG - z * sinG;
  const zRolled = y * sinG + z * cosG;
  return [Math.atan2(yRolled, x) / DEG, Math.asin(clamp(zRolled, -1, 1)) / DEG];
}

const cross = (
  a: [number, number, number],
  b: [number, number, number],
): [number, number, number] => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

/**
 * Unit vector on the sphere for a `[longitude, latitude]` coordinate (degrees).
 */
function unitVector([lonDeg, latDeg]: [number, number]): [number, number, number] {
  const lon = lonDeg * DEG;
  const lat = latDeg * DEG;
  const cosLat = Math.cos(lat);
  return [Math.cos(lon) * cosLat, Math.sin(lon) * cosLat, Math.sin(lat)];
}

/**
 * Rotate vector `v` around the unit axis `k` by `angle` radians (Rodrigues' rotation formula).
 */
function rotateAroundAxis(
  k: [number, number, number],
  angle: number,
  v: [number, number, number],
): [number, number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dot = (k[0] * v[0] + k[1] * v[1] + k[2] * v[2]) * (1 - cos);
  const kv = cross(k, v);
  return [
    v[0] * cos + kv[0] * sin + k[0] * dot,
    v[1] * cos + kv[1] * sin + k[1] * dot,
    v[2] * cos + kv[2] * sin + k[2] * dot,
  ];
}

/**
 * Given the current d3 `rotate` `[lambda, phi, gamma]` (degrees), returns the new
 * `[longitude, latitude, roll]` (the view `center` plus `roll`) that drags `geoPoint` onto the
 * identity-frame screen coordinate `q` using the shortest-arc rotation composed with the current
 * orientation. Because the delta is the minimal rotation moving the grabbed point to the target, the
 * roll only changes as much as strictly required.
 */
export function getMinimalRollRotation(
  rotate: [number, number, number],
  geoPoint: [number, number],
  targetGeoPoint: [number, number],
): [number, number, number] {
  const l = rotate[0] * DEG;
  const p = rotate[1] * DEG;
  const g = (rotate[2] ?? 0) * DEG;
  const cl = Math.cos(l);
  const sl = Math.sin(l);
  const cp = Math.cos(p);
  const sp = Math.sin(p);
  const cg = Math.cos(g);
  const sg = Math.sin(g);

  // Columns of the current rotation matrix `M = Rx(g)·Ry(-p)·Rz(l)`, which is exactly
  // d3's `geoRotation([lambda, phi, gamma])` expressed on cartesian unit vectors.
  const col0: [number, number, number] = [cp * cl, cg * sl - sg * sp * cl, sg * sl + cg * sp * cl];
  const col1: [number, number, number] = [-cp * sl, cg * cl + sg * sp * sl, sg * cl - cg * sp * sl];
  const col2: [number, number, number] = [-sp, -sg * cp, cg * cp];

  const point = unitVector(geoPoint);
  // Where the grabbed point currently sits in the identity (screen) frame: `M · point`.
  const current: [number, number, number] = [
    col0[0] * point[0] + col1[0] * point[1] + col2[0] * point[2],
    col0[1] * point[0] + col1[1] * point[1] + col2[1] * point[2],
    col0[2] * point[0] + col1[2] * point[1] + col2[2] * point[2],
  ];
  const target = unitVector(targetGeoPoint);

  // Shortest-arc rotation taking `current` onto `target`, applied to `M` column by column
  // (`M_new = delta · M`).
  const axis = cross(current, target);
  const s = Math.hypot(axis[0], axis[1], axis[2]);

  let n0 = col0;
  let n1 = col1;
  let n2 = col2;
  if (s > 1e-12) {
    const dot = clamp(
      current[0] * target[0] + current[1] * target[1] + current[2] * target[2],
      -1,
      1,
    );
    const angle = Math.atan2(s, dot);
    const k: [number, number, number] = [axis[0] / s, axis[1] / s, axis[2] / s];
    n0 = rotateAroundAxis(k, angle, col0);
    n1 = rotateAroundAxis(k, angle, col1);
    n2 = rotateAroundAxis(k, angle, col2);
  }

  // Decompose `M_new = Rx(g')·Ry(-p')·Rz(l')` back into d3 angles.
  const phi = Math.asin(clamp(-n2[0], -1, 1));
  const lambda = Math.atan2(-n1[0], n0[0]);
  const gamma = Math.atan2(-n2[1], n2[2]);

  // `rotate = [-center[0], -center[1], roll]`, so invert the sign for the view center.
  return [-lambda / DEG, -phi / DEG, gamma / DEG];
}

/**
 * Given the current d3 `rotate` `[lambda, phi, gamma]` (degrees), returns the
 * `[longitude, latitude, roll]` that drags `geoPoint` onto the identity-frame screen coordinate
 * `targetGeoPoint` while keeping the roll (`gamma`) unchanged: only the longitude and latitude move.
 * When the target is out of reach for a roll-preserving rotation, the closest reachable orientation
 * is returned.
 */
export function getNoRollRotation(
  rotate: [number, number, number],
  geoPoint: [number, number],
  targetGeoPoint: [number, number],
): [number, number, number] {
  const roll = rotate[2] ?? 0;

  // A d3 rotation composes as `rollGamma ∘ geoRotation([lambda, phi])`, so undo the roll on the
  // target: what remains is a plain (roll-free) `Ry(-phi)·Rz(lambda)` mapping `geoPoint` onto it.
  const [px, py, pz] = unitVector(geoPoint);
  const [tx, ty, tz] = unitVector(rollCoordinate(targetGeoPoint, -roll));

  const lambdaOld = rotate[0] * DEG;
  const phiOld = rotate[1] * DEG;

  // `Rz(lambda)` spins `geoPoint` on the circle of radius `r` in the xy-plane, keeping its
  // z-component; `Ry(-phi)` then tilts it. So after `Rz` the y-component (`uy`) must already equal
  // the target's, and the xy-radius bounds how far the latitude can reach.
  const r = Math.hypot(px, py);
  if (r < 1e-12) {
    // `geoPoint` sits on a pole where `Rz(lambda)` is a no-op: keep the current longitude and only
    // solve the tilt.
    const phi = Math.atan2(tz, tx) - Math.atan2(pz, 0);
    return [-lambdaOld / DEG, -phi / DEG, roll];
  }

  // `clamp` keeps the nearest reachable point when the target latitude is out of range (`|ty| > r`).
  const uy = clamp(ty, -r, r);
  const uxMagnitude = Math.sqrt(Math.max(0, r * r - uy * uy));

  const solveFor = (ux: number) => ({
    // `Rz(lambda)` rotates `(px, py)` onto `(ux, uy)`.
    lambda: Math.atan2(uy, ux) - Math.atan2(py, px),
    // `Ry(-phi)` rotates `(ux, pz)` onto `(tx, tz)`.
    phi: Math.atan2(tz, tx) - Math.atan2(pz, ux),
  });

  // Two branches (`±ux`) solve the equation; pick the one closest to the current orientation so the
  // rotation stays continuous while dragging.
  const wrap = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));
  const distanceToCurrent = ({ lambda, phi }: { lambda: number; phi: number }) =>
    Math.abs(wrap(lambda - lambdaOld)) + Math.abs(wrap(phi - phiOld));

  const positive = solveFor(uxMagnitude);
  const negative = solveFor(-uxMagnitude);
  const best = distanceToCurrent(positive) <= distanceToCurrent(negative) ? positive : negative;

  return [-best.lambda / DEG, -best.phi / DEG, roll];
}

/**
 * Given the current d3 `rotate` `[lambda, phi, gamma]` (degrees), returns the
 * `[longitude, latitude, roll]` that pans `geoPoint` toward the identity-frame screen coordinate
 * `targetGeoPoint` along the longitude axis only: the latitude and roll are left untouched and just
 * the longitude is solved so `geoPoint` reaches the target's longitude.
 */
export function getLongitudeRotation(
  rotate: [number, number, number],
  geoPoint: [number, number],
  targetGeoPoint: [number, number],
): [number, number, number] {
  const roll = rotate[2] ?? 0;
  const latitude = -rotate[1]; // the fixed center latitude (degrees)

  // Undo the roll on the target, then keep the pitch locked to the current latitude and solve the
  // yaw so `geoPoint` lands on the target's longitude.
  const [tx, ty, tz] = unitVector(rollCoordinate(targetGeoPoint, -roll));
  const lonG = geoPoint[0] * DEG;
  const c1 = latitude * DEG;
  const c0 = lonG - Math.atan2(ty, tx * Math.cos(c1) - tz * Math.sin(c1));

  // Normalize the longitude into `[-180, 180]`.
  let longitude = (c0 / DEG) % 360;
  if (longitude > 180) {
    longitude -= 360;
  } else if (longitude < -180) {
    longitude += 360;
  }

  return [longitude, latitude, roll];
}
