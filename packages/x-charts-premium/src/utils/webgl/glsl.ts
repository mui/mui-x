/**
 * GLSL snippet: signed distance field for a rounded box with per-corner radii.
 *
 * Convention:
 *   - `pos` and `halfSize` are in the same pixel-space coordinates.
 *   - `r` carries corner radii in CSS order: top-left, top-right, bottom-right, bottom-left.
 *   - For uniform-radius use cases pass `vec4(scalar)`.
 *
 * Screen-space conventions (after the y-flip in the vertex stage):
 *   pos.y < 0 -> top,   pos.y > 0 -> bottom
 *   pos.x < 0 -> left,  pos.x > 0 -> right
 *
 * Reference: Inigo Quilez, "Distance to a rounded box".
 */
// language=Glsl
export const ROUNDED_BOX_SDF_GLSL = /* glsl */ `
    float roundedBoxSDF(vec2 pos, vec2 halfSize, vec4 r) {
      float radius;
      if (pos.x < 0.0) {
        radius = pos.y < 0.0 ? r.x : r.w;
      } else {
        radius = pos.y < 0.0 ? r.y : r.z;
      }

      vec2 q = abs(pos) - halfSize + radius;
      return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
    }
  `;
