import { KeyEncoder } from '~/../native/index.node'

const keyEncoder = new KeyEncoder()
const PRIME = keyEncoder.getPrime()

export function encodeKey(key) {
  return keyEncoder.encode(key)
}

export function encodeKeys(keys){
  // TODO move this into rust
  return keys.map(k => encodeKey(k) )
}

export function getPrime(){
  return PRIME
}
