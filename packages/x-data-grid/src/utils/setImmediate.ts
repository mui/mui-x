let exportedSetImmediate: (fn: Function) => void;

if (typeof MessageChannel !== 'undefined') {
  exportedSetImmediate = (fn) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = fn as any;
    channel.port2.postMessage(null);
  };
} else {
  exportedSetImmediate = (fn) => {
    setTimeout(fn, 0);
  };
}

export const setImmediate = exportedSetImmediate;
