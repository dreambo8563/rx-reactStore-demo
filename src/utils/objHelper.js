const R = require('ramda')

/**
 * 去除掉value为undefined 或者null,[],'',"",{} 的key
 * params 可以是obj也可以是array
 * @export
 * @param {any} params
 * @returns
 */
export const compactObj = params =>
  R.filter(x => R.not(R.either(R.isEmpty, R.isNil)(x)), params)

/**
 *获取深嵌套的值,如果没有返回undefined
 *一般用于if判断 path 为路径的数组
 * @param {any} path
 * @param {any} obj
 */
export const hasProp = (path, obj) => R.path(path, obj)

/**
 *获取嵌套的值,否则返回默认值
 *一般用于判断后赋值 path 为路径的数组
 * @param {any} defaultValue
 * @param {any} path
 * @param {any} obj
 */
export const getOrElse = (defaultValue, path, obj) =>
  R.pathOr(defaultValue, path, obj)

/**
 * 转换 obj 中 左右包含在arr中的字段为int型
 * 仅当obj中包含此字段时才会转换
 * 如果此字段为空或者undefined null,不执行转换
 * @param {any} arr
 * @param {any} obj
 * @returns
 */
export const convertInt = R.curry((arr, obj) => {
  var copyObj = obj
  arr.forEach(key => {
    if (
      R.not(R.either(R.isEmpty, R.isNil)(copyObj[key])) &&
      !R.propIs(Number, key, copyObj)
    ) {
      copyObj[key] = parseInt(copyObj[key])
    }
  })
  return copyObj
})
