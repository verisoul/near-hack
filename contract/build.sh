#!/bin/sh

echo ">> Building Verisoul contract"

near-sdk-js build src/verisoul_contract.ts build/verisoul.wasm


#echo ">> Building greeting contract"
#
#near-sdk-js build src/greeting_contract.ts build/hello_near.wasm
