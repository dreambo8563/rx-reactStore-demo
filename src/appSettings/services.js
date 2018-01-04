import {store$} from 'store'

const userInfo = store$.userInfo

/**
 * 发布用户信息
 *
 * @export
 * @param {any} obj
 */
export function changeUserInfo(obj) {
    userInfo
        .updateStore
        .next({
            ...obj
        })
}
