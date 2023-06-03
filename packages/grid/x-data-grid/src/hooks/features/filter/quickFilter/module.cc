#include <stddef.h>
#include <stdint.h>
#include <limits.h>
#include <wasm_simd128.h>
#include "string_contains.cc"

extern "C" void log_string(const char *string, int string_length);
extern "C" void log_number(int value);
#define log(s) log_string(s, sizeof(s))

#define OPERATOR_OR  1
#define OPERATOR_AND 2


__attribute__((used)) extern "C" size_t run(
  uint8_t  *input,  int input_length,
  uint32_t *output, int output_length,
  uint8_t  *search, int search_length,
  int op
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

      if (did_match && op == OPERATOR_OR) {
        total_matches += 1;
        *current_output++ = current_row_index;
        break;
      }
      if (!did_match && op == OPERATOR_AND) {
        goto row_loop;
      }
    }
    if (op == OPERATOR_AND) {
      total_matches += 1;
      *current_output++ = current_row_index;
    }
    row_loop:;
  }

  return total_matches;
}

int main() {}
