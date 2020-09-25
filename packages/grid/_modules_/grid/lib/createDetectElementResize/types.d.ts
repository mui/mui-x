interface DetectElementResize {
  addResizeListener: any;
  removeResizeListener: any;
}

export default function createDetectElementResize(nonce: string, win: Window): DetectElementResize;
