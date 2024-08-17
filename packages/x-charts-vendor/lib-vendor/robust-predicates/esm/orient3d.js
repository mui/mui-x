"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.orient3d = orient3d;
exports.orient3dfast = orient3dfast;
var _util = require("./util.js");
const o3derrboundA = (7 + 56 * _util.epsilon) * _util.epsilon;
const o3derrboundB = (3 + 28 * _util.epsilon) * _util.epsilon;
const o3derrboundC = (26 + 288 * _util.epsilon) * _util.epsilon * _util.epsilon;
const bc = (0, _util.vec)(4);
const ca = (0, _util.vec)(4);
const ab = (0, _util.vec)(4);
const at_b = (0, _util.vec)(4);
const at_c = (0, _util.vec)(4);
const bt_c = (0, _util.vec)(4);
const bt_a = (0, _util.vec)(4);
const ct_a = (0, _util.vec)(4);
const ct_b = (0, _util.vec)(4);
const bct = (0, _util.vec)(8);
const cat = (0, _util.vec)(8);
const abt = (0, _util.vec)(8);
const u = (0, _util.vec)(4);
const _8 = (0, _util.vec)(8);
const _8b = (0, _util.vec)(8);
const _16 = (0, _util.vec)(8);
const _12 = (0, _util.vec)(12);
let fin = (0, _util.vec)(192);
let fin2 = (0, _util.vec)(192);
function finadd(finlen, alen, a) {
  finlen = (0, _util.sum)(finlen, fin, alen, a, fin2);
  const tmp = fin;
  fin = fin2;
  fin2 = tmp;
  return finlen;
}
function tailinit(xtail, ytail, ax, ay, bx, by, a, b) {
  let bvirt, c, ahi, alo, bhi, blo, _i, _j, _k, _0, s1, s0, t1, t0, u3, negate;
  if (xtail === 0) {
    if (ytail === 0) {
      a[0] = 0;
      b[0] = 0;
      return 1;
    } else {
      negate = -ytail;
      s1 = negate * ax;
      c = _util.splitter * negate;
      ahi = c - (c - negate);
      alo = negate - ahi;
      c = _util.splitter * ax;
      bhi = c - (c - ax);
      blo = ax - bhi;
      a[0] = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      a[1] = s1;
      s1 = ytail * bx;
      c = _util.splitter * ytail;
      ahi = c - (c - ytail);
      alo = ytail - ahi;
      c = _util.splitter * bx;
      bhi = c - (c - bx);
      blo = bx - bhi;
      b[0] = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      b[1] = s1;
      return 2;
    }
  } else {
    if (ytail === 0) {
      s1 = xtail * ay;
      c = _util.splitter * xtail;
      ahi = c - (c - xtail);
      alo = xtail - ahi;
      c = _util.splitter * ay;
      bhi = c - (c - ay);
      blo = ay - bhi;
      a[0] = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      a[1] = s1;
      negate = -xtail;
      s1 = negate * by;
      c = _util.splitter * negate;
      ahi = c - (c - negate);
      alo = negate - ahi;
      c = _util.splitter * by;
      bhi = c - (c - by);
      blo = by - bhi;
      b[0] = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      b[1] = s1;
      return 2;
    } else {
      s1 = xtail * ay;
      c = _util.splitter * xtail;
      ahi = c - (c - xtail);
      alo = xtail - ahi;
      c = _util.splitter * ay;
      bhi = c - (c - ay);
      blo = ay - bhi;
      s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      t1 = ytail * ax;
      c = _util.splitter * ytail;
      ahi = c - (c - ytail);
      alo = ytail - ahi;
      c = _util.splitter * ax;
      bhi = c - (c - ax);
      blo = ax - bhi;
      t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
      _i = s0 - t0;
      bvirt = s0 - _i;
      a[0] = s0 - (_i + bvirt) + (bvirt - t0);
      _j = s1 + _i;
      bvirt = _j - s1;
      _0 = s1 - (_j - bvirt) + (_i - bvirt);
      _i = _0 - t1;
      bvirt = _0 - _i;
      a[1] = _0 - (_i + bvirt) + (bvirt - t1);
      u3 = _j + _i;
      bvirt = u3 - _j;
      a[2] = _j - (u3 - bvirt) + (_i - bvirt);
      a[3] = u3;
      s1 = ytail * bx;
      c = _util.splitter * ytail;
      ahi = c - (c - ytail);
      alo = ytail - ahi;
      c = _util.splitter * bx;
      bhi = c - (c - bx);
      blo = bx - bhi;
      s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
      t1 = xtail * by;
      c = _util.splitter * xtail;
      ahi = c - (c - xtail);
      alo = xtail - ahi;
      c = _util.splitter * by;
      bhi = c - (c - by);
      blo = by - bhi;
      t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
      _i = s0 - t0;
      bvirt = s0 - _i;
      b[0] = s0 - (_i + bvirt) + (bvirt - t0);
      _j = s1 + _i;
      bvirt = _j - s1;
      _0 = s1 - (_j - bvirt) + (_i - bvirt);
      _i = _0 - t1;
      bvirt = _0 - _i;
      b[1] = _0 - (_i + bvirt) + (bvirt - t1);
      u3 = _j + _i;
      bvirt = u3 - _j;
      b[2] = _j - (u3 - bvirt) + (_i - bvirt);
      b[3] = u3;
      return 4;
    }
  }
}
function tailadd(finlen, a, b, k, z) {
  let bvirt, c, ahi, alo, bhi, blo, _i, _j, _k, _0, s1, s0, u3;
  s1 = a * b;
  c = _util.splitter * a;
  ahi = c - (c - a);
  alo = a - ahi;
  c = _util.splitter * b;
  bhi = c - (c - b);
  blo = b - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  c = _util.splitter * k;
  bhi = c - (c - k);
  blo = k - bhi;
  _i = s0 * k;
  c = _util.splitter * s0;
  ahi = c - (c - s0);
  alo = s0 - ahi;
  u[0] = alo * blo - (_i - ahi * bhi - alo * bhi - ahi * blo);
  _j = s1 * k;
  c = _util.splitter * s1;
  ahi = c - (c - s1);
  alo = s1 - ahi;
  _0 = alo * blo - (_j - ahi * bhi - alo * bhi - ahi * blo);
  _k = _i + _0;
  bvirt = _k - _i;
  u[1] = _i - (_k - bvirt) + (_0 - bvirt);
  u3 = _j + _k;
  u[2] = _k - (u3 - _j);
  u[3] = u3;
  finlen = finadd(finlen, 4, u);
  if (z !== 0) {
    c = _util.splitter * z;
    bhi = c - (c - z);
    blo = z - bhi;
    _i = s0 * z;
    c = _util.splitter * s0;
    ahi = c - (c - s0);
    alo = s0 - ahi;
    u[0] = alo * blo - (_i - ahi * bhi - alo * bhi - ahi * blo);
    _j = s1 * z;
    c = _util.splitter * s1;
    ahi = c - (c - s1);
    alo = s1 - ahi;
    _0 = alo * blo - (_j - ahi * bhi - alo * bhi - ahi * blo);
    _k = _i + _0;
    bvirt = _k - _i;
    u[1] = _i - (_k - bvirt) + (_0 - bvirt);
    u3 = _j + _k;
    u[2] = _k - (u3 - _j);
    u[3] = u3;
    finlen = finadd(finlen, 4, u);
  }
  return finlen;
}
function orient3dadapt(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, permanent) {
  let finlen;
  let adxtail, bdxtail, cdxtail;
  let adytail, bdytail, cdytail;
  let adztail, bdztail, cdztail;
  let bvirt, c, ahi, alo, bhi, blo, _i, _j, _k, _0, s1, s0, t1, t0, u3;
  const adx = ax - dx;
  const bdx = bx - dx;
  const cdx = cx - dx;
  const ady = ay - dy;
  const bdy = by - dy;
  const cdy = cy - dy;
  const adz = az - dz;
  const bdz = bz - dz;
  const cdz = cz - dz;
  s1 = bdx * cdy;
  c = _util.splitter * bdx;
  ahi = c - (c - bdx);
  alo = bdx - ahi;
  c = _util.splitter * cdy;
  bhi = c - (c - cdy);
  blo = cdy - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = cdx * bdy;
  c = _util.splitter * cdx;
  ahi = c - (c - cdx);
  alo = cdx - ahi;
  c = _util.splitter * bdy;
  bhi = c - (c - bdy);
  blo = bdy - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  bc[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  bc[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  bc[2] = _j - (u3 - bvirt) + (_i - bvirt);
  bc[3] = u3;
  s1 = cdx * ady;
  c = _util.splitter * cdx;
  ahi = c - (c - cdx);
  alo = cdx - ahi;
  c = _util.splitter * ady;
  bhi = c - (c - ady);
  blo = ady - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = adx * cdy;
  c = _util.splitter * adx;
  ahi = c - (c - adx);
  alo = adx - ahi;
  c = _util.splitter * cdy;
  bhi = c - (c - cdy);
  blo = cdy - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  ca[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  ca[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  ca[2] = _j - (u3 - bvirt) + (_i - bvirt);
  ca[3] = u3;
  s1 = adx * bdy;
  c = _util.splitter * adx;
  ahi = c - (c - adx);
  alo = adx - ahi;
  c = _util.splitter * bdy;
  bhi = c - (c - bdy);
  blo = bdy - bhi;
  s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
  t1 = bdx * ady;
  c = _util.splitter * bdx;
  ahi = c - (c - bdx);
  alo = bdx - ahi;
  c = _util.splitter * ady;
  bhi = c - (c - ady);
  blo = ady - bhi;
  t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
  _i = s0 - t0;
  bvirt = s0 - _i;
  ab[0] = s0 - (_i + bvirt) + (bvirt - t0);
  _j = s1 + _i;
  bvirt = _j - s1;
  _0 = s1 - (_j - bvirt) + (_i - bvirt);
  _i = _0 - t1;
  bvirt = _0 - _i;
  ab[1] = _0 - (_i + bvirt) + (bvirt - t1);
  u3 = _j + _i;
  bvirt = u3 - _j;
  ab[2] = _j - (u3 - bvirt) + (_i - bvirt);
  ab[3] = u3;
  finlen = (0, _util.sum)((0, _util.sum)((0, _util.scale)(4, bc, adz, _8), _8, (0, _util.scale)(4, ca, bdz, _8b), _8b, _16), _16, (0, _util.scale)(4, ab, cdz, _8), _8, fin);
  let det = (0, _util.estimate)(finlen, fin);
  let errbound = o3derrboundB * permanent;
  if (det >= errbound || -det >= errbound) {
    return det;
  }
  bvirt = ax - adx;
  adxtail = ax - (adx + bvirt) + (bvirt - dx);
  bvirt = bx - bdx;
  bdxtail = bx - (bdx + bvirt) + (bvirt - dx);
  bvirt = cx - cdx;
  cdxtail = cx - (cdx + bvirt) + (bvirt - dx);
  bvirt = ay - ady;
  adytail = ay - (ady + bvirt) + (bvirt - dy);
  bvirt = by - bdy;
  bdytail = by - (bdy + bvirt) + (bvirt - dy);
  bvirt = cy - cdy;
  cdytail = cy - (cdy + bvirt) + (bvirt - dy);
  bvirt = az - adz;
  adztail = az - (adz + bvirt) + (bvirt - dz);
  bvirt = bz - bdz;
  bdztail = bz - (bdz + bvirt) + (bvirt - dz);
  bvirt = cz - cdz;
  cdztail = cz - (cdz + bvirt) + (bvirt - dz);
  if (adxtail === 0 && bdxtail === 0 && cdxtail === 0 && adytail === 0 && bdytail === 0 && cdytail === 0 && adztail === 0 && bdztail === 0 && cdztail === 0) {
    return det;
  }
  errbound = o3derrboundC * permanent + _util.resulterrbound * Math.abs(det);
  det += adz * (bdx * cdytail + cdy * bdxtail - (bdy * cdxtail + cdx * bdytail)) + adztail * (bdx * cdy - bdy * cdx) + bdz * (cdx * adytail + ady * cdxtail - (cdy * adxtail + adx * cdytail)) + bdztail * (cdx * ady - cdy * adx) + cdz * (adx * bdytail + bdy * adxtail - (ady * bdxtail + bdx * adytail)) + cdztail * (adx * bdy - ady * bdx);
  if (det >= errbound || -det >= errbound) {
    return det;
  }
  const at_len = tailinit(adxtail, adytail, bdx, bdy, cdx, cdy, at_b, at_c);
  const bt_len = tailinit(bdxtail, bdytail, cdx, cdy, adx, ady, bt_c, bt_a);
  const ct_len = tailinit(cdxtail, cdytail, adx, ady, bdx, bdy, ct_a, ct_b);
  const bctlen = (0, _util.sum)(bt_len, bt_c, ct_len, ct_b, bct);
  finlen = finadd(finlen, (0, _util.scale)(bctlen, bct, adz, _16), _16);
  const catlen = (0, _util.sum)(ct_len, ct_a, at_len, at_c, cat);
  finlen = finadd(finlen, (0, _util.scale)(catlen, cat, bdz, _16), _16);
  const abtlen = (0, _util.sum)(at_len, at_b, bt_len, bt_a, abt);
  finlen = finadd(finlen, (0, _util.scale)(abtlen, abt, cdz, _16), _16);
  if (adztail !== 0) {
    finlen = finadd(finlen, (0, _util.scale)(4, bc, adztail, _12), _12);
    finlen = finadd(finlen, (0, _util.scale)(bctlen, bct, adztail, _16), _16);
  }
  if (bdztail !== 0) {
    finlen = finadd(finlen, (0, _util.scale)(4, ca, bdztail, _12), _12);
    finlen = finadd(finlen, (0, _util.scale)(catlen, cat, bdztail, _16), _16);
  }
  if (cdztail !== 0) {
    finlen = finadd(finlen, (0, _util.scale)(4, ab, cdztail, _12), _12);
    finlen = finadd(finlen, (0, _util.scale)(abtlen, abt, cdztail, _16), _16);
  }
  if (adxtail !== 0) {
    if (bdytail !== 0) {
      finlen = tailadd(finlen, adxtail, bdytail, cdz, cdztail);
    }
    if (cdytail !== 0) {
      finlen = tailadd(finlen, -adxtail, cdytail, bdz, bdztail);
    }
  }
  if (bdxtail !== 0) {
    if (cdytail !== 0) {
      finlen = tailadd(finlen, bdxtail, cdytail, adz, adztail);
    }
    if (adytail !== 0) {
      finlen = tailadd(finlen, -bdxtail, adytail, cdz, cdztail);
    }
  }
  if (cdxtail !== 0) {
    if (adytail !== 0) {
      finlen = tailadd(finlen, cdxtail, adytail, bdz, bdztail);
    }
    if (bdytail !== 0) {
      finlen = tailadd(finlen, -cdxtail, bdytail, adz, adztail);
    }
  }
  return fin[finlen - 1];
}
function orient3d(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz) {
  const adx = ax - dx;
  const bdx = bx - dx;
  const cdx = cx - dx;
  const ady = ay - dy;
  const bdy = by - dy;
  const cdy = cy - dy;
  const adz = az - dz;
  const bdz = bz - dz;
  const cdz = cz - dz;
  const bdxcdy = bdx * cdy;
  const cdxbdy = cdx * bdy;
  const cdxady = cdx * ady;
  const adxcdy = adx * cdy;
  const adxbdy = adx * bdy;
  const bdxady = bdx * ady;
  const det = adz * (bdxcdy - cdxbdy) + bdz * (cdxady - adxcdy) + cdz * (adxbdy - bdxady);
  const permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz) + (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz) + (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz);
  const errbound = o3derrboundA * permanent;
  if (det > errbound || -det > errbound) {
    return det;
  }
  return orient3dadapt(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, permanent);
}
function orient3dfast(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz) {
  const adx = ax - dx;
  const bdx = bx - dx;
  const cdx = cx - dx;
  const ady = ay - dy;
  const bdy = by - dy;
  const cdy = cy - dy;
  const adz = az - dz;
  const bdz = bz - dz;
  const cdz = cz - dz;
  return adx * (bdy * cdz - bdz * cdy) + bdx * (cdy * adz - cdz * ady) + cdx * (ady * bdz - adz * bdy);
}