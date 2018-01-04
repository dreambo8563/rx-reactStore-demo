import 'shared/main'
import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import AppContainer from 'shared/AppContainer'
import { getStore } from 'store'
import moment from 'moment'

// It's recommended to set locale in entry file globaly.
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
import 'babel-polyfill'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'
OfflinePluginRuntime.install()
// if (process.env.NODE_ENV !== 'production') {
//   ;(function() {
//     if ('serviceWorker' in navigator) {
//       navigator.serviceWorker.register('/my-service-worker.js')
//     }
//   })()
// }

const store = getStore()

let render = () => {
  const routes = require('./routes/index').default(store)

  ReactDOM.render(
    <AppContainer store={store} history={browserHistory} routes={routes} />,
    document.getElementById('app')
  )
}

render()

if (module.hot) {
  module.hot.accept('./routes/index', () => render())
}
