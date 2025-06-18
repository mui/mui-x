export type OperatingSystem =
  | 'iOS'
  | 'Android'
  | 'Windows'
  | 'Mac'
  | 'Linux'
  | 'BlackBerry'
  | 'Unix';

/**
 * This function detects the operating system of the user based on the user agent string.
 *
 * @returns  - The name of the operating system
 */
function getOS(): OperatingSystem | null {
  // @ts-expect-error, opera is not defined in types
  const uA = navigator.userAgent || navigator.vendor || window.opera;
  if (
    // @ts-expect-error, iOS detection
    (/iPad|iPhone|iPod/.test(uA) && !window.MSStream) ||
    (uA.includes('Mac') && 'ontouchend' in document)
  ) {
    return 'iOS';
  }

  const os = ['Windows', 'Android', 'Unix', 'Mac', 'Linux', 'BlackBerry'];
  for (let i = 0; i < os.length; i += 1) {
    if (new RegExp(os[i], 'i').test(uA)) {
      return os[i] as OperatingSystem;
    }
  }
  return null;
}

export function isOS(checkOS: OperatingSystem[]) {
  const os = getOS();
  if (!os) {
    return false;
  }
  return checkOS.includes(os);
}
