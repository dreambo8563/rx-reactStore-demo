import moment from 'moment'
/**
 * 对数字进行千分位的分割
 *
 * @export
 * @param {any} number
 * @returns
 */
export function moneyFormat(number, separator = ',') {
  return Array.from(String(number))
    .reverse()
    .map((v, i) => {
      if (i % 3 === 0 && i !== 0) {
        return `${v}${separator}`
      }
      return v
    })
    .reverse()
    .join('')
}

/**
 * 生成绝对路径
 *
 * @export
 * @param {any} relPath
 * @returns
 */
export function absPath(relPath) {
  return `${location.protocol}//${location.host}${relPath}`
}

/**
 * 时间戳转换成需要的格式
 *
 * @param {any} ts
 * @param {any} format
 */
export const timestampToString = (ts, format = 'YY-MM-DD HH:mm') =>
  moment(ts).format(format)
