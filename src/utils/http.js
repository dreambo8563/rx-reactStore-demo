import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/dom/ajax'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/from'
import 'rxjs/add/observable/forkjoin'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/reduce'
import { store$ } from 'store'
import { notFoundPage, loginPage, rootPage } from 'constants/URL'
import { networkError, timeoutTip, authorizationError, authorizationDesc, sysError, systErrorDes } from 'constants/TEXT'
import { showError, hasResponseError } from 'utils/errorHandler'
import { navigateTo, changePath } from 'utils/navigate'
import { absPath } from 'utils/format'
import { compactObj } from 'utils/objHelper'
const R = require('ramda')

// ---------------------------------------------------------
// 请求前URL 或者 数据处理
const joinQS = (x, y) => `${x}=${encodeURIComponent(Array.isArray(y) ? y.join(',') : y)}`

// 根据参数obj 生成queryString
export const queryStrings = params => `?${R.zipWith(joinQS, Object.keys(params), Object.values(params)).join('&')}`

// url和queryString 合并
export const combineQS = R.curry((url, qs) => `${url}${qs}`)

// 传入formData 先压缩,然后自定义处理方法得到处理结果,适合post
export const formDataProcess = processData => R.compose(compactObj, processData)

// 专门为用qs的get请求用的组合函数
export const searchWithQS = (url, params) => {
  return jsonGet(combineQS(url)(queryStrings(params)))
}

// ------------------------------------------------------------------------

// -----------------------------------------------------------------------
// 请求相关
// 默认请求参数
const defaultOption = {
  crossDomain: true,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Token': (document.cookie.split(';').filter(item => item.trim().startsWith('token'))[0] || '').split('=')[1] || ''
  }
}

/**
 * 通用错误处理
 *
 * @param {any} res
 * @returns
 */
const filterErrorResponse = res => {
  if (res.status === 403 || res.status === 401) {
    showError(authorizationError, authorizationDesc, () => navigateTo(loginPage))
    return false
  }
  if (res.status === 404) {
    navigateTo(notFoundPage)
    return false
  }
  if (res.status >= 500) {
    showError(sysError, systErrorDes, () => changePath(absPath(rootPage)))
    return false
  }
  if (res.status === 0) {
    showError(networkError, timeoutTip)
    return false
  }
  return true
}

/**
 * 通用请求处理 - 过滤错误响应,默认配置
 *
 * @param {any} options
 * @returns
 */
export const jsonCommon = options => {
  store$.updateStore.next({ loading: true })
  return Observable.ajax({
    ...defaultOption,
    ...options
  })
    .catch(err => Observable.of(err))
    .filter(res => {
      store$.updateStore.next({ loading: false })
      if (res.status === 200 || res.status === 201) {
        return true
      }
      return filterErrorResponse(res)
    })
    .map(res => res.response)
    .filter(hasResponseError)
}

/**
 * Get方法
 *
 * @param {any} url
 * @returns
 */
export const jsonGet = url => {
  return jsonCommon({ method: 'GET', url })
}

/**
 * post 方法
 *
 * @param {any} url
 * @param {any} body
 * @returns
 */
export const jsonPost = (url, body) => {
  return jsonCommon({ method: 'POST', url, body })
}

/**
 * Put 方法
 *
 * @param {any} url
 * @param {any} body
 * @returns
 */
export const jsonPut = (url, body) => {
  return jsonCommon({ method: 'PUT', url, body })
}

/**
 * Delete 方法
 *
 * @param {any} url
 * @returns
 */
export const jsonDelete = url => {
  return jsonCommon({ method: 'DELETE', url })
}

/**
 *多个请求时等都完成才返回
 例子: allFinishedFor([
            {
                url: 'http://jsonplaceholder.typicode.com/posts',
                method: 'GET'
            }, {
                url: 'http://jsonplaceholder.typicode.com/posts',
                method: 'POST',
                body: {
                    title: 'foo',
                    body: 'bar',
                    userId: 2
                }
            }, {
                url: 'http://jsonplaceholder.typicode.com/posts/1',
                method: 'DELETE'
            }
        ]).subscribe(x => console.log(x, 'forkjoin'))
 * @param {any} arr
 * @returns
 */
export const allFinishedFor = arr => {
  const obsArr = arr.map(x =>
    Observable.ajax({
      ...defaultOption,
      ...x
    })
  )
  store$.updateStore.next({ loading: true })
  return Observable.forkJoin(obsArr)
    .catch(e => Observable.of(e))
    .filter(res => {
      store$.updateStore.next({ loading: false })
      return filterErrorResponse(res)
    })
    .map(arr => arr.map(item => item.response))
}

export const startLoading = () => store$.updateStore.next({ loading: true })
export const stopLoading = () => store$.updateStore.next({ loading: false })
