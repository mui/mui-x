/**
 * A non-rectangular studio floor plan with a diagonal spine wall. Coordinates
 * are plain meters in screen space (x right, y down), not geographic — rendered
 * with a `geoIdentity` projection. `area` is the room area in m² (shown in the
 * tooltip); `center` is a hand-placed label anchor.
 */

const ROOMS = [
  {
    name: 'Balcony',
    area: 5,
    polygon: [
      [0.5, 2.5],
      [8.0, 1.0],
      [7.7, 2.3],
      [0.5, 3.6],
    ],
    center: [3.6, 2.4],
  },
  {
    name: 'Open-Concept Living',
    area: 13.5,
    polygon: [
      [0.5, 3.6],
      [7.7, 2.3],
      [6.38, 7.8],
      [0.5, 7.8],
    ],
    center: [3.4, 5.4],
  },
  {
    name: 'Kitchen',
    area: 9.6,
    polygon: [
      [0.5, 7.8],
      [6.38, 7.8],
      [4.5, 14.5],
      [0.5, 14.5],
    ],
    center: [2.6, 10.9],
  },
  {
    name: 'Bedroom',
    area: 17.9,
    polygon: [
      [7.7, 2.3],
      [15.5, 9.0],
      [15.5, 11.5],
      [5.29, 11.5],
    ],
    center: [10.0, 8.6],
  },
  {
    name: 'Bath',
    area: 5.4,
    polygon: [
      [5.29, 11.5],
      [10.5, 11.5],
      [10.5, 14.5],
      [4.5, 14.5],
    ],
    center: [7.5, 13.0],
  },
  {
    name: 'Walk-in Closet',
    area: 4,
    polygon: [
      [10.5, 11.5],
      [15.5, 11.5],
      [15.5, 14.5],
      [10.5, 14.5],
    ],
    center: [13.0, 13.0],
  },
];

const ring = (polygon) => [[...polygon, polygon[0]]];

export const floorPlan = {
  type: 'FeatureCollection',
  features: ROOMS.map((room) => ({
    type: 'Feature',
    properties: { name: room.name, area: room.area },
    geometry: { type: 'Polygon', coordinates: ring(room.polygon) },
  })),
};

export const floorData = ROOMS.map((room) => ({
  name: room.name,
  value: room.area,
}));

export const floorLabels = ROOMS.map((room) => ({
  name: room.name,
  center: room.center,
}));
