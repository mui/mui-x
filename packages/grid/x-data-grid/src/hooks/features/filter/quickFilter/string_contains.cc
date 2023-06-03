#ifdef SIMD
#include "string_contains_simd128.cc"
#else
#include "string_contains_simple.cc"
#endif
