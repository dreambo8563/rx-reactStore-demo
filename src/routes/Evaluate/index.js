import { applyDetailPage, applyDraftPage } from 'constants/URL'

export const EvaluateListRoute = () => ({
  /*  Async getComponent is only invoked when route matches   */
  // path: evaluateListPage,
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const EvaluateList = require('./components/EvaluateList').default
        const EvaluateListTitle = require('./title/EvaluateListTitle').default

        cb(null, {
          title: EvaluateListTitle,
          content: EvaluateList
        })

        /* Webpack named bundle   */
      },
      'EvalutateList'
    )
  }
})

export const ApplyDetailRoute = () => ({
  /*  Async getComponent is only invoked when route matches   */
  path: applyDetailPage(),
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const ApplyDetail = require('./components/ApplyDetail').default
        const ApplyDetailTitle = require('./title/ApplyDetailTitle').default

        cb(null, {
          title: ApplyDetailTitle,
          content: ApplyDetail
        })

        /* Webpack named bundle   */
      },
      'ApplyDetail'
    )
  }
})
export const ApplyDraftRoute = () => ({
  /*  Async getComponent is only invoked when route matches   */
  path: applyDraftPage,
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const ApplyDraftPage = require('./components/ApplyDraftPage').default
        const ApplyDraftTitle = require('./title/ApplyDraftTitle').default

        cb(null, {
          title: ApplyDraftTitle,
          content: ApplyDraftPage
        })

        /* Webpack named bundle   */
      },
      'ApplyDraftPage'
    )
  }
})
