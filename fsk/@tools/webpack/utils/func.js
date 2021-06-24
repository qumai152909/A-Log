function overwrite(obj1, obj2) {
  const func = (o1={}, o2, key) => {
    if(!key){
      Object.keys(o2).forEach((v) => func(o1, o2[v], v))      
    } else if (toString.call(o2) === '[object Object]') {
      o1[key] = o1[key] || {}
      Object.keys(o2).forEach((v) => {
        func(o1[key], o2[v], v)
      })      
    } else if (typeof o2 === 'function') {
      o1[key] = o2(o1)
    } else if (Array.isArray(o2)) {
      o1[key] = o1[key] || []
      o1[key] = [...new Set(o1[key].concat(o2))]    
    } else {
      o1[key] = o2
    }
    return o1
  }
  return func(obj1, obj2)
}

module.exports = {
  overwrite
}



