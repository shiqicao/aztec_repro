### Repro of default `EcdsaKAccount` failure

#### Steps

1. start pxe, `aztec start --sandbox`
2. run `npm i`
3. run `npm run repro`

pxe crashed, 
```
[23:44:18.492] INFO: pxe:service Added contract EcdsaRAccount at 0x1156c6ce5a8f9d706351ebf8f6c0e8b9797466fc9b0ba79b10b0a1f69b867810 with class 0x0fe7179ec5168554981018a03ec113666fd369ee6b622131035d8de5c3d64576
panicked at /home/aztec-dev/aztec-packages/noir/noir-repo/acvm-repo/brillig_vm/src/lib.rs:937:44:
index out of bounds: the len is 62 but the index is 62

Stack:

Error
    at module.exports.__wbg_new_8a6f238a6ece86ea (/usr/src/noir/packages/acvm_js/nodejs/acvm_js.js:692:17)
    at acvm_js.wasm.__wbg_new_8a6f238a6ece86ea externref shim (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[2474]:0x180d42)
    at acvm_js.wasm.console_error_panic_hook::hook::h3264e1684bed83f9 (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[793]:0x134289)
    at acvm_js.wasm.core::ops::function::Fn::call::h159c31fe505fba7d (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[2765]:0x181ebb)
    at acvm_js.wasm.std::panicking::rust_panic_with_hook::hb39abb160cd4038c (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[1485]:0x16bc46)
    at acvm_js.wasm.std::panicking::begin_panic_handler::{{closure}}::h83b3d84f04c7372b (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[1593]:0x17093d)
    at acvm_js.wasm.std::sys::backtrace::__rust_end_short_backtrace::h8eb99c908c86e40b (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[2753]:0x181e4d)
    at acvm_js.wasm.rust_begin_unwind (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[2224]:0x17eeab)
    at acvm_js.wasm.core::panicking::panic_fmt::h6f4dae69dcc1a6d2 (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[2225]:0x17eed7)
    at acvm_js.wasm.core::panicking::panic_bounds_check::h0e5544bfd55094cb (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[1783]:0x176e07)


wasm://wasm/acvm_js.wasm-00933f72:1


RuntimeError: unreachable
    at acvm_js.wasm.__rust_start_panic (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[2794]:0x181f81)
    at acvm_js.wasm.rust_panic (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[2572]:0x18152e)
    at acvm_js.wasm.std::panicking::rust_panic_with_hook::hb39abb160cd4038c (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[1485]:0x16bc71)
    at acvm_js.wasm.std::panicking::begin_panic_handler::{{closure}}::h83b3d84f04c7372b (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[1593]:0x17093d)
    at acvm_js.wasm.std::sys::backtrace::__rust_end_short_backtrace::h8eb99c908c86e40b (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[2753]:0x181e4d)
    at acvm_js.wasm.rust_begin_unwind (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[2224]:0x17eeab)
    at acvm_js.wasm.core::panicking::panic_fmt::h6f4dae69dcc1a6d2 (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[2225]:0x17eed7)
    at acvm_js.wasm.core::panicking::panic_bounds_check::h0e5544bfd55094cb (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[1783]:0x176e07)
    at acvm_js.wasm.brillig_vm::VM<F,B>::write_slice_of_values_to_memory::h920db0c2c6a70883 (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[221]:0xb32e2)
    at acvm_js.wasm.brillig_vm::VM<F,B>::process_opcodes::h2620498cc9f4ad33 (wasm://wasm/acvm_js.wasm-00933f72:wasm-function[61]:0x18960)

Node.js v22.16.0
```
