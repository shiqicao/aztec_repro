### Repro of default `EcdsaKAccount` failure

#### Steps

1. start pxe, `aztec start --sandbox`
2. run `npm i`
3. run `npm run repro`

Whereas `SchnorrAccount` passes, comment out line of `getEcdsaKAccount` and uncomment `getSchnorrAccount`, then run `npm run repro`

