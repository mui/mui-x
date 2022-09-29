interface DetectElementResize {
  addResizeListener: any;
  removeResizeListener: any;
}

export default function createDetectElementResize(
  nonce?: string,
  hostWindow?: Window,
): DetectElementResize;
