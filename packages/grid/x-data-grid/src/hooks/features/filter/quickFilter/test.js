/*
 * test.js
 */

const n = (104 << 24) | (97 << 16) | (104 << 8 ) | 104

const char = 97
const comparator = (97 << 24) | (97 << 16) | (97 << 8) | (97 << 0)
const not = n => ~n >>> 0

log(n)
log(not(n))
log()

log(n)
log(comparator)
log(n & comparator)
log()

log(not(n))
log(not(comparator))
log((not(n) & not(comparator)) >>> 0)
log()

let ones = n & comparator
let zeroes = ((not(n) & not(comparator)) >>> 0)
log(ones)
log(zeroes)
log((ones | zeroes) >>> 0)


function log(n) {
  if (n !== undefined)
    console.log(n.toString(2).padStart(32, '0'))
  else
    console.log()
}
