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

char *string_char_position(const char *value, size_t value_length, int c) {
#define ALIGN      (sizeof(size_t))
#define ONES       ((size_t)-1 / UCHAR_MAX)
#define HIGHS      (ONES * (UCHAR_MAX / 2 + 1))
#define HASZERO(x) ((x) - ONES & ~(x) & HIGHS)

  const char *current = value;
  c = (unsigned char)c;

  if (c == 0)
    return (char *)value + value_length;

  typedef size_t __attribute__((__may_alias__)) word;
  const word *w;
  for (; (uintptr_t)current % ALIGN; current++) {
    if (current - value >= value_length)
      return 0;
  }

  if (*(unsigned char *)current == c)
    return (char *)current;

  size_t k = ONES * c;
  for (w = reinterpret_cast<const word *>(current); !HASZERO(*w) && !HASZERO(*w ^ k); w++);
  current = reinterpret_cast<const char *>(w);

  for (; current - value < value_length; current++) {
    if (*(unsigned char *)current == c) {
      return (char *)current;
    }
  }

  return 0;
}

bool string_contains(const char *haystack, size_t haystack_length,
                     const char *needle,   size_t needle_length) {
  size_t index = 0;
  const char *current = haystack;
  const char *end = haystack + haystack_length;

  if (needle_length == 0)
    return true;

  if (haystack_length == 0)
    return false;

  while (
    (haystack_length - (current - haystack) > needle_length) &&
    (current = string_char_position(
              current, haystack_length - (current - haystack), needle[0]))) {

    if (compare(current, needle, needle_length) == 0) {
      return true;
    }
    current += 1;
  }

  return false;
}
