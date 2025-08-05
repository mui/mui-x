import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { srLatn } from './srLatn';

function toCyrillic(value: string): string {
  const map: Record<string, string> = {
    dj: 'ђ',
    Dj: 'Ђ',
    Dž: 'Џ',
    dž: 'џ',
    LJ: 'Љ',
    Lj: 'Љ',
    lj: 'љ',
    NJ: 'Њ',
    Nj: 'Њ',
    nj: 'њ',
    A: 'А',
    a: 'а',
    B: 'Б',
    b: 'б',
    V: 'В',
    v: 'в',
    G: 'Г',
    g: 'г',
    D: 'Д',
    d: 'д',
    Đ: 'Ђ',
    đ: 'ђ',
    E: 'Е',
    // eslint-disable-next-line id-denylist
    e: 'е',
    Ž: 'Ж',
    ž: 'ж',
    Z: 'З',
    z: 'з',
    I: 'И',
    i: 'и',
    J: 'Ј',
    j: 'ј',
    K: 'К',
    k: 'к',
    L: 'Л',
    l: 'л',
    M: 'М',
    m: 'м',
    N: 'Н',
    n: 'н',
    O: 'О',
    o: 'о',
    P: 'П',
    p: 'п',
    R: 'Р',
    r: 'р',
    S: 'С',
    s: 'с',
    T: 'Т',
    t: 'т',
    Ć: 'Ћ',
    ć: 'ћ',
    U: 'У',
    u: 'у',
    F: 'Ф',
    f: 'ф',
    H: 'Х',
    h: 'х',
    C: 'Ц',
    c: 'ц',
    Č: 'Ч',
    č: 'ч',
    Š: 'Ш',
    š: 'ш',
    Y: 'Ј',
    y: 'ј',
    X: 'Кс',
    x: 'кс',
    W: 'В',
    w: 'в',
    Q: 'К',
    q: 'к',
  };
  return value
    .replace(/dž|Dž|DŽ|nj|Nj|NJ|lj|Lj|LJ/g, (m) => map[m])
    .split('')
    .map((ch) => map[ch] || ch)
    .join('');
}

function convert(obj: any): any {
  if (typeof obj === 'string') {
    return toCyrillic(obj);
  }
  if (typeof obj === 'function') {
    return (...args: any[]) => {
      const result = obj(...args);
      return typeof result === 'string' ? toCyrillic(result) : result;
    };
  }
  if (Array.isArray(obj)) {
    return obj.map(convert);
  }
  if (obj && typeof obj === 'object') {
    const out: Record<string, any> = {};
    Object.keys(obj).forEach((key) => {
      out[key] = convert(obj[key]);
    });
    return out;
  }
  return obj;
}

export const srRS: PickersLocaleText = convert(srLatn) as PickersLocaleText;
