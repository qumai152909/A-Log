const after = (times, callback) => () => --times && times > 0 || callback();
const validArguments = methods => {
  /**
   * methods 必须是一个function 数组, 里面的每一个元素都是function
   */
  if (!methods.every(m => typeof m === 'function')) {
    throw new Error(' The first parameter must be an Array with Function .');
  }
};

export const waterfall = (methods, callback) => {
  validArguments(methods);
  function recurrence(index, args) {
    let method = methods[index];
    if (typeof method === 'function') {
      let cb = function(err, data) {
        if (err) {
          return callback && callback(err, data);
        }
        return recurrence(++index, data);
      };
      typeof args === 'undefined' ? method(cb) : method(args, cb);
    } else {
      return callback && callback(null, args);
    }
  }
  recurrence(0);
};

export const concurrent = (methods, callback) => {
  validArguments(methods);
  let cb = after(methods.length, callback);
  methods.forEach(method => method(cb));
};

