import { notFoundPage } from 'constants/URL'

export const NotFound = () => ({
  /*  Async getComponent is only invoked when route matches   */
  path: notFoundPage,
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const NotFound = require('./components/NotFound').default

        cb(null, { content: NotFound })

        /* Webpack named bundle   */
      },
      'NotFound'
    )
  }
})
