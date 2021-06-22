const p1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, 'one');
});
const p2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 2000, 'two');
});
const p3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 3000, 'three');
});
const p4 = new Promise((resolve, reject) => {
  setTimeout(resolve, 4000, 'four');
});
const p5 = new Promise((resolve, reject) => {
  //reject('reject');
  setTimeout(reject, 6000, 'reject');
});

Promise.all([p1, p2, p3, p4, p5]).then(values => {
  console.log(values);
}).catch(reason => {
  console.log(reason)
});

// reject
