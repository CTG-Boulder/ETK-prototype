// import { performance } from 'perf_hooks'
import { KeyEncoder } from '~/../native/index.node'

const keyEncoder = new KeyEncoder()
const PRIME = keyEncoder.getPrime()

export function encodeKey(key) {
  return keyEncoder.encode(key)
}

export function encodeKeysAndShuffle(keys){
  return keyEncoder.encodeManyAndShuffle(keys)
}

export function getPrime(){
  return PRIME
}

// function random16Hex() {
//   return (0x10000 | Math.random() * 0x10000).toString(16).substr(1)
// }

// function random128Hex(){
//   return random16Hex() +
//     random16Hex() +
//     random16Hex() +
//     random16Hex() +
//     random16Hex() +
//     random16Hex() +
//     random16Hex() +
//     random16Hex()
// }

// function speedTest(){
//   let n = 10000
//   let keys = []
//   for (let i = 0; i < n; i++){
//     let k = random128Hex()
//     keys.push(k)
//   }

//   let start = performance.now()
//   let encoded = encodeKeysAndShuffle(keys)
//   let time = (performance.now() - start) / 1000
//   console.log('Finished in ' + time + ' seconds')
//   return time
// }

// setTimeout(() => {
//   let trials = 10
//   let totalTime = 0
//   for (let t = 0; t < trials; t++){
//     totalTime += speedTest()
//   }

//   console.log(`average time over ${trials} trials: ${totalTime/trials} seconds`)
// }, 5000)
