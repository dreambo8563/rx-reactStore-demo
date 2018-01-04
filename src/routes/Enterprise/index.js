import { enterpriseListPage, enterpriseDetailPage } from 'constants/URL'

export const EnterpriseListRoute = () => ({
  /*  Async getComponent is only invoked when route matches   */
  path: enterpriseListPage,
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const EnterpriseList = require('./components/EnterpriseList').default
        const EnterpriseListTitle = require('./title/EnterpriseListTitle')
          .default

        cb(null, {
          title: EnterpriseListTitle,
          content: EnterpriseList
        })

        /* Webpack named bundle   */
      },
      'EnterpriseList'
    )
  }
})

export const EnterpriseDetailRoute = () => ({
  /*  Async getComponent is only invoked when route matches   */
  path: enterpriseDetailPage(),
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const EnterpriseDetail = require('./components/EnterpriseDetail')
          .default
        const EnterpriseDetailTitle = require('./title/EnterpriseDetailTitle')
          .default

        cb(null, {
          title: EnterpriseDetailTitle,
          content: EnterpriseDetail
        })

        /* Webpack named bundle   */
      },
      'EnterpriseDetail'
    )
  }
})
