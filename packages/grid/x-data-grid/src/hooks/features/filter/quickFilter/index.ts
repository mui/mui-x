// @ts-ignore
import moduleURL from './module-simd128.wasm'

export type QuickFilterParams = ReturnType<typeof createBuffers>;

const PAGE_SIZE = 64 * 1024;
const MAX_SEARCH_LENGTH = 256;

export enum Operator {
  OR = 1,
  AND = 2,
}

const decoder = new TextDecoder()
const encoder = new TextEncoder()

let resolve: any;
export const ready = new Promise((r) => {
  resolve = r;
})

let instance: any

export async function setup() {
  const result = await WebAssembly.instantiateStreaming(fetch(moduleURL), {
    env: {
      log_string: (pointer: number, length: number) => {
        const memory = instance.memory as WebAssembly.Memory;
        const buffer = new Uint8Array(memory.buffer, pointer, length);
        const value = decoder.decode(buffer)
        console.log(value)
      },
      log_number: (value: number) => {
        console.log(value)
      },
    }
  })
  instance = result.instance.exports;
  resolve()
}

if (typeof window !== 'undefined') {
  setup()
}

function encodeString(value: string) {
  const buffer = encoder.encode('\0'.repeat(4) + value)
  const buffer32 = new Uint32Array(buffer.buffer, 0, 1)
  buffer32[0] = buffer.length - 4;
  return buffer
}

export function createBuffers(rows: string[][]) {
  const buffers = [] as Uint8Array[];
  let inputRealLength = 0

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const buffer = encodeString(row.join(' ').toLowerCase())
    buffers.push(buffer)
    inputRealLength += buffer.length
  }
  const inputTotalLength = inputRealLength + (8 - inputRealLength % 8); // 8-bytes padded

  const outputSlots = rows.length
  const outputTotalLength = outputSlots * 4;
  const searchLength = MAX_SEARCH_LENGTH;
  const totalLength = inputTotalLength + outputTotalLength + searchLength;

  const memory = instance.memory as WebAssembly.Memory;
  const memoryLength = memory.buffer.byteLength;
  if (memoryLength < totalLength) {
    const missingByteLength = totalLength - memoryLength;
    const missingPageLength = Math.ceil(missingByteLength / PAGE_SIZE)
    memory.grow(missingPageLength);
  }

  console.log({
    memory: memory.buffer.byteLength,
    inputRealLength,
    inputTotalLength,
    outputSlots,
  })
  const inputBuffer  = new Uint8Array(memory.buffer, 0, inputRealLength);
  const outputBuffer = new Uint32Array(memory.buffer, inputTotalLength, outputSlots);
  const searchBuffer = new Uint8Array(memory.buffer, inputTotalLength + outputTotalLength, searchLength);

  let offset = 0;
  for (let i = 0; i < buffers.length; i++) {
    const buffer = buffers[i];
    inputBuffer.set(buffer, offset)
    offset += buffer.length;
  }

  return {
    rows,
    input: inputBuffer,
    output: outputBuffer,
    search: searchBuffer,
  };
}

export function run(params: QuickFilterParams, search: string[], operator: Operator) {
  let searchOffset = 0
  search.forEach(term => {
    const buffer = encodeString(term.toLowerCase());
    params.search.set(buffer, searchOffset)
    searchOffset += buffer.length;
  })

  const totalMatches = instance.run(
    params.input.byteOffset,
    params.input.length,
    params.output.byteOffset,
    params.output.length,
    params.search.byteOffset,
    search.length,
    operator,
  );

  const indexes = params.output.slice(0, totalMatches)

  return indexes
}
