const config = require('../config/index.json')
for (let k in config) {
  let s = config[k]
  console.log(`${k}: ip:${s.ip} localRoot:${s.local} remote:${s.remote}`)
}
