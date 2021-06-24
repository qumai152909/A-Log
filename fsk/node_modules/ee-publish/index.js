// [1,2,3,4,5,6,7].reduce((a, b) => {
//   return a.then(() => new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log(b, '----')
//       resolve()
//     }, Math.random() * 100)
//   }))
// }, Promise.resolve()).then(() => console.log(123))
//   Promise.all([1,2,3,4,5,6,7].map(i => new Promise((resolve, reject) => {
//   setTimeout(() => {
//     console.log(i)
//     resolve()
//   }, Math.random() * 100)
// }))).then(() => console.log(0))