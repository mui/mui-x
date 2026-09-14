import type { GrowableBuffer } from './utils';
import { createGrowableBuffer } from './utils';

export interface InstancedAttribute {
  buffer: GrowableBuffer;
  location: number;
  size: number;
  glType: GLenum;
  normalized: boolean;
}

/**
 * Creates a per-instance vertex attribute backed by a fresh grow-only GPU buffer.
 *
 * The caller MUST have the owning VAO bound when calling this — the
 * vertexAttribPointer + vertexAttribDivisor calls register the binding into
 * that VAO and the program then references it on each draw.
 */
export function createInstancedAttribute(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
  size: number,
  glType: GLenum = gl.FLOAT,
  normalized: boolean = false,
): InstancedAttribute {
  const buffer = createGrowableBuffer(gl);
  return bindInstancedAttribute(gl, program, name, buffer, size, glType, normalized);
}

/**
 * Wires up a per-instance vertex attribute that reads from an existing GrowableBuffer.
 * Use this when the same buffer must back the same-named attribute in multiple
 * VAOs (e.g. two shader-program variants over the same data).
 *
 * The caller MUST have the owning VAO bound when calling this.
 *
 * If the attribute is missing from the program (typo, or optimized out by the
 * compiler), `getAttribLocation` returns -1. We skip the GL setup in that case to
 * avoid `INVALID_VALUE` errors from `enableVertexAttribArray(-1)` and warn in dev.
 */
export function bindInstancedAttribute(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
  buffer: GrowableBuffer,
  size: number,
  glType: GLenum = gl.FLOAT,
  normalized: boolean = false,
): InstancedAttribute {
  const location = gl.getAttribLocation(program, name);
  if (location === -1) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `WebGL attribute "${name}" not found in shader program (misspelled or optimized out).`,
      );
    }
    return { buffer, location, size, glType, normalized };
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, glType, normalized, 0, 0);
  gl.vertexAttribDivisor(location, 1);
  return { buffer, location, size, glType, normalized };
}
