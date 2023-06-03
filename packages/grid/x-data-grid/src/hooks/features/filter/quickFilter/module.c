#include <stddef.h>
#include <stdint.h>
#include <stdbool.h>
#include <limits.h>

extern void log_string(const char *string, int string_length);
extern void log_number(int value);

#define OPERATOR_OR  1
#define OPERATOR_AND 2


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
  for (w = (void *)current; !HASZERO(*w) && !HASZERO(*w ^ k); w++);
  current = (void *)w;

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


__attribute__((used)) size_t run(
  uint8_t  *input,  int input_length,
  uint32_t *output, int output_length,
  uint8_t  *search, int search_length,
  int operator
) {
  uint8_t *input_end = input + input_length;

  uint32_t current_row_index = -1;
  uint32_t row_text_length = -1;
  uint8_t *row_text = NULL;

  uint8_t *current = input;
  uint32_t *current_output = output;

  uint32_t total_matches = 0;

  while (current < input_end) {
    current_row_index += 1;
    row_text_length = *((uint32_t*)current);
    current += 4;
    row_text = current;
    current += row_text_length;

    uint8_t *current_search = search;
    for (int i = 0; i < search_length; i++) {
      uint32_t search_term_length = *((uint32_t*)current_search);
      current_search += 4;
      uint8_t *search_term = current_search;
      current_search += search_term_length;

      bool did_match = string_contains(
        (const char *)row_text, row_text_length,
        (const char *)search_term, search_term_length
      );

      if (did_match && operator == OPERATOR_OR) {
        total_matches += 1;
        *current_output++ = current_row_index;
        break;
      }
      if (!did_match && operator == OPERATOR_AND) {
        goto row_loop;
      }
    }
    if (operator == OPERATOR_AND) {
      total_matches += 1;
      *current_output++ = current_row_index;
    }
    row_loop:;
  }

  return total_matches;
}

int main() {}
