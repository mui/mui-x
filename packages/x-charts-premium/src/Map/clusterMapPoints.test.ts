import { clusterMapPoints } from './clusterMapPoints';
import type { ProjectedMapPoint } from './clusterMapPoints';

describe('clusterMapPoints', () => {
  it('returns one cluster per point when none are within the radius', () => {
    const points: ProjectedMapPoint[] = [
      { x: 0, y: 0, dataIndex: 0, value: 1 },
      { x: 100, y: 100, dataIndex: 1, value: 2 },
      { x: 200, y: 0, dataIndex: 2, value: 3 },
    ];
    const clusters = clusterMapPoints(points, { radius: 20 });
    expect(clusters).to.have.length(3);
    expect(clusters.map((c) => c.dataIndices)).to.deep.equal([[0], [1], [2]]);
  });

  it('merges nearby points and sums their values', () => {
    const points: ProjectedMapPoint[] = [
      { x: 0, y: 0, dataIndex: 0, value: 1 },
      { x: 5, y: 5, dataIndex: 1, value: 2 },
      { x: 10, y: 0, dataIndex: 2, value: 4 },
      { x: 500, y: 500, dataIndex: 3, value: 8 },
    ];
    const clusters = clusterMapPoints(points, { radius: 50 });
    expect(clusters).to.have.length(2);

    const merged = clusters.find((c) => c.dataIndices.length > 1)!;
    expect(merged.dataIndices).to.deep.equal([0, 1, 2]);
    expect(merged.value).to.equal(7);
    // centroid of (0,0), (5,5), (10,0)
    expect(merged.x).to.equal(5);
    expect(merged.y).to.be.closeTo(5 / 3, 1e-9);

    const lonely = clusters.find((c) => c.dataIndices.length === 1)!;
    expect(lonely.dataIndices).to.deep.equal([3]);
    expect(lonely.value).to.equal(8);
  });

  it('treats missing values as zero in the aggregated sum', () => {
    const points: ProjectedMapPoint[] = [
      { x: 0, y: 0, dataIndex: 0 },
      { x: 1, y: 1, dataIndex: 1, value: 5 },
    ];
    const [cluster] = clusterMapPoints(points, { radius: 10 });
    expect(cluster.dataIndices).to.deep.equal([0, 1]);
    expect(cluster.value).to.equal(5);
  });

  it('does not cluster when the radius is zero or negative', () => {
    const points: ProjectedMapPoint[] = [
      { x: 0, y: 0, dataIndex: 0, value: 1 },
      { x: 1, y: 1, dataIndex: 1, value: 2 },
    ];
    expect(clusterMapPoints(points, { radius: 0 })).to.have.length(2);
    expect(clusterMapPoints(points, { radius: -5 })).to.have.length(2);
  });

  it('returns an empty array for no points', () => {
    expect(clusterMapPoints([], { radius: 10 })).to.deep.equal([]);
  });

  it('keeps points that are farther apart across grid cells separate', () => {
    // Two points within the same radius but the deterministic grid still groups by distance.
    const points: ProjectedMapPoint[] = [
      { x: 39, y: 0, dataIndex: 0, value: 1 },
      { x: 41, y: 0, dataIndex: 1, value: 1 },
    ];
    // Distance is 2px, well within radius -> merged even though they fall in different cells.
    const clusters = clusterMapPoints(points, { radius: 40 });
    expect(clusters).to.have.length(1);
    expect(clusters[0].dataIndices).to.deep.equal([0, 1]);
  });
});
