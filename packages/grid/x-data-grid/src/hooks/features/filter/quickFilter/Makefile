#
# Makefile
#

WFLAGS := -Wl,--export-all -Wl,--no-entry -Wl,--allow-undefined
CFLAGS := --target=wasm32-unknown-unknown-wasm --optimize=3 -nostdlib $(WFLAGS)

all: build_simd

build_simd:
	clang++ $(CFLAGS) module.cc --output module-simd128.wasm -msimd128 -DSIMD

build_nosimd:
	clang++ $(CFLAGS) module.cc --output module-nosimd.wasm


# vim:ft=make
