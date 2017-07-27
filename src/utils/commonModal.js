import { store$ } from 'store'
/**
 * 弹确认框
 *
 * @param {any} title
 * @param {any} content
 * @param {any} [onOk=() => {}]
 * @param {any} [onCancel=() => {}]
 */
export const showConfirm = (
  title,
  content,
  onOk = () => {},
  onCancel = () => {}
) => {
  store$.updateStore.next({
    confirm: {
      title,
      content,
      onOk,
      onCancel
    }
  })
}

export const clearConfirm = () => {
  showConfirm(undefined, undefined, () => {}, () => {})
}

/**
 * 成功提示
 *
 * @param {any} title
 * @param {any} content
 */
export const showSuccess = (title, content, cb = undefined) => {
  store$.updateStore.next({
    success: {
      title,
      content,
      cb
    }
  })
}

export const clearSuccess = () => {
  showSuccess(undefined, undefined, undefined)
}
