const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// 这个方法对于FormData、ArrayBuffer这些类型也判断为true
// export function isObject(val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }

//这个方法只对json对象才能满足
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}
