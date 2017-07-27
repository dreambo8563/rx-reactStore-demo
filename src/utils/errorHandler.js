import { store$ } from 'store'
import { errorModalTitle } from 'constants/TEXT'
import { requestSuccessCode } from 'constants/Enum'

/**
 * 发布错误消息
 *
 * @param {any} title
 * @param {any} content
 */
export const showError = (title, content, cb = undefined) => {
  store$.updateStore.next({
    error: {
      title,
      content,
      cb
    }
  })
}

/**
 * 判断响应码
 *
 * @param {any} res
 * @returns
 */
export const hasResponseError = res => {
  if (res.code !== requestSuccessCode) {
    showError(errorModalTitle, res.msg)
    return false
  }
  return true
}

export const clearError = () => {
  showError(undefined, undefined, undefined)
}
