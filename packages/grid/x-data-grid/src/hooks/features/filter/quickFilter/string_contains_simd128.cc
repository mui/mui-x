// Adapted from http://0x80.pl/articles/simd-strfind.html
#pragma once

#include <stddef.h>
#include <stdint.h>
#include <limits.h>
#include <wasm_simd128.h>

int compare(const void *s1, const void *s2, int len) {
  unsigned char *p = (unsigned char *)s1;
  unsigned char *q = (unsigned char *)s2;
  int status = 0;
  if (s1 == s2) {
    return status;
  }
  while (len > 0) {
    if (*p != *q) {
      status = (*p >*q) ? 1 : -1;
      break;
    }
    len--;
    p++;
    q++;
  }
  return status;
}

namespace bits {
  template <typename T>
  T clear_leftmost_set(const T value) {
    return value & (value - 1);
  }

  template <typename T>
  unsigned get_first_bit_set(const T value) {
    return __builtin_ctz(value);
  }

  template <>
  unsigned get_first_bit_set<uint64_t>(const uint64_t value) {
    return __builtin_ctzl(value);
  }
}

#define wasm_i8x16_set1(value) wasm_i8x16_make((value), (value), (value), (value), (value), (value), (value), (value), (value), (value), (value), (value), (value), (value), (value), (value))

bool string_contains(const char* s, size_t n, const char* needle, size_t k) {
  const __i8x16 first = wasm_i8x16_set1(needle[0]);
  const __i8x16 last  = wasm_i8x16_set1(needle[k - 1]);

  for (size_t i = 0; i < n; i += 16) {

    const __i8x16 block_first = wasm_v128_load(reinterpret_cast<const __i8x16*>(s + i));
    const __i8x16 block_last  = wasm_v128_load(reinterpret_cast<const __i8x16*>(s + i + k - 1));

    const __i8x16 eq_first = wasm_i8x16_eq(first, block_first);
    const __i8x16 eq_last  = wasm_i8x16_eq(last, block_last);

    uint32_t mask = wasm_i8x16_bitmask(wasm_v128_and(eq_first, eq_last));

    while (mask != 0) {
      const auto bitpos = bits::get_first_bit_set(mask);

      if (compare(s + i + bitpos + 1, needle + 1, k - 2) == 0) {
        return true;
      }

      mask = bits::clear_leftmost_set(mask);
    }
  }

  return false;
}
