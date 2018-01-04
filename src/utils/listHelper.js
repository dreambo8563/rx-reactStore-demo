// @ts-check
const R = require('ramda')

/**
 *获取枚举field字段为'key'对应的对象
 *list 为枚举数组 key为对应查找的字段值
 * @param {array} list
 * @param {any} key
 * @return {key:xxx,value:yyy}
 */
export const getMatchedValue = R.curry((list, key, field = 'key') => R.find(R.propEq(field, key))(list) || {})

/**
 * 检查item中的key是否包含在values这个数组里
 *
 * @param {any} key
 * @param {any} values
 * @param {any} item
 */
const isContained = R.curry((key, values, item) => R.contains(item[key], values))

/**
 * 获取 list中 对应key值包含在values中的所有元素
 *
 * @param {any} list
 * @param {any} key
 * @param {any} values
 */
export const getContainsValus = (list, key, values) => R.filter(isContained(key, values), list)

/**
 *针对Cascader 需要的基础数据的处理函数
 *
 * @param {any} arr
 * @param {any} labelName
 * @param {any} valueName
 */
export const enumTransform = (arr, labelName = 'value', valueName = 'key') =>
  arr.map(item => {
    var obj = {
      label: item[labelName],
      value: item[valueName]
    }
    if (item.children) {
      obj.children = enumTransform(item.children, labelName, valueName)
    }
    return obj
  })

export const depTreeTransform = (arr, labelName = 'value', valueName = 'key', key = 'key') =>
  arr.map(item => {
    var obj = {
      label: item[labelName],
      value: item[valueName],
      key: item[key]
    }
    if (item.childList) {
      obj.children = depTreeTransform(item.childList, labelName, valueName, key)
    }
    return obj
  })

/**
 * 城市选择器,数据重构
 *
 * @param {any} obj
 */
const mapCityObj = obj => ({
  ...obj,
  label: obj.city_name,
  value: obj.city_code
})

/**
 * 城市选择器,数据重构
 *
 * @param {any} obj
 */
const mapCityByAlphabet = obj =>
  Object.keys(obj).map(key => ({
    label: key,
    value: key,
    pinyin: key,
    short_pinyin: key,
    children: obj[key].map(mapCityObj)
  }))

/**
 * 城市选择器,数据重构
 *
 * @param {any} obj
 */
export const citySelectorTransform = obj => [
  {
    value: 'hot',
    label: '热门',
    pinyin: 'hot',
    short_pinyin: '',
    children: obj.hot_city_list.map(mapCityObj)
  },
  {
    value: 'ABCD',
    label: 'ABCD',
    pinyin: 'abcd',
    short_pinyin: 'abcd',
    children: mapCityByAlphabet(obj.ABCD)
  }
  // {
  //   value: 'EFGH',
  //   label: 'EFGH',
  //   pinyin: 'efgh',
  //   short_pinyin: 'efgh',
  //   children: mapCityByAlphabet(obj.EFGH)
  // },
  // {
  //   value: 'JKLM',
  //   label: 'JKLM',
  //   pinyin: 'jklm',
  //   short_pinyin: 'jklm',
  //   children: mapCityByAlphabet(obj.JKLM)
  // },
  // {
  //   value: 'NOPQRS',
  //   label: 'NOPQRS',
  //   pinyin: 'nopqrs',
  //   short_pinyin: 'nopqrs',
  //   children: mapCityByAlphabet(obj.NOPQRS)
  // },
  // {
  //   value: 'TUVWX',
  //   label: 'TUVWX',
  //   pinyin: 'tuvwx',
  //   short_pinyin: 'tuvwx',
  //   children: mapCityByAlphabet(obj.TUVWX)
  // },
  // {
  //   value: 'YZ',
  //   label: 'YZ',
  //   pinyin: 'yx',
  //   short_pinyin: 'yx',
  //   children: mapCityByAlphabet(obj.YZ)
  // }
]
// FIXME:联调时需要打开上面注释
/**
 * 针对Cascader 根据key 拿到对应的 名字数组
 *
 * @param {any} arr
 * @param {any} values
 * @param {any} labelName
 * @returns
 */
export const getEnumLabels = (arr, values, labelName) => {
  if (!arr || arr.length === 0) {
    return undefined
  }
  var result = []
  var arrs = arr
  values.forEach(v => {
    const obj = getMatchedValue(arrs, v, labelName)
    result.push(obj.label)
    arrs = obj.children
  })
  return result
}

/**
 * 针对单一级别的Cascader,批量取值开包
 *
 * @param {any} arr
 * @param {any} obj
 */
export const unboxSingleCascader = (arr, obj) => {
  arr.forEach(key => {
    obj[key] = obj[key][0]
  })
  return obj
}
