import { browserHistory } from 'react-router'

/**
 * 页面跳转
 *
 */
export const navigateTo = browserHistory.push

/**
 * 地址栏跳转
 *
 * @param {any} url
 */
export const changePath = url => {
  location.href = url
}

// 干掉当前的路由历史,直接跳转
export const navigateReplace = browserHistory.replace

// 后退
export const goBack = browserHistory.goBack
