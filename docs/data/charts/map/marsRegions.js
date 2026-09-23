/**
 * The 30 USGS Mars Chart (MC) quadrangles, tiling the whole planet.
 * Quadrangle names and lat/lon bounds are accurate (IAU/USGS); longitudes use
 * the [-180, 180] East convention so they project like any Earth GeoJSON.
 * `elevation` is an approximate mean elevation in km (MOLA datum), illustrating
 * the Martian dichotomy: low northern plains, high southern highlands.
 *
 * Polar quadrangles span every longitude, so they are split into two boxes that
 * share the same name — a single series item then colors both halves.
 */

const QUADRANGLES = [
  // North polar
  {
    name: 'Mare Boreum',
    elevation: -4,
    boxes: [
      [-180, 65, 0, 90],
      [0, 65, 180, 90],
    ],
  },
  // 30–65° N
  { name: 'Diacria', elevation: -3, boxes: [[-180, 30, -120, 65]] },
  { name: 'Arcadia', elevation: -3, boxes: [[-120, 30, -60, 65]] },
  { name: 'Mare Acidalium', elevation: -4, boxes: [[-60, 30, 0, 65]] },
  { name: 'Ismenius Lacus', elevation: -2, boxes: [[0, 30, 60, 65]] },
  { name: 'Casius', elevation: -3, boxes: [[60, 30, 120, 65]] },
  { name: 'Cebrenia', elevation: -3, boxes: [[120, 30, 180, 65]] },
  // 0–30° N
  { name: 'Amazonis', elevation: -3, boxes: [[-180, 0, -135, 30]] },
  { name: 'Tharsis', elevation: 6, boxes: [[-135, 0, -90, 30]] },
  { name: 'Lunae Palus', elevation: 2, boxes: [[-90, 0, -45, 30]] },
  { name: 'Oxia Palus', elevation: -1, boxes: [[-45, 0, 0, 30]] },
  { name: 'Arabia', elevation: 0, boxes: [[0, 0, 45, 30]] },
  { name: 'Syrtis Major', elevation: 1, boxes: [[45, 0, 90, 30]] },
  { name: 'Amenthes', elevation: -1, boxes: [[90, 0, 135, 30]] },
  { name: 'Elysium', elevation: 2, boxes: [[135, 0, 180, 30]] },
  // 0–30° S
  { name: 'Memnonia', elevation: 2, boxes: [[-180, -30, -135, 0]] },
  { name: 'Phoenicis Lacus', elevation: 5, boxes: [[-135, -30, -90, 0]] },
  { name: 'Coprates', elevation: 2, boxes: [[-90, -30, -45, 0]] },
  { name: 'Margaritifer Sinus', elevation: 0, boxes: [[-45, -30, 0, 0]] },
  { name: 'Sinus Sabaeus', elevation: 1, boxes: [[0, -30, 45, 0]] },
  { name: 'Iapygia', elevation: 2, boxes: [[45, -30, 90, 0]] },
  { name: 'Mare Tyrrhenum', elevation: 2, boxes: [[90, -30, 135, 0]] },
  { name: 'Aeolis', elevation: 0, boxes: [[135, -30, 180, 0]] },
  // 30–65° S
  { name: 'Phaethontis', elevation: 2, boxes: [[-180, -65, -120, -30]] },
  { name: 'Thaumasia', elevation: 4, boxes: [[-120, -65, -60, -30]] },
  { name: 'Argyre', elevation: 0, boxes: [[-60, -65, 0, -30]] },
  { name: 'Noachis', elevation: 2, boxes: [[0, -65, 60, -30]] },
  { name: 'Hellas', elevation: -5, boxes: [[60, -65, 120, -30]] },
  { name: 'Eridania', elevation: 2, boxes: [[120, -65, 180, -30]] },
  // South polar
  {
    name: 'Mare Australe',
    elevation: 2,
    boxes: [
      [-180, -90, 0, -65],
      [0, -90, 180, -65],
    ],
  },
];

// Sample a∈[a,b] every ~STEP degrees so geodesic interpolation stays close to
// the parallel/meridian (otherwise d3-geo bows the edges and pole caps vanish).
const STEP = 3;
const edge = (from, to) => {
  const steps = Math.max(1, Math.ceil(Math.abs(to - from) / STEP));
  return Array.from({ length: steps }, (_, i) => from + ((to - from) * i) / steps);
};

// Ring wound clockwise (lon/lat) so d3-geo treats the box interior as the
// filled region instead of its spherical complement.
const box = ([west, south, east, north]) => {
  const ring = [];
  edge(south, north).forEach((lat) => ring.push([west, lat]));
  edge(west, east).forEach((lon) => ring.push([lon, north]));
  edge(north, south).forEach((lat) => ring.push([east, lat]));
  edge(east, west).forEach((lon) => ring.push([lon, south]));
  ring.push([west, south]);
  return [ring];
};

export const marsRegions = {
  type: 'FeatureCollection',
  features: QUADRANGLES.flatMap((quad) =>
    quad.boxes.map((bbox) => ({
      type: 'Feature',
      properties: { name: quad.name, elevation: quad.elevation },
      geometry: { type: 'Polygon', coordinates: box(bbox) },
    })),
  ),
};

export const marsData = QUADRANGLES.map((quad) => ({
  name: quad.name,
  colorValue: quad.elevation,
}));

/**
 * Notable Mars features. `lon`/`lat` are planetocentric East coordinates
 * ([-180, 180]). `kind` distinguishes natural landmarks from mission sites.
 */

export const marsFeatures = [
  { name: 'Olympus Mons', lon: -133.8, lat: 18.65, kind: 'landmark' },
  { name: 'Ascraeus Mons', lon: -104.5, lat: 11.8, kind: 'landmark' },
  { name: 'Pavonis Mons', lon: -113, lat: 1.48, kind: 'landmark' },
  { name: 'Arsia Mons', lon: -121, lat: -8.35, kind: 'landmark' },
  { name: 'Elysium Mons', lon: 147, lat: 25, kind: 'landmark' },
  { name: 'Valles Marineris', lon: -59, lat: -14, kind: 'landmark' },
  { name: 'Hellas Planitia', lon: 70.5, lat: -42.4, kind: 'landmark' },
  { name: 'Argyre Planitia', lon: -44, lat: -49.7, kind: 'landmark' },
  { name: 'Viking 1', lon: -48, lat: 22.7, kind: 'mission' },
  { name: 'Perseverance', lon: 77.5, lat: 18.4, kind: 'mission' },
  { name: 'Curiosity', lon: 137.4, lat: -4.6, kind: 'mission' },
];
